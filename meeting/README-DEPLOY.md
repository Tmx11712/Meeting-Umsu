# Panduan Deployment ke Server Proxmox

Karena sistem keamanan terminal Windows tidak mengizinkan saya (AI) untuk memasukkan *password* SSH secara otomatis, Anda harus menjalankan perintah ini langsung di terminal laptop Anda (PowerShell / Command Prompt).

## Langkah 1: Copy Project ke Server Proxmox (via SCP)
Buka terminal baru di laptop Anda, lalu jalankan perintah ini untuk menyalin seluruh folder project ke root server Proxmox:

```bash
# Buka PowerShell baru lalu jalankan ini (masukkan password Allahuakbar1213* saat diminta)
scp -r e:\notulen\meeting root@100.107.175.84:/root/
```
*(Catatan: Proses ini mungkin memakan waktu beberapa saat karena akan menyalin semua file termasuk vendor/node_modules. Jika gagal, kita bisa menggunakan git clone).*

## Langkah 2: Masuk ke Proxmox & Pindahkan File ke Container 101
Masuk ke server Proxmox Anda:
```bash
ssh root@100.107.175.84
# Masukkan password: Allahuakbar1213*
```

Setelah berhasil masuk ke Proxmox, dorong folder tersebut ke dalam Container 101:
```bash
# Pindahkan folder dari host Proxmox ke dalam LXC 101
pct push 101 /root/meeting /var/www/enotulen
```

## Langkah 3: Masuk ke Container Docker (101) & Setup
Masuk ke dalam container 101:
```bash
pct enter 101
```

Di dalam container 101, masuk ke folder aplikasi:
```bash
cd /var/www/enotulen
```

Edit konfigurasi `.env` production Anda (jalankan perintah ini untuk menimpa `.env` dengan kredensial baru):
```bash
cat << 'EOF' > .env
APP_NAME=enotulen
APP_ENV=production
APP_KEY=base64:duT5VTKp+gwtjhiMVlYRb3kXqjP8AmRmNfTu+vQOUdQ=
APP_DEBUG=false
APP_URL=http://10.10.10.3

# DB POSTGRES (LXC 100)
DB_CONNECTION=pgsql
DB_HOST=10.10.10.2
DB_PORT=5432
DB_DATABASE=enotulen
DB_USERNAME=umsu
DB_PASSWORD=UnggulMendunia2026!

# REDIS (LXC 102)
REDIS_CLIENT=phpredis
REDIS_HOST=10.10.10.4
REDIS_PASSWORD=null
REDIS_PORT=6379
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# MINIO (LXC 103)
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=enotulenadmin
AWS_SECRET_ACCESS_KEY=enotulenadmin123
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=enotulen-recordings
AWS_ENDPOINT=http://10.10.10.5:9000
AWS_USE_PATH_STYLE_ENDPOINT=true

# REVERB
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=800000
REVERB_APP_KEY=my_reverb_key
REVERB_APP_SECRET=my_reverb_secret
REVERB_HOST="10.10.10.3"
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_APP_NAME="${APP_NAME}"
VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
EOF
```

## Langkah 4: Build & Jalankan Docker Compose Production
Terakhir, masih di dalam LXC 101 (di folder `/var/www/enotulen`), jalankan:

```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

Jika sudah selesai, aplikasi akan berjalan dan bisa diakses melalui web browser Anda dengan mengunjungi IP container Docker tersebut (misalnya `http://10.10.10.3` atau Port Forwarding yang Anda atur).
