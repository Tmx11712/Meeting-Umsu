<?php

namespace App\Services;

use App\Models\Meeting;
use App\Models\MeetingAttendance;
use App\Models\MeetingParticipant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IrvanCloudSyncService
{
    protected $apiUrl;

    protected $apiKey;

    protected $secretKey;

    public function __construct()
    {
        // Remove trailing slash if exists for clean URL building
        $this->apiUrl = rtrim(env('ABSENSI_API_URL'), '/');
        $this->apiKey = env('ABSENSI_API_KEY');
        $this->secretKey = env('ABSENSI_SECRET_KEY');
    }

    /**
     * Sync meetings for a specific date range (defaults to current month)
     */
    public function syncMeetings($startDate = null, $endDate = null)
    {
        if (! $startDate) {
            $startDate = now()->startOfMonth()->format('Y-m-d');
        }
        if (! $endDate) {
            $endDate = now()->endOfMonth()->format('Y-m-d');
        }

        try {
            $response = Http::withHeaders([
                'X-API-KEY' => $this->apiKey,
                'X-SECRET-KEY' => $this->secretKey,
            ])->get("{$this->apiUrl}/api/event", [
                'page' => 1,
                'page_size' => 100, // Fetch up to 100 events
                'start_date' => $startDate,
                'end_date' => $endDate,
                'sort' => 'DESC',
            ]);

            if (! $response->successful()) {
                Log::error('Failed to sync from Irvan Cloud (Events)', ['status' => $response->status(), 'body' => $response->body()]);

                return ['success' => false, 'message' => 'Gagal terhubung ke API Irvan Cloud. Status: '.$response->status()];
            }

            $data = $response->json();
            $events = $data['data']['page_data'] ?? [];

            $syncedCount = 0;

            // Get a default super admin ID for created_by fallback
            $defaultAdminId = auth()->id();
            if (! $defaultAdminId) {
                $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Super Admin'))->first();
                $defaultAdminId = $admin ? $admin->id : null;
            }

            foreach ($events as $event) {
                // We only care about meetings
                if (! isset($event['is_meeting']) || ! $event['is_meeting']) {
                    continue;
                }

                // Check if meeting already exists by UUID (external_id)
                $meeting = Meeting::where('external_id', $event['uuid'])->first();

                if (! $meeting) {
                    $meeting = Meeting::create([
                        'title' => $event['name'],
                        'description' => $event['description'] ?? '',
                        'date' => $event['event_date'],
                        'start_time' => $event['start_time'] ?? '08:00:00',
                        'end_time' => $event['end_time'] ?? '10:00:00',
                        'location' => $event['location'] ?? ($event['type'] == 'online' ? ($event['link'] ?? 'Online') : 'Ruang Rapat'),
                        'type' => $event['type'] ?? 'offline',
                        'status' => 'terjadwal',
                        'source' => 'irvan_cloud',
                        'external_id' => $event['uuid'],
                        'created_by' => $defaultAdminId,
                        'current_stage' => 2, // Skip Stage 1 (Buat Rapat) and start at Stage 2 (Humas Rekam)
                    ]);
                    $syncedCount++;
                } else {
                    // Update existing meeting details if needed
                    $meeting->update([
                        'title' => $event['name'],
                        'description' => $event['description'] ?? $meeting->description,
                        'date' => $event['event_date'],
                        'start_time' => $event['start_time'] ?? $meeting->start_time,
                        'end_time' => $event['end_time'] ?? $meeting->end_time,
                        'location' => $event['location'] ?? $meeting->location,
                        'type' => $event['type'] ?? $meeting->type,
                    ]);
                }

                // Now sync details for this specific event to get participants
                $this->syncEventDetails($event['id'], $meeting);
            }

            return ['success' => true, 'message' => "Berhasil sinkronisasi {$syncedCount} rapat baru dari Irvan Cloud."];

        } catch (\Exception $e) {
            Log::error('Exception during Irvan Cloud sync: '.$e->getMessage());

            return ['success' => false, 'message' => 'Terjadi kesalahan sistem saat sinkronisasi: '.$e->getMessage()];
        }
    }

    /**
     * Sync details (participants) for a specific event
     */
    public function syncEventDetails($eventId, Meeting $meeting)
    {
        try {
            $response = Http::withHeaders([
                'X-API-KEY' => $this->apiKey,
                'X-SECRET-KEY' => $this->secretKey,
            ])->get("{$this->apiUrl}/api/event/{$eventId}");

            if (! $response->successful()) {
                Log::warning("Failed to fetch details for event ID {$eventId}", ['status' => $response->status()]);

                return false;
            }

            $data = $response->json();
            $participants = $data['data']['participants'] ?? [];

            foreach ($participants as $p) {
                if (empty($p['email'])) {
                    continue;
                }

                // 1. Check or Create User based on email
                $user = User::where('email', $p['email'])->first();
                if (! $user) {
                    $fullname = $p['fullname'] ?? explode('@', $p['email'])[0];
                    $user = User::create([
                        'name' => $fullname,
                        'email' => $p['email'],
                        'password' => Hash::make('password123'), // Default password
                        'department' => 'Umum', // Default fallback
                        'position' => 'Staff',
                        'phone' => null,
                        'is_active' => true,
                    ]);
                    // Assign Viewer role
                    $user->assignRole('Viewer');
                }

                // 2. Add as Meeting Participant
                $participant = MeetingParticipant::firstOrCreate([
                    'meeting_id' => $meeting->id,
                    'user_id' => $user->id,
                ]);

                // 3. Update Attendance if scanned (scanned_at is present)
                if (! empty($p['scanned_at'])) {
                    // Try to parse the scanned_at time. API returns ISO8601 (e.g., 2026-05-25T09:53:32.000Z)
                    $checkInTime = Carbon::parse($p['scanned_at'])->setTimezone(config('app.timezone'));

                    MeetingAttendance::updateOrCreate(
                        [
                            'meeting_id' => $meeting->id,
                            'user_id' => $user->id,
                        ],
                        [
                            'status' => 'hadir',
                            'check_in_time' => $checkInTime,
                            'method' => 'irvan_cloud_app',
                            'recorded_by' => null,
                        ]
                    );
                } else {
                    // Ensure an attendance record exists with status tidak_hadir if they are a participant but haven't scanned yet
                    MeetingAttendance::firstOrCreate(
                        [
                            'meeting_id' => $meeting->id,
                            'user_id' => $user->id,
                        ],
                        [
                            'status' => 'tidak_hadir',
                            'method' => 'irvan_cloud_app',
                        ]
                    );
                }
            }

            return true;

        } catch (\Exception $e) {
            Log::error("Failed to sync details for event ID {$eventId}: ".$e->getMessage());

            return false;
        }
    }
}
