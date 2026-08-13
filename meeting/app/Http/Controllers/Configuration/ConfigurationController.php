<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ConfigurationController extends Controller
{
    public function index(): Response
    {
        $stats = Cache::remember('configuration_dashboard_stats', 3600, function () {
            return [
                'usersCount' => User::count(),
                'rolesCount' => Role::count(),
                'permissionsCount' => Permission::count(),
                'menusCount' => Menu::count(),
                'rolePermissionsCount' => Role::count(),
                'userPermissionsCount' => User::whereHas('permissions')->count(),
            ];
        });

        return Inertia::render('configuration/index', [
            'stats' => $stats,
        ]);
    }
}
