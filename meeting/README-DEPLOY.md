# Panduan Deployment E-Notulen ke Server Proxmox

Panduan ini berisi langkah-langkah untuk melakukan _deployment_ aplikasi E-Notulen ke dalam server Proxmox yang sudah dipecah menjadi beberapa kontainer (LXC).

## Arsitektur Infrastruktur
- **LXC 100 (Database)**: PostgreSQL (10.10.10.2)
- **LXC 101 (Aplikasi)**: Docker App Server (10.10.10.3)
- **LXC 102 (Cache/Queue)**: Redis (10.10.10.4)
- **LXC 103 (Storage)**: MinIO (10.10.10.5)

## Langkah 1: Login ke Server Proxmox
Buka terminal (Command Prompt / PowerShell) di komputer lokal Anda, lalu masuk menggunakan SSH ke server Proxmox:

```bash
ssh root@100.107.175.84
# Masukkan password: Allahuakbar1213*
```

## Langkah 2: Masuk ke Kontainer Docker (LXC 101) & Unduh Kode
Setelah berada di terminal Proxmox, pindah ke dalam kontainer yang dikhususkan untuk menjalankan aplikasi Docker:

```bash
# Masuk ke dalam LXC 101
pct enter 101

# Buat direktori web (jika belum ada) dan masuk ke dalamnya
mkdir -p /var/www
cd /var/www

# Unduh source code terbaru dari Github
git clone https://github.com/Tmx11712/Meeting-Umsu.git enotulen

# Masuk ke direktori aplikasi
cd enotulen
```

## Langkah 3: Konfigurasi Environment (`.env`)
Aplikasi membutuhkan konfigurasi environment agar dapat terhubung dengan LXC lainnya (PostgreSQL, Redis, MinIO). 

Di dalam `/var/www/enotulen`, jalankan perintah ini untuk membuat file `.env` production secara otomatis:

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

## Langkah 4: Build & Jalankan Docker Compose
Langkah terakhir adalah melakukan *build* image Docker dan menjalankannya sebagai *background service*:

```bash
# Melakukan build docker image
docker compose -f docker-compose.prod.yml build

# Menjalankan kontainer docker
docker compose -f docker-compose.prod.yml up -d
```

Jika sudah selesai, aplikasi E-Notulen dapat diakses melalui web browser dengan mengunjungi IP kontainer aplikasi: `http://10.10.10.3`.
