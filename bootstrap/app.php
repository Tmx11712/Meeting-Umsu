<?php

use App\Http\Middleware\CheckMenuPermission;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SetTeamUrlDefaults;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

/**
 * [EDUKASI ARSITEKTUR: BOOTSTRAP / KERNEL BARU]
 * Mulai dari Laravel 11, struktur aplikasi disederhanakan.
 * File `bootstrap/app.php` ini menggantikan peran dari `App\Http\Kernel.php` dan `App\Exceptions\Handler.php`
 * yang ada di versi Laravel sebelumnya.
 * Di sinilah kita mendaftarkan routing utama, middleware global/alias, dan penanganan exception.
 */
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        /**
         * [EDUKASI ARSITEKTUR: TRUSTED PROXIES (AWS ALB / Nginx)]
         * Di production, request user tidak langsung masuk ke Laravel, tapi melewati
         * Load Balancer (AWS ALB) dan Nginx. Tanpa konfigurasi ini, Laravel mengira
         * SEMUA user punya IP yang sama (IP milik ALB/Nginx), sehingga:
         * - Rate limiter (throttle) akan memblokir semua orang sekaligus.
         * - Deteksi HTTPS dan log IP menjadi salah.
         * Kita hanya mempercayai proxy di jaringan privat (VPC AWS / LAN kampus),
         * sehingga header X-Forwarded-For tidak bisa dipalsukan dari internet.
         */
        $middleware->trustProxies(at: [
            '127.0.0.1',
            '10.0.0.0/8',
            '172.16.0.0/12',
            '192.168.0.0/16',
        ]);

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            SetTeamUrlDefaults::class,
        ]);

        $middleware->redirectUsersTo('/dashboard');

        $middleware->alias([
            'permission' => CheckMenuPermission::class,
            'role' => RoleMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
