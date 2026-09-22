<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * [EDUKASI ARSITEKTUR: TRANSKRIP RAPAT]
 * Model ini menyimpan SATU SEGMEN hasil transkripsi suara menjadi teks.
 *
 * Bayangkan sebuah rekaman rapat 1 jam dipotong-potong menjadi ratusan segmen kecil.
 * Setiap segmen kecil tersebut disimpan sebagai satu baris/record di tabel ini.
 *
 * Field penting:
 * - `timestamp_seconds` → Kapan (detik ke berapa) dalam rekaman segmen ini muncul.
 * - `speaker`           → Siapa yang berbicara (jika AI mampu mendeteksi pembicara).
 * - `is_live`           → Apakah ini transkrip yang masih "mengalir" langsung (live) atau sudah final.
 * - `sequence_order`    → Urutan segmen agar teks tersusun rapi dari awal hingga akhir.
 *
 * Segmen-segmen ini kemudian digabungkan oleh AI (GenerateMeetingMinuteAction) menjadi ringkasan notulensi.
 */
class MeetingTranscript extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'meeting_id',
        'recording_id',
        'timestamp_seconds',
        'speaker',
        'text',
        'is_live',
        'sequence_order',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function recording()
    {
        return $this->belongsTo(MeetingRecording::class, 'recording_id');
    }

    public function corrections()
    {
        return $this->hasMany(MeetingTranscriptCorrection::class, 'transcript_id');
    }
}
