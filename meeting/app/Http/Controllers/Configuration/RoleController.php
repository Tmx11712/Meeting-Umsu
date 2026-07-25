<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Role::withCount('users');

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        $roles = $query->orderBy('name')->paginate(10)->through(fn (Role $role) => [
            'id' => $role->id,
            'name' => $role->name,
            'description' => $role->description,
            'guard_name' => $role->guard_name,
            'users_count' => $role->users_count,
            'permissions_count' => $role->permissions()->count(),
        ]);

        return Inertia::render('configuration/roles/index', [
            'roles' => $roles,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('configuration/roles/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string|max:500',
        ]);

        Role::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'guard_name' => 'web',
        ]);

        return redirect('/configuration/roles')->with('flash', [
            'type' => 'success',
            'message' => "Role {$validated['name']} berhasil ditambahkan.",
        ]);
    }

    public function edit(Role $role)
    {
        return Inertia::render('configuration/roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'description' => $role->description,
                'users_count' => $role->users()->count(),
                'permissions_count' => $role->permissions()->count(),
                'created_at' => $role->created_at,
            ],
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => "required|string|max:255|unique:roles,name,{$role->id}",
            'description' => 'nullable|string|max:500',
        ]);

        $role->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        return redirect('/configuration/roles')->with('flash', [
            'type' => 'success',
            'message' => "Role {$role->name} berhasil diperbarui.",
        ]);
    }

    public function destroy(Role $role)
    {
        $name = $role->name;

        abort_if(
            in_array($name, ['Super Admin', 'Administrator']),
            403,
            'Role ini tidak dapat dihapus.'
        );

        $role->delete();

        return redirect('/configuration/roles')->with('flash', [
            'type' => 'success',
            'message' => "Role {$name} berhasil dihapus.",
        ]);
    }
}
