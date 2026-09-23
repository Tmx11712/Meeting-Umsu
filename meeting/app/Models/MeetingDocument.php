<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * [EDUKASI ARSITEKTUR: PENYIMPANAN DOKUMEN RAPAT]
 * Model ini merepresentasikan satu file dokumen yang diunggah (upload) ke sistem.
 *
 * Sebuah rapat bisa memiliki banyak dokumen (One-to-Many).
 * Field `category` membedakan jenis dokumen, misalnya:
 * - 'notulen_pdf'  → File PDF hasil cetak notulensi.
 * - 'supporting'   → Dokumen pendukung rapat (presentasi, lampiran, dll).
 *
 * Path file disimpan di field `file_path` menggunakan path relatif dari root Laravel Storage,
 * sehingga kita bisa mudah memindahkan server tanpa mengubah database.
 */
class MeetingDocument extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'meeting_id',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
        'category',
        'uploaded_by',
    ];

    protected static function booted()
    {
        static::deleting(function ($model) {
            $disk = config('filesystems.default');
            if ($model->file_path) {
                \Illuminate\Support\Facades\Storage::disk($disk)->delete($model->file_path);
            }
        });
    }

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
