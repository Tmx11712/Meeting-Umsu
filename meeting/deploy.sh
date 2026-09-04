#!/bin/bash
# ========================================================
# Script Deployment untuk E-Notulen di Proxmox (LXC 101)
# ========================================================

echo "Mulai proses deployment..."

# 1. Pastikan Git & Docker terinstall (asumsi sudah ada di LXC 101)
# 2. Tarik update terbaru dari repository
echo "Menarik update dari Git..."
git pull origin main

# 3. Pastikan konfigurasi .env sudah sesuai dengan IP LXC Proxmox:
# DB_HOST=10.10.10.2
# REDIS_HOST=10.10.10.4
# AWS_ENDPOINT=http://10.10.10.5:9000

# 4. Build ulang image aplikasi
echo "Membangun ulang image Docker..."
docker compose -f docker-compose.prod.yml build

# 5. Hentikan container lama (jika ada) dan jalankan yang baru
echo "Menjalankan aplikasi..."
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d

# 6. Optimasi Laravel dan jalankan migrasi database
echo "Menjalankan optimasi dan migrasi database..."
docker compose -f docker-compose.prod.yml exec -T app php artisan optimize:clear
docker compose -f docker-compose.prod.yml exec -T app php artisan optimize
docker compose -f docker-compose.prod.yml exec -T app php artisan migrate --force

echo "Deployment selesai! Periksa log jika ada error dengan: docker compose -f docker-compose.prod.yml logs -f"
