<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * [EDUKASI ARSITEKTUR: MIDDLEWARE OTORISASI KONFIGURASI]
 * Middleware ini memastikan bahwa hanya user dengan role 'Super Admin' atau 'Administrator'
 * yang bisa mengakses section Konfigurasi (User Management, Role, Permission, Menu).
 *
 * Cara kerjanya: Sebelum request masuk ke Controller, middleware ini memeriksa role user.
 * Jika tidak lolos → langsung dikembalikan ke Dashboard dengan pesan error 403.
 * Ini adalah lapisan keamanan ke-2 (setelah pemeriksaan login di middleware `auth`).
 */
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
