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
