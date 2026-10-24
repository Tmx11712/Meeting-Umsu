<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * [EDUKASI ARSITEKTUR: MASTER DATA (Lookup Table)]
 * MeetingType adalah tabel master/referensi untuk jenis/tipe Rapat.
 *
 * Sama dengan MeetingRoom, ini adalah Lookup Table yang memungkinkan Admin mengatur
 * jenis rapat (misal: 'Rapat Dinas', 'Rapat Koordinasi', 'Rapat Insidental', dll)
 * langsung dari halaman konfigurasi tanpa perlu menyentuh kode sama sekali.
 */
class MeetingType extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'is_active'];

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('active_meeting_types'));
        static::deleted(fn () => Cache::forget('active_meeting_types'));
    }
}
