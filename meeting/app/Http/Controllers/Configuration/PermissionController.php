<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Permission::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('group', 'like', "%{$search}%");
            });
        }

        $permissions = $query->orderBy('group')->orderBy('name')
            ->paginate(15)
            ->through(fn (Permission $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'group' => $p->group,
                'description' => $p->description,
                'guard_name' => $p->guard_name,
            ]);

        $groups = Permission::whereNotNull('group')
            ->distinct()
            ->pluck('group')
            ->sort()
            ->values();

        return Inertia::render('configuration/permissions/index', [
            'permissions' => $permissions,
            'groups' => $groups,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
            'group' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        Permission::create([
            'name' => $validated['name'],
            'group' => $validated['group'] ?? null,
            'description' => $validated['description'] ?? null,
            'guard_name' => 'web',
        ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => "Permission {$validated['name']} berhasil ditambahkan.",
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => "required|string|max:255|unique:permissions,name,{$permission->id}",
            'group' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $permission->update([
            'name' => $validated['name'],
            'group' => $validated['group'] ?? null,
            'description' => $validated['description'] ?? null,
        ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => "Permission {$permission->name} berhasil diperbarui.",
        ]);
    }

    public function destroy(Permission $permission)
    {
        $name = $permission->name;
        $permission->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => "Permission {$name} berhasil dihapus.",
        ]);
    }
}
