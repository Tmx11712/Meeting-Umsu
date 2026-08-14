<?php

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
