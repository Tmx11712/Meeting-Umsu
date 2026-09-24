#!/bin/bash
set -e

echo "=========================================================="
echo "?? Memulai Deployment E-Notulen ke Server Produksi Kampus (Docker)"
echo "=========================================================="

# 1. Persiapan Folder Storage & Hak Akses
echo "?? Menyiapkan folder dan hak akses..."
mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/testing storage/framework/views bootstrap/cache
# Ubah permission agar bisa diakses oleh Nginx dan Worker di dalam maupun luar container
sudo chmod -R 777 storage bootstrap/cache || true

# 2. Tarik kode terbaru dari GitHub
echo "?? Menarik kode terbaru dari branch main..."
git pull origin main

# 3. Pengecekan Environment
if [ ! -f .env ]; then
    echo "?? File .env tidak ditemukan! Meng-copy dari template .env.production..."
    cp .env.production .env
    echo "Tolong edit file .env dan sesuaikan dengan rahasia server (database, AWS, dll), lalu jalankan ulang script ini."
    exit 1
fi

# 4. Build dan Restart Docker Container
echo "?? Membangun ulang dan menyalakan Docker Container..."
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

echo "? Menunggu container siap..."
sleep 5

# 5. Eksekusi Perintah Optimasi & Frontend di Dalam Container
echo "?? Mengkonfigurasi Laravel & Frontend di dalam container..."

# a. Pastikan dependensi PHP terbaru
docker compose -f docker-compose.prod.yml exec -T app composer install --optimize-autoloader --no-dev

# b. Sinkronisasi dan Build Aset Frontend
echo "?? Mem-build dan menyinkronkan aset frontend (React/Vite)..."
docker compose -f docker-compose.prod.yml exec -T app npm install
docker compose -f docker-compose.prod.yml exec -T app npm run build
docker compose -f docker-compose.prod.yml exec -T app sh -c "rm -rf /var/www/html/public/build && cp -rf /var/www/html/public-assets/* /var/www/html/public/ 2>/dev/null || true"

# c. Optimasi, Caching, dan Migrasi Laravel
echo "??? Menjalankan migrasi database dan caching aplikasi..."
docker compose -f docker-compose.prod.yml exec -T app php artisan optimize:clear
docker compose -f docker-compose.prod.yml exec -T app php artisan migrate --force
docker compose -f docker-compose.prod.yml exec -T app php artisan config:cache
docker compose -f docker-compose.prod.yml exec -T app php artisan route:cache
docker compose -f docker-compose.prod.yml exec -T app php artisan view:cache
docker compose -f docker-compose.prod.yml exec -T app php artisan event:cache
docker compose -f docker-compose.prod.yml exec -T app php artisan storage:link

# 6. Restart Queue Worker (Penting untuk pemrosesan AI)
echo "?? Merestart antrian (Queue Worker)..."
docker compose -f docker-compose.prod.yml exec -T app php artisan queue:restart || true

echo "=========================================================="
echo "? Deployment Selesai Sukses! Aplikasi e-Notulen mengudara."
echo "?? Untuk memantau log aplikasi gunakan: docker compose -f docker-compose.prod.yml logs -f"
echo "=========================================================="
