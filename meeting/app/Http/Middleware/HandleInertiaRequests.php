<?php

namespace App\Http\Middleware;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * [EDUKASI ARSITEKTUR: INERTIA SHARED DATA]
     * Apapun yang Anda "return" di dalam method `share` ini akan otomatis tersedia
     * secara global di seluruh komponen React Anda (bisa diakses via `usePage().props`).
     * Sangat berguna untuk mengirim data yang selalu dibutuhkan tiap halaman, seperti
     * informasi user yang sedang login, hak akses (roles), atau list menu navigasi.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $menus = [];
        if ($user) {
            $menusData = Cache::remember("user_menus_{$user->id}", 300, function () use ($user) {
                if ($user->hasRole('Super Admin') || $user->hasRole('Administrator')) {
                    return Menu::query()->where('status', true)->orderBy('order', 'asc')->get()->toArray();
                }

                return Menu::query()->whereHas('roles', function ($q) use ($user) {
                    $q->whereIn('role_id', $user->roles->pluck('id'));
                })->where('status', true)->orderBy('order', 'asc')->get()->toArray();
            });

            $menus = collect($menusData)->map(function ($menu) {
                $menu['url'] = ! empty($menu['route']) && Route::has($menu['route']) ? route($menu['route']) : '#';

                return $menu;
            })->toArray();
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
                'roles' => $user ? $user->roles->pluck('name') : [],
                'permissions' => $user ? $user->getAllPermissions()->pluck('name') : [],
                'can_manage_configuration' => $user ? ($user->hasRole('Super Admin') || $user->hasRole('Administrator')) : false,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'toast' => $request->session()->get('flash'),
            ],
            'menus' => $menus,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'currentTeam' => fn () => $user?->currentTeam ? $user->toUserTeam($user->currentTeam) : null,
            'teams' => fn () => $user?->toUserTeams(includeCurrent: true) ?? [],
        ];
    }
}
