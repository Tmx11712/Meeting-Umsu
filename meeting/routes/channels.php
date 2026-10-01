<?php

use App\Models\Meeting;
use Illuminate\Support\Facades\Broadcast;

/**
 * [EDUKASI ARSITEKTUR: WEBSOCKET CHANNELS & SECURITY]
 * Di sinilah kita mengatur *otorisasi* untuk channel real-time (WebSockets/Reverb).
 * Kita bisa membatasi siapa yang berhak "mendengarkan" suatu channel.
 * Misalnya: hanya user yang ID-nya sama dengan ID di URL channel yang boleh terhubung ke channel pribadi ini.
 */
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('meetings', function ($user) {
    // Semua user terautentikasi dapat melihat daftar rapat
    return $user !== null;
});

Broadcast::channel('meeting.{meetingId}', function ($user, $meetingId) {
    // Gunakan MeetingPolicy (view) untuk memvalidasi akses ke channel rapat spesifik
    $meeting = Meeting::find($meetingId);
    if (! $meeting) {
        return false;
    }

    return $user->can('view', $meeting);
});
