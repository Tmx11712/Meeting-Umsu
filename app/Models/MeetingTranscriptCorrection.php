<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * [EDUKASI ARSITEKTUR: KOREKSI TRANSKRIP]
 * Model ini menyimpan riwayat koreksi yang dilakukan user terhadap segmen transkrip AI.
 *
 * Ketika hasil transkripsi AI salah (misalnya nama salah tangkap), user bisa mengoreksinya.
 * Sistem TIDAK menghapus teks asli AI (`original_text`), melainkan menyimpan keduanya:
 * - `original_text`  → Apa yang awalnya AI tulis (tidak pernah hilang, untuk keperluan audit).
 * - `corrected_text` → Teks yang sudah dikoreksi oleh user.
 *
 * Ini adalah pola "Audit Trail" yang umum dipakai di sistem enterprise untuk menjaga integritas data.
 */
class MeetingTranscriptCorrection extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'transcript_id',
        'original_text',
        'corrected_text',
        'corrected_by',
    ];

    public function transcript()
    {
        return $this->belongsTo(MeetingTranscript::class, 'transcript_id');
    }

    public function correctedBy()
    {
        return $this->belongsTo(User::class, 'corrected_by');
    }
}
