<?php

namespace App\Services;

use App\Actions\IrvanCloud\SyncMeetingsAction;

class IrvanCloudSyncService
{
    public function __construct(protected SyncMeetingsAction $syncMeetingsAction) {}

    /**
     * Sinkronisasi data rapat dari Irvan Cloud.
     *
     * @return array{success: bool, message: string}
     */
    public function syncMeetings(): array
    {
        return $this->syncMeetingsAction->execute();
    }
}
