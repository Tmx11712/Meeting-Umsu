<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class RolePermissionController extends Controller
{
    public function index(Request $request): Response
    {
        $roles = Role::orderBy('name')->get(['id', 'name']);

        $selectedRoleId = $request->input('role_id');
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
        $permissionsGrouped = Permission::orderBy('group')
            ->orderBy('name')
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
        // Don't allow changing Super Admin permissions through this UI
        // if they are meant to have all permissions implicitly,
        // but we'll allow it based on the current requirements unless specified otherwise.

        $validated = $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role->syncPermissions($validated['permissions'] ?? []);

        $userIds = $role->users()->pluck('users.id');
        foreach ($userIds as $id) {
            Cache::forget("user_menus_{$id}");
        }

        return back()->with('flash', [
            'type' => 'success',
            'message' => "Permissions untuk role {$role->name} berhasil diperbarui.",
        ]);
    }
}
