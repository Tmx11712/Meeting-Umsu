<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(Request $request): Response
    {
        $menus = Menu::with('parent')
            ->orderBy('order')
            ->paginate(15)
            ->through(fn (Menu $m) => [
                'id' => $m->id,
                'name' => $m->name,
                'route' => $m->route,
                'icon' => $m->icon,
                'order' => $m->order,
                'status' => $m->status,
                'parent_id' => $m->parent_id,
                'parent_name' => $m->parent?->name,
            ]);

        return Inertia::render('configuration/menus/index', [
            'menuData' => $menus,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'route' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:100',
            'order' => 'required|integer|min:0',
            'status' => 'boolean',
            'parent_id' => 'nullable|exists:menus,id',
        ]);

        $menu = Menu::create($validated);

        // Auto-generate basic permissions for the new menu
        $baseName = strtolower(str_replace(' ', '_', $menu->name));
        $actions = [
            'create' => 'Dapat membuat',
            'read' => 'Dapat melihat daftar',
            'update' => 'Dapat mengubah',
            'delete' => 'Dapat menghapus',
        ];

        foreach ($actions as $action => $actionLabel) {
            Permission::firstOrCreate([
                'name' => "{$baseName}.{$action}",
                'guard_name' => 'web',
            ], [
                'group' => $menu->name,
                'description' => "{$actionLabel} {$menu->name}",
            ]);
        }

        return back()->with('flash', [
            'type' => 'success',
            'message' => "Menu {$validated['name']} beserta permission dasarnya berhasil ditambahkan.",
        ]);
    }

    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'route' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:100',
            'order' => 'required|integer|min:0',
            'status' => 'boolean',
            'parent_id' => 'nullable|exists:menus,id',
        ]);

        $menu->update($validated);

        return back()->with('flash', [
            'type' => 'success',
            'message' => "Menu {$menu->name} berhasil diperbarui.",
        ]);
    }

    public function destroy(Menu $menu)
    {
        $name = $menu->name;
        $menu->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => "Menu {$name} berhasil dihapus.",
        ]);
    }

    /**
     * Toggle menu status (AJAX).
     */
    public function toggleStatus(Menu $menu)
    {
        $menu->update(['status' => ! $menu->status]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => "Status menu {$menu->name} berhasil diubah.",
        ]);
    }
}
