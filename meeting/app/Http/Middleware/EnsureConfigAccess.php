<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureConfigAccess
{
    /**
     * Only allow users with 'Super Admin' or 'Administrator' role.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        abort_if(
            ! $user || ! $user->hasAnyRole(['Super Admin', 'Administrator']),
            403,
            'Anda tidak memiliki akses ke halaman konfigurasi.'
        );

        return $next($request);
    }
}
