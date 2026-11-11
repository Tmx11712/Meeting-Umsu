#!/bin/bash
set -e

echo "=========================================================="
echo "?? Memulai Deployment E-Notulen ke Server Produksi Kampus (Docker)"
echo "=========================================================="

# 1. Persiapan Folder Storage & Hak Akses
echo "📁 Menyiapkan folder dan hak akses..."
mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/testing storage/framework/views bootstrap/cache
# Ubah permission agar aman dan bisa diakses oleh Nginx dan Worker di dalam maupun luar container
sudo chmod -R 775 storage bootstrap/cache || true

# 2. Tarik kode terbaru dari GitHub
echo "📥 Menarik kode terbaru dari branch main..."
git pull origin main

# 3. Pengecekan Environment
if [ ! -f .env ]; then
    echo "⚠️ File .env tidak ditemukan! Meng-copy dari template .env.production..."
    cp .env.production .env
    echo "Tolong edit file .env dan sesuaikan dengan rahasia server (database, AWS, dll), lalu jalankan ulang script ini."
    exit 1
fi

# 4. Build dan Restart Docker Container (Zero-downtime recreation)
echo "📦 Membangun image Docker sebelum restart untuk meminimalkan downtime..."
docker compose -f docker-compose.prod.yml build --pull
echo "🚀 Memperbarui dan menyalakan Docker Container..."
docker compose -f docker-compose.prod.yml up -d --remove-orphans --force-recreate

echo "? Menunggu container siap..."
sleep 5

# 5. Eksekusi Migrasi & Optimasi di Dalam Container
echo "?? Menjalankan migrasi database dan caching aplikasi..."
docker compose -f docker-compose.prod.yml exec -T app php artisan migrate --force --isolated
docker compose -f docker-compose.prod.yml exec -T app php artisan optimize
docker compose -f docker-compose.prod.yml exec -T app php artisan storage:link --force || true

# 6. Restart Horizon Worker (Penting untuk pemrosesan AI)
echo "?? Merestart antrian (Horizon Worker)..."
docker compose -f docker-compose.prod.yml exec -T worker php artisan horizon:terminate || true

echo "=========================================================="
echo "? Deployment Selesai Sukses! Aplikasi e-Notulen mengudara."
echo "?? Untuk memantau log aplikasi gunakan: docker compose -f docker-compose.prod.yml logs -f"
echo "=========================================================="
