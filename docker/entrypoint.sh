#!/bin/sh
# ==========================================================
# Entrypoint container aplikasi (app / worker / scheduler / reverb)
# ----------------------------------------------------------
# Di AWS ECS tidak ada yang menjalankan deploy-production.sh,
# jadi tugas persiapan Laravel dilakukan otomatis di sini setiap container start.
#
# Variabel environment:
#   RUN_MIGRATIONS=true   -> jalankan `php artisan migrate --force --isolated`
#                            (set HANYA di service web/app, bukan di worker/scheduler)
#   SKIP_LARAVEL_CACHE=true -> lewati caching (berguna untuk debugging)
# ==========================================================
set -e

cd /var/www/html

# Pastikan folder runtime ada (volume / filesystem Fargate bisa kosong)
mkdir -p storage/logs \
         storage/framework/cache/data \
         storage/framework/sessions \
         storage/framework/views \
         storage/app/private/temp \
         bootstrap/cache

# 0. Sinkronisasi aset frontend ke volume public bersama (set SYNC_PUBLIC_ASSETS=true HANYA di service app).
#    Named volume Docker tidak di-update otomatis saat image di-rebuild, sehingga tanpa langkah ini
#    Nginx bisa terus menyajikan build lama. Memakai cp tanpa rm agar tidak ada jeda file hilang;
#    file ber-hash lama dibiarkan supaya browser yang masih memegang HTML lama tidak kena 404.
#    public/hot dihapus karena jika ada, @vite akan memuat aset dari dev server Vite (CSS rusak).
if [ "${SYNC_PUBLIC_ASSETS:-false}" = "true" ] && [ -d /var/www/html/public-assets ]; then
    echo "[entrypoint] Sinkronisasi aset frontend ke public/..."
    rm -f public/hot
    cp -rf /var/www/html/public-assets/. /var/www/html/public/ \
        || echo "[entrypoint] PERINGATAN: sinkronisasi aset frontend gagal."
fi

# 1. Migrasi database (opsional). --isolated memakai cache lock (Redis) sehingga
#    aman walau beberapa task ECS start bersamaan: hanya satu yang menjalankan migrasi.
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    echo "[entrypoint] Menjalankan migrasi database..."
    php artisan migrate --force --isolated
fi

# 2. Caching konfigurasi untuk performa production.
#    Gagal caching tidak menghentikan container agar tidak terjadi restart loop;
#    error tetap terlihat di log (CloudWatch).
if [ "${SKIP_LARAVEL_CACHE:-false}" != "true" ]; then
    echo "[entrypoint] Caching config, route, view, dan event..."
    php artisan optimize || echo "[entrypoint] PERINGATAN: php artisan optimize gagal, lanjut tanpa cache."
fi

# 3. Pastikan PHP-FPM (user www-data) bisa menulis cache & log yang baru dibuat oleh root
chown -R www-data:www-data storage/framework storage/logs bootstrap/cache 2>/dev/null || true

# 4. Jalankan perintah utama container (php-fpm / horizon / schedule:work / reverb:start)
exec "$@"
