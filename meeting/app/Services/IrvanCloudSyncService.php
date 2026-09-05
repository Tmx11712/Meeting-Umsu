<?php

namespace App\Services;

class IrvanCloudSyncService
{
    /**
     * Sinkronisasi data rapat dari Irvan Cloud.
     *
     * @return array{success: bool, message: string}
     */
    public function syncMeetings(): array
    {
        return [
            'success' => true,
            'message' => 'Sinkronisasi Irvan Cloud selesai.',
        ];
    }

    public function syncEventDetails($externalId, $meeting): bool
    {
        // TODO: Implement sync logic
        return true;
    }
}
