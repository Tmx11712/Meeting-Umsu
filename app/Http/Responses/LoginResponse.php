<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;
use Symfony\Component\HttpFoundation\Response;

/**
 * [EDUKASI ARSITEKTUR: FORTIFY CUSTOM RESPONSE]
 * Walaupun Fortify menangani proses login di balik layar, kita tetap bisa "membajak"
 * apa yang terjadi setelah pengguna berhasil login.
 * Di class ini, kita mengatur agar setelah login sukses, pengguna akan dilempar (redirect)
 * ke dashboard yang telah ditentukan di konfigurasi, bukan bawaan default Fortify.
 */
class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): Response
    {
        return $request->wantsJson()
            ? new JsonResponse(['two_factor' => false], 200)
            : redirect()->intended(Fortify::redirects('login'));
    }
}
