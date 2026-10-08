<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * [EDUKASI ARSITEKTUR: SELF-REFERENCING MODEL (Pohon Menu)]
 * Model ini mengelola menu navigasi sidebar aplikasi.
 *
 * Trik paling menarik di sini adalah relasi `parent()` dan `children()` yang keduanya merujuk
 * ke tabel yang SAMA (`menus`). Ini disebut "Self-Referencing Relationship" atau "Recursive Relation".
 *
 * Contoh strukturnya di database:
 * - Menu Induk: { id: 1, name: 'Rapat', parent_id: NULL }
 *   - Menu Anak: { id: 2, name: 'Jadwal Rapat', parent_id: 1 }
 *   - Menu Anak: { id: 3, name: 'Rekap Kehadiran', parent_id: 1 }
 *
 * Menu juga bisa diikat ke Role tertentu (Many-to-Many), sehingga hanya role yang berwenang
 * yang bisa melihat menu tertentu di sidebar.
 */
class Menu extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'route',
        'icon',
        'order',
        'status',
        'parent_id',
    ];

    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')->orderBy('order', 'asc');
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_has_menus');
    }
}
