<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Spatie\Permission\Models\Role as SpatieRole;

/**
 * [EDUKASI ARSITEKTUR: ROLE (Peran/Jabatan Akses)]
 * Model ini meng-extend Role dari package Spatie Laravel Permission.
 *
 * Cara kerja otorisasi di aplikasi ini menggunakan pola RBAC (Role-Based Access Control):
 * 1. Setiap User ditetapkan satu atau beberapa ROLE (misal: 'Admin', 'Notulis', 'Peserta').
 * 2. Setiap ROLE memiliki kumpulan PERMISSION (misal: 'meeting.create', 'minute.approve').
 * 3. Saat user mencoba aksi tertentu, sistem mengecek: "Apakah role user ini punya izin tersebut?"
 *
 * Dengan ini, kita tidak perlu mengatur izin satu per satu ke setiap user.
 */
class Role extends SpatieRole
{
    use HasUuids;

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';
}
