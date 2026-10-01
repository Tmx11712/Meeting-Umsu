<?php

namespace App\Events;

use App\Models\Meeting;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * [EDUKASI ARSITEKTUR: EVENT BROADCASTING]
 * Event ini di-trigger (dipicu) dari backend kapanpun ada perubahan data rapat (tahapan berganti, rekam dimulai, absensi masuk).
 * Karena class ini mengimplementasikan `ShouldBroadcastNow`, Laravel akan langsung mengirim notifikasi
 * ke server WebSockets (Pusher/Reverb) sehingga semua halaman web milik peserta rapat akan ter-update seketika
 * tanpa perlu di-refresh.
 */
class MeetingUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Meeting $meeting;

    public string $updateType;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Meeting $meeting, string $updateType = 'general')
    {
        $this->meeting = $meeting;
        $this->updateType = $updateType;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('meeting.'.$this->meeting->id);
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->meeting->id,
            'type' => $this->updateType,
            'meeting' => [
                'id' => $this->meeting->id,
                'title' => $this->meeting->title,
                'status' => $this->meeting->status,
                'current_stage' => $this->meeting->current_stage,
                'recording_started_at' => $this->meeting->recording_started_at,
            ],
        ];
    }

    public function broadcastAs(): string
    {
        return 'MeetingUpdated';
    }
}
