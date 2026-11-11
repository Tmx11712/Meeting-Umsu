<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/**
 * [EDUKASI ARSITEKTUR: MANY-TO-MANY ASSIGNMENT (Role ↔ Permission)]
 * Controller ini mengelola relasi Many-to-Many antara Role dan Permission.
 *
 * Analoginya: seorang "Notulis" (Role) bisa diberi izin 'meeting.view' dan 'minute.create' (Permission).
 * Satu Role bisa punya banyak Permission, dan satu Permission bisa dimiliki oleh banyak Role.
 *
 * Method `sync()` dari Eloquent digunakan di sini. `sync()` sangat cerdas:
 * ia otomatis MENAMBAH izin yang baru dipilih, dan MENGHAPUS izin yang tidak dipilih,
 * hanya dengan satu baris kode — tanpa perlu kita urus satu per satu.
 */
class RolePermissionController extends Controller
{
    public function index(Request $request): Response
    {
        $roles = Role::orderBy('name', 'asc')->get(['id', 'name']);

        $selectedRoleId = $request->input('role_id');
        if ($selectedRoleId && ! Str::isUuid((string) $selectedRoleId)) {
            $selectedRoleId = null;
        }
        $selectedRole = null;
        $rolePermissions = [];

        if ($selectedRoleId) {
            $selectedRole = Role::with('permissions')->find($selectedRoleId);
            if ($selectedRole) {
                $rolePermissions = $selectedRole->permissions->pluck('name')->toArray();
            }
        } elseif ($roles->count() > 0) {
            // Default to first role if none selected
            $selectedRole = Role::with('permissions')->find($roles->first()->id);
            $selectedRoleId = $selectedRole->id;
            $rolePermissions = $selectedRole->permissions->pluck('name')->toArray();
        }

        // Group permissions by 'group' field
        $permissionsGrouped = Permission::orderBy('group', 'asc')
            ->orderBy('name', 'asc')
            ->get()
            ->groupBy(fn ($p) => $p->group ?? 'Lainnya')
            ->map(function ($permissions, $group) {
                return [
                    'group' => $group,
                    'permissions' => $permissions->map(fn ($p) => [
                        'id' => $p->id,
                        'name' => $p->name,
                        'description' => $p->description,
                    ])->values()->toArray(),
                ];
            })
            ->values()
            ->toArray();

        return Inertia::render('configuration/role-permissions/index', [
            'roles' => $roles,
            'selectedRoleId' => $selectedRoleId,
            'permissionsGrouped' => $permissionsGrouped,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $requestedPermissions = $validated['permissions'] ?? [];

        if (! $request->user()->hasRole('Super Admin')) {
            abort_if($role->name === 'Super Admin', 403, 'Hanya Super Admin yang dapat mengubah permissions role Super Admin.');

            $currentRestricted = $role->permissions()->pluck('name')->filter(fn (string $name) => Role::isRestrictedRbacPermission($name));
            $nextRestricted = collect($requestedPermissions)->filter(fn (string $name) => Role::isRestrictedRbacPermission($name));

            abort_if(
                $currentRestricted->sort()->values()->all() !== $nextRestricted->sort()->values()->all(),
                403,
                'Hanya Super Admin yang dapat mengubah permission manajemen RBAC.'
            );
        }

        $role->syncPermissions($requestedPermissions);

        $userIds = $role->users()->pluck('users.id');
        foreach ($userIds as $id) {
            Cache::forget("user_menus_{$id}");
        }
        Cache::increment('menu_cache_version');

        return back()->with('flash', [
            'type' => 'success',
            'message' => "Permissions untuk role {$role->name} berhasil diperbarui.",
        ]);
    }
}
