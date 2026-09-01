<?php

namespace App\Actions\Meetings;

use App\Models\Meeting;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

/**
 * [EDUKASI ARSITEKTUR: UPSERT LOGIC]
 * Action ini menangani logika "Upsert" (Update if exists, Insert if new).
 * Sangat krusial dalam proses sinkronisasi agar ketika tombol sinkron ditekan berkali-kali,
 * data tidak terduplikasi.
 */
class UpsertMeetingAction
{
    /**
     * Create or update a meeting from external event data.
     *
     * @return array Contains the Meeting instance and a boolean 'wasRecentlyCreated'
     */
    public function execute(array $event): array
    {
        // Get a default super admin ID for created_by fallback
        $defaultAdminId = Auth::id();
        if (! $defaultAdminId) {
            $admin = User::query()->whereHas('roles', fn ($q) => $q->where('name', '=', 'Super Admin'))->first();
            $defaultAdminId = $admin ? $admin->id : null;
        }

        /**
         * [EDUKASI ARSITEKTUR: CEGAH DUPLIKASI]
         * Kita mencari berdasarkan 'external_id' (UUID dari Irvan Cloud).
         * Jika belum ada, kita `create` (Insert). Jika sudah ada, kita `update`.
         */
        $meeting = Meeting::query()->where('external_id', '=', $event['uuid'])->first();
        $wasRecentlyCreated = false;

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
            $wasRecentlyCreated = true;
        } else {
            // Update existing meeting details if needed
            $meeting->fill([
                'title' => $event['name'],
                'description' => $event['description'] ?? $meeting->description,
                'date' => $event['event_date'],
                'start_time' => $event['start_time'] ?? $meeting->start_time,
                'end_time' => $event['end_time'] ?? $meeting->end_time,
                'location' => $event['location'] ?? $meeting->location,
                'type' => $event['type'] ?? $meeting->type,
            ])->save();
        }

        return [
            'meeting' => $meeting,
            'wasRecentlyCreated' => $wasRecentlyCreated,
        ];
    }
}
