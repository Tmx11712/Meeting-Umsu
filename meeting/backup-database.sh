#!/bin/bash
# ========================================================
# Script Backup Database PostgreSQL e-Notulen UMSU
# Backup disimpan SELAMANYA ke MinIO (tidak ada yang dihapus)
# Jalankan otomatis via cron setiap hari jam 2 pagi
# ========================================================

set -e

# --- Konfigurasi (Sesuaikan dengan environment server) ---
DB_HOST="10.10.10.2"
DB_PORT="5432"
DB_NAME="enotulen"
DB_USER="enotulen"
DB_PASSWORD="enotulen123!"

MINIO_ENDPOINT="http://10.10.10.5:9000"
MINIO_ACCESS_KEY="umsu"
MINIO_SECRET_KEY="UnggulMendunia2026!"
MINIO_BUCKET="backups"

# --- Jangan ubah bagian di bawah ini ---
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="backup_enotulen_${TIMESTAMP}.sql.gz"
TEMP_DIR="/tmp/db_backups"
LOG_FILE="/var/log/enotulen-backup.log"

mkdir -p "$TEMP_DIR"

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
    | gzip > "${TEMP_DIR}/${BACKUP_FILE}"

FILESIZE=$(du -h "${TEMP_DIR}/${BACKUP_FILE}" | cut -f1)
echo "[$TIMESTAMP] Backup berhasil dibuat: ${BACKUP_FILE} (${FILESIZE})" | tee -a "$LOG_FILE"

# 2. Upload ke MinIO menggunakan curl (tanpa perlu install mc/aws-cli)
# Menggunakan MinIO S3 API dengan signature sederhana
echo "[$TIMESTAMP] Mengupload backup ke MinIO (bucket: ${MINIO_BUCKET})..." | tee -a "$LOG_FILE"

# Pastikan mc (MinIO Client) sudah terinstall, jika belum, install otomatis
if ! command -v mc &> /dev/null; then
    echo "[$TIMESTAMP] MinIO Client (mc) belum terinstall. Menginstall..." | tee -a "$LOG_FILE"
    curl -sL https://dl.min.io/client/mc/release/linux-amd64/mc -o /usr/local/bin/mc
    chmod +x /usr/local/bin/mc
fi

# Konfigurasi alias MinIO (idempotent, aman dijalankan berulang)
mc alias set enotulen-backup "$MINIO_ENDPOINT" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY" --api S3v4 2>/dev/null

# Buat bucket jika belum ada
mc mb --ignore-existing "enotulen-backup/${MINIO_BUCKET}" 2>/dev/null

# Upload file backup
mc cp "${TEMP_DIR}/${BACKUP_FILE}" "enotulen-backup/${MINIO_BUCKET}/database/${BACKUP_FILE}"

echo "[$TIMESTAMP] Upload ke MinIO berhasil!" | tee -a "$LOG_FILE"

# 3. Bersihkan file sementara di /tmp (BUKAN backup di MinIO, itu disimpan selamanya)
rm -f "${TEMP_DIR}/${BACKUP_FILE}"

echo "[$TIMESTAMP] Backup selesai. File tersimpan di MinIO: ${MINIO_BUCKET}/database/${BACKUP_FILE}" | tee -a "$LOG_FILE"
echo "---" >> "$LOG_FILE"
