<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * [EDUKASI ARSITEKTUR: MASTER DATA (Lookup Table)]
 * MeetingRoom adalah tabel master/referensi untuk data Ruangan Rapat.
 *
 * Tabel Master (atau "Lookup Table") adalah tabel kecil yang menyimpan pilihan-pilihan
 * yang bisa diubah oleh Admin tanpa harus mengedit kode. Contohnya: daftar ruangan,
 * kategori rapat, dll. Ini lebih fleksibel dibanding meng-hardcode nilai di dalam kode.
 */
class MeetingRoom extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'is_active'];

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('active_meeting_rooms'));
        static::deleted(fn () => Cache::forget('active_meeting_rooms'));
    }
}
