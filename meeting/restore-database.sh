#!/bin/bash
# ========================================================
# Script Restore Database PostgreSQL e-Notulen UMSU
# Gunakan script ini HANYA saat darurat (database rusak/hilang)
# ========================================================

set -e

# --- Konfigurasi ---
DB_HOST="10.10.10.2"
DB_PORT="5432"
DB_NAME="enotulen"
DB_USER="enotulen"
DB_PASSWORD="enotulen123!"

MINIO_ENDPOINT="http://10.10.10.5:9000"
MINIO_ACCESS_KEY="umsu"
MINIO_SECRET_KEY="UnggulMendunia2026!"
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
