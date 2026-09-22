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

/**
 * [EDUKASI ARSITEKTUR: HALAMAN DASHBOARD KONFIGURASI]
 * Controller ini menampilkan halaman utama (landing page) dari section Konfigurasi.
 * Fungsinya mirip DashboardController utama, namun khusus menampilkan ringkasan statistik
 * data konfigurasi seperti jumlah user, role, izin akses, dan menu yang terdaftar.
 */
class ConfigurationController extends Controller
{
    public function index(): Response
    {
        $stats = Cache::remember('configuration_dashboard_stats', 3600, function () {
            return [
                'usersCount' => User::count('id'),
                'rolesCount' => Role::count('id'),
                'permissionsCount' => Permission::count('id'),
                'menusCount' => Menu::count('id'),
                'rolePermissionsCount' => Role::count('id'),
                'userPermissionsCount' => User::query()->whereHas('permissions')->count('id'),
                'meetingTypesCount' => \App\Models\MeetingType::count('id'),
                'meetingRoomsCount' => \App\Models\MeetingRoom::count('id'),
            ];
        });

        return Inertia::render('configuration/index', [
            'stats' => $stats,
        ]);
    }
}
