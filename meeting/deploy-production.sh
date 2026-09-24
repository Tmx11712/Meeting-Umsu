#!/bin/bash
set -e
# ========================================================
# Script Deployment untuk E-Notulen di Server Resmi Kampus (Bare-metal Ubuntu)
# Pastikan dijalankan dari direktori aplikasi (/var/www/enotulen)
# ========================================================

echo "Mulai proses deployment ke Server Produksi Kampus..."

# 1. Tarik update terbaru dari Git
echo "Menarik update terbaru dari GitHub..."
git pull origin main

# 2. Install/Update dependensi PHP
echo "Menginstall dependensi PHP (Composer)..."
composer install --optimize-autoloader --no-dev

# 3. Install/Update dependensi Node.js & Build aset frontend
echo "Membangun aset frontend (Vite)..."
npm install
npm run build

# 4. Optimasi Laravel & Migrasi Database
echo "Menjalankan optimasi cache dan migrasi database..."
php artisan optimize:clear
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# (Opsional) Memastikan symbolic link storage
php artisan storage:link || true

# 5. Restart Worker & WebSocket (Supervisor)
echo "Merestart Queue Worker dan WebSocket Reverb..."
# Restart menggunakan supervisorctl untuk memuat perubahan kode terbaru ke memori
sudo supervisorctl restart all

echo "Deployment selesai dengan sukses! Aplikasi siap digunakan."
