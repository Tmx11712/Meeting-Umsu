<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Configuration\ConfigurationController;
use App\Http\Controllers\Configuration\MenuController;
use App\Http\Controllers\Configuration\PermissionController;
use App\Http\Controllers\Configuration\RoleController;
use App\Http\Controllers\Configuration\RolePermissionController;
use App\Http\Controllers\Configuration\UserManagementController;
use App\Http\Controllers\Configuration\UserPermissionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MeetingApprovalController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\MeetingMinuteController;
use App\Http\Controllers\MeetingRecordingController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\TranscriptCorrectionController;
use App\Http\Controllers\TranscriptionController;
use App\Http\Middleware\EnsureConfigAccess;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Meetings
    Route::get('meetings/external', [MeetingController::class, 'fetchExternalSchedules'])->name('meetings.external');
    Route::post('meetings/sync', [MeetingController::class, 'syncFromIrvanCloud'])->name('meetings.sync');
    Route::resource('meetings', MeetingController::class)->except(['create', 'store']);

    // Recording & Transcripts
    Route::get('meetings/{meeting}/recording', [MeetingRecordingController::class, 'show'])->name('meetings.recording');
    Route::post('meetings/{meeting}/recording', [MeetingRecordingController::class, 'store'])->name('meetings.recording.store');
    Route::delete('meetings/{meeting}/recording/{recording}', [MeetingRecordingController::class, 'destroy'])->name('meetings.recording.destroy');
    Route::post('meetings/{meeting}/recording/transcribe', [MeetingRecordingController::class, 'transcribe'])->name('meetings.recording.transcribe');
    Route::post('meetings/{meeting}/finish-recording', [MeetingRecordingController::class, 'finishRecording'])->name('meetings.recording.finish');
    Route::get('meetings/{meeting}/recording/{recording}/stream', [MeetingRecordingController::class, 'stream'])->name('meetings.recording.stream');

    Route::get('meetings/{meeting}/transcription/progress', [TranscriptionController::class, 'progress'])->name('meetings.transcription.progress');

    // Correction
    Route::get('transcripts', [TranscriptCorrectionController::class, 'index'])->name('transcripts.index');
    Route::get('meetings/{meeting}/correction', [TranscriptCorrectionController::class, 'show'])->name('meetings.correction');
    Route::post('meetings/{meeting}/correction', [TranscriptCorrectionController::class, 'store'])->name('meetings.correction.store');
    Route::post('meetings/{meeting}/correction/finish', [TranscriptCorrectionController::class, 'finish'])->name('meetings.correction.finish');

    // Attendance
    Route::get('attendances', [AttendanceController::class, 'index'])->name('attendances.index');
    Route::get('meetings/{meeting}/attendance', [AttendanceController::class, 'show'])->name('meetings.attendance');
    Route::get('meetings/{meeting}/attendance/qr', [AttendanceController::class, 'generateQrCode'])->name('meetings.attendance.qr');
    Route::post('meetings/{meeting}/attendance/manual', [AttendanceController::class, 'storeManual'])->name('meetings.attendance.manual');
    Route::post('meetings/{meeting}/attendance/finish', [AttendanceController::class, 'finish'])->name('meetings.attendance.finish');
    Route::get('meetings/{meeting}/scan', [AttendanceController::class, 'scan'])->name('meetings.attendance.scan');
    Route::post('meetings/{meeting}/attendance/sync', [AttendanceController::class, 'syncIrvanCloud'])->name('meetings.attendance.sync');

    // Review & Minute
    Route::get('minutes', [MeetingMinuteController::class, 'index'])->name('minutes.index');
    Route::get('meetings/{meeting}/review', [MeetingMinuteController::class, 'show'])->name('meetings.review');
    Route::post('meetings/{meeting}/review/ai', [MeetingMinuteController::class, 'generateAiSummary'])->name('meetings.review.ai');
    Route::put('meetings/{meeting}/review', [MeetingMinuteController::class, 'update'])->name('meetings.review.update');
    Route::post('meetings/{meeting}/review/send', [MeetingMinuteController::class, 'sendToPimpinan'])->name('meetings.review.send');
    Route::get('meetings/{meeting}/review/pdf', [MeetingMinuteController::class, 'downloadPdf'])->name('meetings.review.pdf');

    // Approval
    Route::get('meetings/{meeting}/approval', [MeetingApprovalController::class, 'show'])->name('meetings.approval');
    Route::post('meetings/{meeting}/approval', [MeetingApprovalController::class, 'store'])->name('meetings.approval.store');

    // Reports
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/download', [ReportController::class, 'download'])->name('reports.download');
});

Route::middleware(['auth', 'verified', EnsureConfigAccess::class])->prefix('configuration')->name('configuration.')->group(function () {
    Route::get('/', [ConfigurationController::class, 'index'])->name('index');

    Route::resource('users', UserManagementController::class)->except(['show']);
    Route::resource('roles', RoleController::class)->except(['show']);
    Route::resource('permissions', PermissionController::class)->except(['create', 'edit', 'show']);
    Route::resource('menus', MenuController::class)->except(['create', 'edit', 'show']);
    Route::post('menus/{menu}/toggle', [MenuController::class, 'toggleStatus'])->name('menus.toggle');

    Route::get('role-permissions', [RolePermissionController::class, 'index'])->name('role-permissions.index');
    Route::put('role-permissions/{role}', [RolePermissionController::class, 'update'])->name('role-permissions.update');

    Route::get('user-permissions', [UserPermissionController::class, 'index'])->name('user-permissions.index');
    Route::put('user-permissions/{user}', [UserPermissionController::class, 'update'])->name('user-permissions.update');
});

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
