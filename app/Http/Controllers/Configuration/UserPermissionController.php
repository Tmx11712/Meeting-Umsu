<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

/**
 * [EDUKASI ARSITEKTUR: DIRECT USER PERMISSION (Bypass Role)]
 * Controller ini mengelola Permission yang diberikan LANGSUNG ke User — di luar Role.
 *
 * Normalnya, izin akses diatur melalui Role. Namun ada kalanya seorang user tertentu
 * membutuhkan izin khusus yang tidak dimiliki oleh Role-nya (atau sebaliknya, perlu dicabut).
 *
 * Spatie Laravel Permission mendukung dua jenis pemberian izin:
 * 1. Via Role    → `$user->assignRole('Notulis')` (paling umum digunakan).
 * 2. Direct      → `$user->givePermissionTo('meeting.delete')` (pengecualian khusus).
 *
 * Controller ini mengelola yang nomor 2 — kasus pengecualian per-user.
 */
class UserPermissionController extends Controller
{
    public function index(Request $request): Response
    {
        $usersQuery = User::with('roles')->orderBy('name', 'asc');

        if ($search = $request->input('search')) {
            $usersQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $usersQuery->take(10)->get()->map(fn (User $user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'initials' => $user->initials ?? strtoupper(collect(explode(' ', $user->name))->map(fn ($w) => $w[0])->take(2)->join('')),
            'roles' => $user->roles->pluck('name')->toArray(),
        ]);

        $selectedUserId = $request->input('user_id');
        $selectedUser = null;
        $userDirectPermissions = [];
        $userRolePermissions = [];

        if ($selectedUserId) {
            $selectedUser = User::with(['permissions', 'roles.permissions'])->find($selectedUserId);
            if ($selectedUser) {
                $userDirectPermissions = $selectedUser->permissions->pluck('name')->toArray();

                // Get all permissions from roles
                $rolePerms = collect();
                foreach ($selectedUser->roles as $role) {
                    $rolePerms = $rolePerms->merge($role->permissions->pluck('name'));
                }
                $userRolePermissions = $rolePerms->unique()->values()->toArray();
            }
        }

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

        return Inertia::render('configuration/user-permissions/index', [
            'users' => $users,
            'searchQuery' => $request->input('search', ''),
            'selectedUserId' => $selectedUserId,
            'selectedUser' => $selectedUser ? [
                'id' => $selectedUser->id,
                'name' => $selectedUser->name,
                'email' => $selectedUser->email,
                'initials' => $selectedUser->initials ?? strtoupper(collect(explode(' ', $selectedUser->name))->map(fn ($w) => $w[0])->take(2)->join('')),
                'roles' => $selectedUser->roles->pluck('name')->toArray(),
            ] : null,
            'permissionsGrouped' => $permissionsGrouped,
            'userDirectPermissions' => $userDirectPermissions,
            'userRolePermissions' => $userRolePermissions,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $user->syncPermissions($validated['permissions'] ?? []);

        Cache::forget("user_menus_{$user->id}");

        return back()->with('flash', [
            'type' => 'success',
            'message' => "Direct permissions untuk user {$user->name} berhasil diperbarui.",
        ]);
    }
}
