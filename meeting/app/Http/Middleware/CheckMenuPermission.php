<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMenuPermission
{
    public function handle(Request $request, Closure $next, $menuCode = null): Response
    {
        if ($request->user() && $request->user()->hasRole('Super Admin')) {
            return $next($request);
        }

        if ($menuCode && ! $request->user()->can($menuCode)) {
            abort(403, 'Akses ditolak.');
        }

        return $next($request);
    }
}
