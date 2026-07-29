<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMenuPermission
{
    public function handle(Request $request, Closure $next, $menuCode = null): Response
    {
        // For development or if user is super admin
        if ($request->user() && $request->user()->hasRole('Super Admin')) {
            return $next($request);
        }

        // Wait, spatie permission uses "can" or "role". If we map menus to permissions, we can just check if user has permission.
        // For simplicity, let's assume we use Spatie's permission directly using spatie middleware or manual check
        if ($menuCode && ! $request->user()->can($menuCode)) {
            abort(403, 'Akses ditolak.');
        }

        return $next($request);
    }
}
