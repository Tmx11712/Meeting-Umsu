<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * [EDUKASI ARSITEKTUR: ABSENSI RAPAT]
 * Model ini merepresentasikan satu baris catatan kehadiran peserta dalam sebuah rapat.
 *
 * Satu rapat bisa memiliki BANYAK catatan kehadiran (One-to-Many: Meeting → MeetingAttendance).
 * Seorang peserta bisa berupa:
 * - User terdaftar di sistem (field `user_id` terisi, field `guest_*` kosong).
 * - Tamu eksternal yang belum punya akun (field `user_id` kosong, field `guest_*` terisi).
 *
 * Pola ini disebut "Polymorphic-like" dan membuat sistem absensi sangat fleksibel.
 */
class MeetingAttendance extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'meeting_id',
        'user_id',
        'guest_name',
        'guest_email',
        'guest_unit_kerja',
        'guest_institution',
        'status',
        'check_in_time',
        'check_out_time',
        'method',
        'recorded_by',
        'notes',
    ];

    protected $casts = [
        'check_in_time' => 'datetime',
        'check_out_time' => 'datetime',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
