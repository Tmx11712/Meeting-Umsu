<?php

namespace App\Services;

use App\Actions\IrvanCloud\FetchEventDetailsFromApiAction;
use App\Actions\IrvanCloud\SyncMeetingsAction;
use App\Actions\Meetings\SyncMeetingAttendanceAction;
use App\Actions\Users\UpsertUserFromExternalAction;
use App\Models\Meeting;

class IrvanCloudSyncService
{
    public function __construct(
        protected SyncMeetingsAction $syncMeetingsAction,
        protected FetchEventDetailsFromApiAction $fetchEventDetails,
        protected UpsertUserFromExternalAction $upsertUser,
        protected SyncMeetingAttendanceAction $syncAttendance
    ) {}

    /**
     * Sinkronisasi data rapat dari Irvan Cloud.
     *
     * @return array{success: bool, message: string}
     */
    public function syncMeetings(): array
    {
        return $this->syncMeetingsAction->execute();
    }

    /**
     * Sinkronisasi detail event spesifik dari Irvan Cloud (termasuk peserta).
     */
    public function syncEventDetails(string $externalId, Meeting $meeting): void
    {
        $details = $this->fetchEventDetails->execute($externalId);

        if ($details && isset($details['data']['participants'])) {
            foreach ($details['data']['participants'] as $participantData) {
                $user = $this->upsertUser->execute($participantData);

                if ($user) {
                    $this->syncAttendance->execute($participantData, $meeting, $user);
                }
            }
        }
    }
}
