<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Menu;
use Illuminate\Support\Facades\DB;

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
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        $menus = [];
        if ($user) {
            if ($user->hasRole('Super Admin') || $user->hasRole('Administrator')) {
                $menus = Menu::where('status', true)->orderBy('order')->get();
            } else {
                $menus = Menu::whereHas('roles', function($q) use ($user) {
                    $q->whereIn('role_id', $user->roles->pluck('id'));
                })->where('status', true)->orderBy('order')->get();
            }
            
            $menus = $menus->map(function ($menu) {
                $menu->url = $menu->route && \Route::has($menu->route) ? route($menu->route) : '#';
                return $menu;
            });
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
                'toast' => $request->session()->get('flash'),
            ],
            'menus' => $menus,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'currentTeam' => fn () => $user?->currentTeam ? $user->toUserTeam($user->currentTeam) : null,
            'teams' => fn () => $user?->toUserTeams(includeCurrent: true) ?? [],
        ];
    }
}
