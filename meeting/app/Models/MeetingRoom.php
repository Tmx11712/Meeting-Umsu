<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

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
}
