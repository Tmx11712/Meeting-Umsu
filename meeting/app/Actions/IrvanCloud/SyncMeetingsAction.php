<?php

namespace App\Actions\IrvanCloud;

use App\Actions\Meetings\SyncMeetingAttendanceAction;
use App\Actions\Meetings\UpsertMeetingAction;
use App\Actions\Users\UpsertUserFromExternalAction;
use Illuminate\Support\Facades\Log;

/**
 * [EDUKASI ARSITEKTUR: ORCHESTRATOR PATTERN]
 * Class ini bertindak sebagai "Mandor" (Orchestrator). Ia tidak melakukan insert/update DB secara langsung, 
 * melainkan memanggil Action-Action lain yang lebih kecil (UpsertMeetingAction, UpsertUserAction, dll) secara berurutan.
 * Ini mencegah kelas ini menjadi terlalu gendut (God Class) dan mempertahankan kemudahan Testing.
 */
class SyncMeetingsAction
{
    protected FetchEventsFromApiAction $fetchEvents;
    protected FetchEventDetailsFromApiAction $fetchEventDetails;
    protected UpsertMeetingAction $upsertMeeting;
    protected UpsertUserFromExternalAction $upsertUser;
    protected SyncMeetingAttendanceAction $syncAttendance;

    public function __construct(
        FetchEventsFromApiAction $fetchEvents,
        FetchEventDetailsFromApiAction $fetchEventDetails,
        UpsertMeetingAction $upsertMeeting,
        UpsertUserFromExternalAction $upsertUser,
        SyncMeetingAttendanceAction $syncAttendance
    ) {
        $this->fetchEvents = $fetchEvents;
        $this->fetchEventDetails = $fetchEventDetails;
        $this->upsertMeeting = $upsertMeeting;
        $this->upsertUser = $upsertUser;
        $this->syncAttendance = $syncAttendance;
    }

    /**
     * Orchestrates the fetching and syncing of meetings from Irvan Cloud.
     *
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function execute(?string $startDate = null, ?string $endDate = null): array
    {
        if (! $startDate) {
            $startDate = now()->subMonths(3)->startOfMonth()->format('Y-m-d');
        }
        if (! $endDate) {
            $endDate = now()->addMonths(3)->endOfMonth()->format('Y-m-d');
        }

        try {
            $events = $this->fetchEvents->execute($startDate, $endDate);
            $syncedCount = 0;

            foreach ($events as $event) {
                // We only care about meetings
                if (! isset($event['is_meeting']) || ! $event['is_meeting']) {
                    continue;
                }

                // Upsert Meeting
                $upsertResult = $this->upsertMeeting->execute($event);
                $meeting = $upsertResult['meeting'];

                if ($upsertResult['wasRecentlyCreated']) {
                    $syncedCount++;
                }

                // Fetch & Sync Participants Details
                $details = $this->fetchEventDetails->execute($event['id']);
                
                if ($details && isset($details['data']['participants'])) {
                    foreach ($details['data']['participants'] as $participantData) {
                        $user = $this->upsertUser->execute($participantData);
                        
                        if ($user) {
                            $this->syncAttendance->execute($participantData, $meeting, $user);
                        }
                    }
                }
            }

            if ($syncedCount > 0) {
                safe_broadcast(new \App\Events\MeetingsListUpdated('Terdapat ' . $syncedCount . ' rapat baru dari sinkronisasi Irvan Cloud'));
            }

            return [
                'success' => true, 
                'message' => "Berhasil sinkronisasi {$syncedCount} rapat baru dari Irvan Cloud."
            ];

        } catch (\Exception $e) {
            Log::error('Exception during Irvan Cloud sync: '.$e->getMessage());

            return [
                'success' => false, 
                'message' => 'Terjadi kesalahan sistem saat sinkronisasi: '.$e->getMessage()
            ];
        }
    }
}
