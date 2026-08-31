<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * [EDUKASI ARSITEKTUR: PIVOT MODEL]
 * Tabel `meeting_participants` sejatinya adalah tabel perantara (Pivot) antara `meetings` dan `users` (Many-to-Many).
 *
 * Namun kita mendefinisikannya sebagai Model mandiri agar kita bisa menambahkan field ekstra (seperti `is_invited`)
 * dan memanggilnya dengan mudah layaknya tabel biasa.
 *
 * @property string $id
 * @property string $meeting_id
 * @property string $user_id
 * @property bool $is_invited
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Meeting|null $meeting
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingParticipant newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingParticipant newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingParticipant query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingParticipant whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingParticipant whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingParticipant whereIsInvited($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingParticipant whereMeetingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingParticipant whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingParticipant whereUserId($value)
 * @mixin \Eloquent
 */
class MeetingParticipant extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'meeting_id',
        'user_id',
        'is_invited',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
