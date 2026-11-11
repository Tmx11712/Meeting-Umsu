<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Blokir user dengan status nonaktif pada jalur web, API, dan broadcasting.
 */
class EnsureUserIsActive
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ($user->status ?? 'aktif') === 'nonaktif') {
            if ($request->hasSession()) {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }

            if ($request->expectsJson() || $request->is('api/*', 'broadcasting/*')) {
                return response()->json([
                    'message' => 'Akun Anda sedang dinonaktifkan.',
                ], 403);
            }

            return redirect()->route('login')->withErrors([
                'email' => 'Akun Anda sedang dinonaktifkan.',
            ]);
        }

        return $next($request);
    }
}

