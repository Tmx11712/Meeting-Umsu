<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

/**
 * [EDUKASI ARSITEKTUR: SERVICE PROVIDER (Titik Konfigurasi Aplikasi)]
 * AppServiceProvider adalah tempat pertama yang dijalankan Laravel saat aplikasi di-boot.
 *
 * Ini adalah tempat kita mengatur hal-hal global untuk seluruh aplikasi:
 * - `register()` → Mendaftarkan binding ke Service Container (Dependency Injection).
 * - `boot()`     → Menjalankan kode setelah semua service terdaftar.
 *
 * Di aplikasi ini, `boot()` mengonfigurasi:
 * - Agar Carbon menggunakan `CarbonImmutable` (tanggal yang tidak bisa diubah, lebih aman).
 * - URL generator agar selalu menggunakan HTTPS di production.
 * - Aturan validasi password minimum yang berlaku di seluruh aplikasi.
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * [EDUKASI ARSITEKTUR: SERVICE PROVIDER]
     * Method `boot` dipanggil sesaat sebelum aplikasi benar-benar mulai menangani request HTTP.
     * Tempat ini cocok untuk mengatur konfigurasi global (seperti aturan kata sandi default di bawah),
     * mendefinisikan *macro*, atau mendaftarkan *event listener*.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        foreach (['meeting', 'recording', 'document', 'role', 'permission', 'menu', 'meeting_type', 'meeting_room', 'user'] as $uuidParam) {
            Route::pattern($uuidParam, '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}');
        }

        if (app()->environment('production') && str_starts_with((string) config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }

        Blade::componentNamespace('Inertia\\View\\Components', 'inertia');
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Model::preventLazyLoading(! app()->isProduction());
        Model::preventSilentlyDiscardingAttributes(! app()->isProduction());

        Password::defaults(fn (): ?Password => Password::min(8));
    }
}
