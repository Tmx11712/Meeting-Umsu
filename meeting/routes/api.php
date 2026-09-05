<?php

use App\Http\Controllers\Api\AttendanceApiController;
use App\Http\Controllers\Api\MeetingApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Endpoint REST API untuk aplikasi E-Notulen UMSU.
|
*/

Route::prefix('meetings')->name('api.meetings.')->group(function () {
    // Jadwal Rapat
    Route::get('/', [MeetingApiController::class, 'index'])->name('index');
    Route::get('/{meeting}', [MeetingApiController::class, 'show'])->name('show');

    // Absensi Rapat (Scan QR & Rekap Kehadiran)
    Route::get('/{meeting}/attendance', [AttendanceApiController::class, 'index'])->name('attendance.index');
    Route::post('/{meeting}/attendance/scan', [AttendanceApiController::class, 'scan'])->name('attendance.scan');
});
