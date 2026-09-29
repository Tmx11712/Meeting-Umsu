<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\MeetingRoom;
use App\Models\MeetingType;
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
                'meetingTypesCount' => MeetingType::count('id'),
                'meetingRoomsCount' => MeetingRoom::count('id'),
            ];
        });

        return Inertia::render('configuration/index', [
            'stats' => $stats,
        ]);
    }

    public function checkOpenAiStatus()
    {
        try {
            $response = \Illuminate\Support\Facades\Http::withToken(config('services.openai.api_key'))
                ->timeout(5)
                ->get('https://api.openai.com/v1/models');

            if ($response->successful()) {
                return response()->json(['status' => 'active', 'message' => 'Token & Saldo Aktif']);
            }

            if ($response->status() === 429) {
                return response()->json(['status' => 'exhausted', 'message' => 'Saldo Habis (429)']);
            }
            
            if ($response->status() === 401) {
                return response()->json(['status' => 'invalid', 'message' => 'API Key Tidak Valid']);
            }

            return response()->json(['status' => 'error', 'message' => 'Error: ' . $response->status()]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal koneksi ke server AI']);
        }
    }
}
