<?php

use App\Http\Controllers\Api\MeetingApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Endpoint API untuk mengambil data jadwal rapat (GET) untuk Postman.
|
*/

Route::prefix('meetings')->name('api.meetings.')->group(function () {
    Route::get('/', [MeetingApiController::class, 'index'])->name('index');
    Route::get('/{meeting}', [MeetingApiController::class, 'show'])->name('show');
});
