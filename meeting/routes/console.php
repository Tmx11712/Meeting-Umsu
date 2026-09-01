<?php

use App\Models\TeamInvitation;
use App\Services\IrvanCloudSyncService;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

/**
 * [EDUKASI ARSITEKTUR: TASK SCHEDULING]
 * File ini mengatur semua tugas yang harus berjalan secara otomatis (seperti cron job).
 * Dengan Laravel, Anda tidak perlu mengedit file `crontab` di server berulang kali;
 * cukup daftarkan perintahnya di sini (contoh: `daily()`, `hourly()`),
 * lalu biarkan satu cron worker Laravel mengeksekusinya secara rutin.
 */
Schedule::call(function () {
    TeamInvitation::query()
        ->whereNotNull('expires_at', 'and')
        ->where('expires_at', '<', now())
        ->delete();
})->description('Delete expired team invitations')->daily();

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
