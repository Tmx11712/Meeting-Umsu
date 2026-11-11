<?php

namespace App\Actions\IrvanCloud;

use App\Actions\Meetings\SyncMeetingAttendanceAction;
use App\Actions\Meetings\UpsertMeetingAction;
use App\Actions\Users\UpsertUserFromExternalAction;
use App\Events\MeetingsListUpdated;
use App\Models\Meeting;
use Illuminate\Support\Facades\DB;
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
     */
    public function execute(?string $startDate = null, ?string $endDate = null): array
    {
        if (! $startDate) {
            // Fokus pada rentang rapat aktif (H-30 s.d H+60) agar sinkronisasi cepat dan aman dari batas paginasi 100 item
            $startDate = now()->subDays(30)->format('Y-m-d');
        }
        if (! $endDate) {
            $endDate = now()->addDays(60)->endOfMonth()->format('Y-m-d');
        }

        try {
            $events = $this->fetchEvents->execute($startDate, $endDate);
            $syncedCount = 0;
            $deletedCount = 0;

            $finishedExternalIds = Meeting::query()
                ->where('source', '=', 'irvan_cloud')
                ->where(function ($q) {
                    $q->where('status', '=', 'selesai')
                        ->orWhere('current_stage', '>=', 5);
                })
                ->pluck('external_id')
                ->all();

            // Phase 1: Fetch all data first (Do NOT hold DB locks during HTTP requests)
            $meetingsToProcess = [];
            foreach ($events as $event) {
                if (! isset($event['is_meeting']) || ! $event['is_meeting']) {
                    continue;
                }

                $isAlreadyFinished = ! empty($event['uuid']) && in_array($event['uuid'], $finishedExternalIds, true);
                $details = $isAlreadyFinished ? null : $this->fetchEventDetails->execute($event['id']);
                $meetingsToProcess[] = [
                    'event' => $event,
                    'details' => $details,
                ];
            }

            // Phase 2: Perform all database writes inside a transaction
            $orphanedIdsToDestroy = [];

            DB::transaction(function () use ($meetingsToProcess, $events, &$syncedCount, &$orphanedIdsToDestroy, $startDate, $endDate) {
                $activeUuids = [];

                foreach ($meetingsToProcess as $data) {
                    $event = $data['event'];
                    $details = $data['details'];

                    if (! empty($event['uuid'])) {
                        $activeUuids[] = $event['uuid'];
                    }

                    // Upsert Meeting (termasuk memulihkan jika sebelumnya terhapus)
                    $upsertResult = $this->upsertMeeting->execute($event);
                    $meeting = $upsertResult['meeting'];

                    if ($upsertResult['wasRecentlyCreated']) {
                        $syncedCount++;
                    }

                    $this->syncParticipantsFromDetails($details, $meeting);
                }

                // Kumpulkan rapat yatim yang sudah dihapus di Irvan Cloud
                // Hanya jalankan jika daftar rapat tidak kosong dan tidak terpotong batas paginasi (100 item)
                if (! empty($activeUuids) && count($events) < 100) {
                    $orphanedIdsToDestroy = Meeting::query()
                        ->where('source', '=', 'irvan_cloud')
                        ->where('current_stage', '<', 7)
                        ->where('date', '>=', $startDate)
                        ->where('date', '<=', $endDate)
                        ->whereNotIn('external_id', $activeUuids, 'and')
                        ->pluck('id')
                        ->all();
                }
            });

            // Phase 3: Hapus rapat yatim di luar DB transaction agar operasi S3/MinIO di Meeting::deleting tidak menahan lock
            foreach ($orphanedIdsToDestroy as $orphanedId) {
                Meeting::destroy($orphanedId);
                $deletedCount++;
            }

            if ($syncedCount > 0 || $deletedCount > 0) {
                $broadcastMsg = 'Sinkronisasi Irvan Cloud selesai: ';
                if ($syncedCount > 0) {
                    $broadcastMsg .= "{$syncedCount} rapat diselaraskan. ";
                }
                if ($deletedCount > 0) {
                    $broadcastMsg .= "{$deletedCount} rapat terhapus diselaraskan.";
                }
                safe_broadcast(new MeetingsListUpdated(trim($broadcastMsg)));
            }

            $msgParts = [];
            if ($syncedCount > 0) {
                $msgParts[] = "{$syncedCount} rapat baru/aktif diselaraskan";
            }
            if ($deletedCount > 0) {
                $msgParts[] = "{$deletedCount} rapat terhapus diselaraskan";
            }
            $finalMsg = empty($msgParts)
                ? 'Semua data rapat sudah selaras dengan Irvan Cloud.'
                : 'Berhasil: '.implode(', ', $msgParts).' dari Irvan Cloud.';

            return [
                'success' => true,
                'message' => $finalMsg,
            ];

        } catch (\Exception $e) {
            Log::error('Exception during Irvan Cloud sync: '.$e->getMessage());

            return [
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat menyinkronkan data Irvan Cloud.',
            ];
        }
    }

    /**
     * Sinkronisasi detail event spesifik dari Irvan Cloud (termasuk peserta).
     */
    public function syncEventDetails(string $externalId, Meeting $meeting): void
    {
        $details = $this->fetchEventDetails->execute($externalId);
        $this->syncParticipantsFromDetails($details, $meeting);
    }

    /**
     * @param  array<string, mixed>|null  $details
     */
    protected function syncParticipantsFromDetails(?array $details, Meeting $meeting): void
    {
        if (! $details || ! isset($details['data']['participants'])) {
            return;
        }

        foreach ($details['data']['participants'] as $participantData) {
            $user = $this->upsertUser->execute($participantData);

            if ($user) {
                $this->syncAttendance->execute($participantData, $meeting, $user);
            }
        }
    }
}
