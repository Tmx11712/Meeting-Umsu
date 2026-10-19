#!/bin/bash
set -e

# ==============================================================================
# Script Backup Database Otomatis E-Notulen UMSU
# Menjalankan php artisan db:backup di dalam Docker container atau server host
# ==============================================================================

BACKUP_DIR="./storage/app/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
RETENTION_DAYS=14

mkdir -p "$BACKUP_DIR"

echo "=========================================================="
echo "🗄️  Memulai Backup Database eNotulen - $TIMESTAMP"
echo "=========================================================="

if command -v docker &> /dev/null && [ -f "docker-compose.prod.yml" ] && docker compose -f docker-compose.prod.yml ps -q app &> /dev/null; then
    echo "🐳 Menjalankan backup melalui Docker container..."
    docker compose -f docker-compose.prod.yml exec -T app php artisan db:backup --keep=$RETENTION_DAYS
else
    echo "💻 Menjalankan backup lokal/host..."
    php artisan db:backup --keep=$RETENTION_DAYS
fi

echo "=========================================================="
echo "✓ Backup selesai dan disimpan di: $BACKUP_DIR"
echo "=========================================================="
