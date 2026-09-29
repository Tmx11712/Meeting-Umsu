#!/bin/bash
# ========================================================
# Script Restore Database PostgreSQL e-Notulen UMSU
# Gunakan script ini HANYA saat darurat (database rusak/hilang)
# ========================================================

set -e

# --- Baca konfigurasi dari file .env ---
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

# --- Pilih file backup yang ingin di-restore ---
echo "=========================================="
echo "RESTORE DATABASE e-Notulen UMSU"
echo "=========================================="
echo ""

# Konfigurasi mc
if ! command -v mc &> /dev/null; then
    echo "MinIO Client (mc) belum terinstall. Menginstall..."
    curl -sL https://dl.min.io/client/mc/release/linux-amd64/mc -o /usr/local/bin/mc
    chmod +x /usr/local/bin/mc
fi

mc alias set enotulen-backup "$MINIO_ENDPOINT" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY" --api S3v4 2>/dev/null

echo "Daftar backup yang tersedia:"
echo ""
mc ls "enotulen-backup/$MINIO_BUCKET/database/" | tail -20
echo ""
echo "Salin nama file backup yang ingin di-restore (contoh: backup_enotulen_2026-09-29_02-00-00.sql.gz)"
read -p "Nama file: " BACKUP_FILE

if [ -z "$BACKUP_FILE" ]; then
    echo "Nama file tidak boleh kosong. Dibatalkan."
    exit 1
fi

echo ""
echo "PERINGATAN: Ini akan MENIMPA seluruh isi database dengan data dari backup!"
read -p "Apakah Anda yakin? (ketik YA untuk melanjutkan): " CONFIRM

if [ "$CONFIRM" != "YA" ]; then
    echo "Restore dibatalkan."
    exit 0
fi

# Download backup dari MinIO
TEMP_DIR="/tmp/db_restore"
mkdir -p "$TEMP_DIR"

echo "Mendownload backup dari MinIO..."
mc cp "enotulen-backup/$MINIO_BUCKET/database/$BACKUP_FILE" "$TEMP_DIR/$BACKUP_FILE"

# Restore ke database
echo "Merestore database..."
gunzip -c "$TEMP_DIR/$BACKUP_FILE" | PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME"

# Bersihkan file sementara
rm -f "$TEMP_DIR/$BACKUP_FILE"

echo ""
echo "Restore berhasil! Database telah dikembalikan."
echo "Silakan cek aplikasi e-Notulen untuk memastikan data sudah benar."
