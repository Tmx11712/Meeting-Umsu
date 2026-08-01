<?php

use App\Models\TeamInvitation;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Artisan;
use App\Services\IrvanCloudSyncService;

Schedule::call(function () {
    TeamInvitation::query()
        ->whereNotNull('expires_at')
        ->where('expires_at', '<', now())
        ->delete();
})->daily()->description('Delete expired team invitations');

Artisan::command('irvan-cloud:sync', function (IrvanCloudSyncService $syncService) {
    $this->info('Starting sync from Irvan Cloud...');
    $result = $syncService->syncMeetings();
    if ($result['success']) {
        $this->info($result['message']);
    } else {
        $this->error($result['message']);
    }
})->purpose('Sync meetings from Irvan Cloud API');

// Secara otomatis menjalankan sinkronisasi setiap jam
Schedule::command('irvan-cloud:sync')->hourly();
