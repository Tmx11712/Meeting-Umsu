<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\StoreUserRequest;
use App\Http\Requests\Configuration\UpdateUserRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::with('roles');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($roleFilter = $request->input('role')) {
            $query->whereHas('roles', fn ($q) => $q->where('name', $roleFilter));
        }

        $users = $query->orderBy('name')->paginate(10)->through(fn (User $user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'initials' => $user->initials ?? strtoupper(collect(explode(' ', $user->name))->map(fn ($w) => $w[0])->take(2)->join('')),
            'status' => $user->status ?? 'aktif',
            'department' => $user->department ?? '-',
            'roles' => $user->roles->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
            ]),
        ]);

        $roles = Role::orderBy('name')->get(['id', 'name']);

        return Inertia::render('configuration/users/index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function create()
    {
        $roles = Role::orderBy('name')->get(['id', 'name']);

        return Inertia::render('configuration/users/create', [
            'roles' => $roles,
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'status' => $validated['status'] ?? 'aktif',
            'initials' => strtoupper(collect(explode(' ', $validated['name']))->map(fn ($w) => $w[0])->take(2)->join('')),
        ]);

        $role = Role::findById($validated['role_id']);
        $user->assignRole($role);

        return redirect('/configuration/users')->with('flash', [
            'type' => 'success',
            'message' => "User {$user->name} berhasil ditambahkan.",
        ]);
    }

    public function edit(User $user)
    {
        $roles = Role::orderBy('name')->get(['id', 'name']);

        return Inertia::render('configuration/users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status ?? 'aktif',
                'role_id' => $user->roles->first()?->id,
            ],
            'roles' => $roles,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status' => $validated['status'],
            'initials' => strtoupper(collect(explode(' ', $validated['name']))->map(fn ($w) => $w[0])->take(2)->join('')),
        ]);

        if ($request->filled('password')) {
            $user->update(['password' => bcrypt($validated['password'])]);
        }

        $role = Role::findById($validated['role_id']);
        $user->syncRoles([$role]);

        return redirect('/configuration/users')->with('flash', [
            'type' => 'success',
            'message' => "User {$user->name} berhasil diperbarui.",
        ]);
    }

    public function destroy(User $user)
    {
        $name = $user->name;
        $user->delete();

        return redirect('/configuration/users')->with('flash', [
            'type' => 'success',
            'message' => "User {$name} berhasil dihapus.",
        ]);
    }
}
