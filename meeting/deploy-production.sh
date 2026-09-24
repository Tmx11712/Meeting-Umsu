#!/bin/bash
set -e
# ========================================================
# Script Deployment untuk E-Notulen di Server Resmi Kampus (Docker)
# Pastikan dijalankan dari direktori aplikasi (/var/www/enotulen)
# ========================================================

echo "Mulai proses deployment ke Server Produksi Kampus (menggunakan Docker)..."

# 1. Pastikan Git & Docker terinstall di server kampus
# 2. Tarik update terbaru dari repository
echo "Menarik update terbaru dari GitHub..."
git pull origin main

# 3. Pastikan konfigurasi .env sudah diatur dari template .env.production
# cp .env.production .env
# nano .env (Isi password database, URL resmi: https://notulen.umsu.ac.id)

# 4. Build ulang image aplikasi
echo "Membangun ulang image Docker..."
docker compose -f docker-compose.prod.yml build

# 5. Hentikan container lama (jika ada) dan jalankan yang baru
echo "Menjalankan aplikasi..."
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d

# Sinkronkan aset frontend terbaru ke volume publik Nginx agar selalu update
echo "Menyinkronkan aset frontend terbaru..."
docker compose -f docker-compose.prod.yml exec -T app sh -c "rm -rf /var/www/html/public/build && cp -rf /var/www/html/public-assets/* /var/www/html/public/ 2>/dev/null || true"

# 6. Optimasi Laravel dan jalankan migrasi database
echo "Menjalankan optimasi dan migrasi database..."
docker compose -f docker-compose.prod.yml exec -T app php artisan optimize:clear
docker compose -f docker-compose.prod.yml exec -T app php artisan optimize
docker compose -f docker-compose.prod.yml exec -T app php artisan migrate --force
docker compose -f docker-compose.prod.yml exec -T app php artisan storage:link

echo "Deployment selesai dengan sukses! Aplikasi siap diakses melalui domain kampus."
echo "Cek log jika ada error: docker compose -f docker-compose.prod.yml logs -f"

