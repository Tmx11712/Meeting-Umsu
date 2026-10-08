<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * [EDUKASI ARSITEKTUR: MIDDLEWARE & RBAC]
 * Middleware ini bertugas sebagai "Satpam" (Role-Based Access Control) sebelum request masuk ke Controller.
 * Ia mengecek apakah pengguna memiliki kode izin tertentu (misal: `menu.dashboard`).
 * Jika yang login adalah 'Super Admin', dia diberi jalur khusus (Bypass) tanpa perlu dicek satu-satu.
 */
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
