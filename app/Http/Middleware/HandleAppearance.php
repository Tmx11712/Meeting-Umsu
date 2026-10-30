<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

/**
 * [EDUKASI ARSITEKTUR: TEMA TAMPILAN (Dark/Light Mode)]
 * Middleware ini membaca preferensi tema user (dark mode / light mode) dari cookie
 * dan meneruskannya ke semua View (Blade template) sebagai variabel global.
 *
 * Hasilnya, seluruh halaman web bisa membaca preferensi tema ini dan menerapkan
 * class CSS yang sesuai (misalnya `dark` pada elemen `<html>`) tanpa perlu memuat
 * data dari database setiap saat. Ringan dan cepat.
 */
class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $appearance = $request->cookie('appearance');

        View::share('appearance', in_array($appearance, ['light', 'dark', 'system'], true) ? $appearance : 'light');

        return $next($request);
    }
}
