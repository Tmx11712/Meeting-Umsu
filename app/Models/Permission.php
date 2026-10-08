<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Spatie\Permission\Models\Permission as SpatiePermission;

/**
 * [EDUKASI ARSITEKTUR: PERMISSION (Izin Akses)]
 * Model ini meng-extend (mewarisi) Permission dari package Spatie Laravel Permission.
 * Kita hanya menambahkan `HasUuids` agar ID Permission menggunakan UUID (string unik)
 * alih-alih angka auto-increment biasa. UUID lebih aman untuk sistem yang bersifat publik.
 *
 * Seluruh logika perizinan (cek `can()`, `hasPermissionTo()`) sudah disediakan oleh Spatie,
 * kita tidak perlu menulisnya dari nol.
 */
class Permission extends SpatiePermission
{
    use HasUuids;

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';
}
