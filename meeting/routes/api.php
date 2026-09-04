<?php

use App\Http\Controllers\Api\MeetingApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// Meeting Routes (Direct: /api/meetings)
Route::prefix('meetings')->name('api.meetings.')->group(function () {
    Route::get('/', [MeetingApiController::class, 'index'])->name('index');
    Route::post('/', [MeetingApiController::class, 'store'])->name('store');
    Route::get('/{meeting}', [MeetingApiController::class, 'show'])->name('show');
});

// Versioned Meeting Routes (v1: /api/v1/meetings)
Route::prefix('v1/meetings')->name('api.v1.meetings.')->group(function () {
    Route::get('/', [MeetingApiController::class, 'index'])->name('index');
    Route::post('/', [MeetingApiController::class, 'store'])->name('store');
    Route::get('/{meeting}', [MeetingApiController::class, 'show'])->name('show');
});
