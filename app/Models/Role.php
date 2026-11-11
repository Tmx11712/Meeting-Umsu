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

    /**
     * Role sistem bawaan yang namanya tidak boleh diubah atau dihapus.
     *
     * @var array<int, string>
     */
    public const CORE_ROLES = [
        'Super Admin',
        'Administrator',
        'Bag. Umum',
        'Bag. Humas',
        'Pimpinan',
        'Viewer',
    ];

    /**
     * Prefix permission sensitif yang hanya boleh diatur oleh Super Admin.
     *
     * @var array<int, string>
     */
    public const SUPER_ADMIN_ONLY_PERMISSION_PREFIXES = [
        'role.',
        'permission.',
        'menu.',
        'role_permission.',
        'user_permission.',
    ];

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    public static function isRestrictedRbacPermission(string $permissionName): bool
    {
        foreach (self::SUPER_ADMIN_ONLY_PERMISSION_PREFIXES as $prefix) {
            if (str_starts_with($permissionName, $prefix)) {
                return true;
            }
        }

        return false;
    }
}
