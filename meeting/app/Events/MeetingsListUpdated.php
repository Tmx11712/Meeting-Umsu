<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * [EDUKASI ARSITEKTUR: BROADCAST EVENT (Notifikasi Real-Time ke Halaman Daftar Rapat)]
 * Event ini dikhususkan untuk memberitahu halaman DAFTAR RAPAT (index) bahwa ada perubahan.
 *
 * Perbedaannya dengan `MeetingUpdated`:
 * - `MeetingUpdated`      → Dikirim ke Channel spesifik satu rapat (misal: `meeting.{id}`).
 * - `MeetingsListUpdated` → Dikirim ke Channel publik `meetings`, didengarkan oleh SEMUA user
 *                            yang sedang membuka halaman Daftar Rapat.
 *
 * Ketika event ini diterima, halaman daftar rapat secara otomatis refresh datanya (re-fetch)
 * tanpa user perlu menekan F5. Ini menciptakan pengalaman kolaborasi yang terasa mulus.
 */
class MeetingsListUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $message;

    public function __construct(string $message = 'Daftar rapat telah diperbarui')
    {
        $this->message = $message;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('meetings'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'MeetingsListUpdated';
    }
}
