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
    // Endpoints yang mengekspos data rapat harus authenticated
    Route::middleware('auth')->group(function () {
        Route::get('/', [MeetingApiController::class, 'index'])->name('index');
        Route::get('/{meeting}', [MeetingApiController::class, 'show'])->name('show');
        Route::get('/{meeting}/attendance', [AttendanceApiController::class, 'index'])->name('attendance.index');
    });

    // Absensi Rapat (Scan QR & Rekap Kehadiran)
    // Dibiarkan public untuk mesin scanner QR fisik (dengan validasi internal)
    Route::middleware('throttle:30,1')->post('/{meeting}/attendance/scan', [AttendanceApiController::class, 'scan'])->name('attendance.scan');
});
