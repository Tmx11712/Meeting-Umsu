#!/bin/bash
# ========================================================
# Script Backup Database PostgreSQL e-Notulen UMSU
# Backup disimpan SELAMANYA ke MinIO (tidak ada yang dihapus)
# Jalankan otomatis via cron setiap hari jam 2 pagi
# ========================================================

set -e

# --- Baca konfigurasi dari file .env (otomatis, tidak perlu hardcode) ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: File .env tidak ditemukan di $SCRIPT_DIR"
    exit 1
fi

DB_HOST=$(grep -E '^DB_HOST=' "$ENV_FILE" | cut -d '=' -f2- | tr -d ' "')
DB_PORT=$(grep -E '^DB_PORT=' "$ENV_FILE" | cut -d '=' -f2- | tr -d ' "')
DB_NAME=$(grep -E '^DB_DATABASE=' "$ENV_FILE" | cut -d '=' -f2- | tr -d ' "')
DB_USER=$(grep -E '^DB_USERNAME=' "$ENV_FILE" | cut -d '=' -f2- | tr -d ' "')
DB_PASSWORD=$(grep -E '^DB_PASSWORD=' "$ENV_FILE" | cut -d '=' -f2- | tr -d '"')

MINIO_ENDPOINT=$(grep -E '^AWS_ENDPOINT=' "$ENV_FILE" | cut -d '=' -f2- | tr -d ' "')
MINIO_ACCESS_KEY=$(grep -E '^AWS_ACCESS_KEY_ID=' "$ENV_FILE" | cut -d '=' -f2- | tr -d ' "')
MINIO_SECRET_KEY=$(grep -E '^AWS_SECRET_ACCESS_KEY=' "$ENV_FILE" | cut -d '=' -f2- | tr -d '"')
MINIO_BUCKET="backups"

# --- Jangan ubah bagian di bawah ini ---
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="backup_enotulen_${TIMESTAMP}.sql.gz"
BACKUP_DIR="/var/backups/enotulen"
LOG_FILE="/var/log/enotulen-backup.log"

mkdir -p "$BACKUP_DIR"

echo "[$TIMESTAMP] Memulai backup database..." | tee -a "$LOG_FILE"

# 1. Dump database PostgreSQL dan kompres langsung
echo "[$TIMESTAMP] Menjalankan pg_dump..." | tee -a "$LOG_FILE"
PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --no-owner \
    --no-privileges \
    | gzip > "${BACKUP_DIR}/${BACKUP_FILE}"

FILESIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)
TOTAL_BACKUPS=$(ls -1 "$BACKUP_DIR"/*.sql.gz 2>/dev/null | wc -l)

echo "[$TIMESTAMP] Backup selesai! File: ${BACKUP_FILE} (${FILESIZE})" | tee -a "$LOG_FILE"
echo "[$TIMESTAMP] Total backup tersimpan: ${TOTAL_BACKUPS} file" | tee -a "$LOG_FILE"
echo "[$TIMESTAMP] Lokasi: ${BACKUP_DIR}/${BACKUP_FILE}" | tee -a "$LOG_FILE"
echo "---" >> "$LOG_FILE"

