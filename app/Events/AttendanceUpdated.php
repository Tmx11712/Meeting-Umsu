<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * [EDUKASI ARSITEKTUR: EVENT (Sinyal Internal Aplikasi)]
 * Event adalah "sinyal" yang dikirimkan oleh satu bagian sistem untuk memberitahu bagian lain.
 * Class ini adalah template event untuk perubahan data absensi.
 *
 * Catatan: Saat ini event ini belum diimplementasikan sepenuhnya (masih template default Laravel).
 * Jika ingin dikembangkan, class ini bisa di-broadcast melalui WebSocket untuk memberitahu
 * halaman rekap kehadiran bahwa ada peserta baru yang baru saja absen.
 */
class AttendanceUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
