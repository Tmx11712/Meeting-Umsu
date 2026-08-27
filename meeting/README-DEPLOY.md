# Panduan Lengkap Deployment E-Notulen ke Server Proxmox

Panduan ini adalah dokumentasi komprehensif dari awal (mengatur jaringan/port forwarding) hingga aplikasi menyala, menggunakan metode `git clone` untuk proses instalasi yang cepat dan bersih.

## Arsitektur Infrastruktur
- **Host Proxmox**: `100.107.175.84` (IP Publik / Akses dari Luar)
- **LXC 100 (Database)**: PostgreSQL (`10.10.10.2`)
- **LXC 101 (Aplikasi)**: Docker App Server (`10.10.10.3`)
- **LXC 102 (Cache/Queue)**: Redis (`10.10.10.4`)
- **LXC 103 (Storage)**: MinIO (`10.10.10.5`)

---

## Langkah 1: Login ke Server Proxmox (Host)
Buka terminal (Command Prompt / PowerShell) di komputer lokal Anda, lalu masuk menggunakan SSH ke server utama Proxmox:

```bash
ssh root@100.107.175.84
# Masukkan password: Allahuakbar1213*
```

---

## Langkah 2: Mengatur Port Forwarding (NAT) di Host Proxmox
Agar aplikasi yang ada di dalam kontainer `10.10.10.3` (LXC 101) bisa diakses dari luar menggunakan IP Proxmox (`100.107.175.84`), kita harus mengatur lalu lintas jaringannya.

Masih di terminal Proxmox (sebagai `root`), jalankan dua perintah `iptables` berikut untuk meneruskan Port 80 (Web) dan Port 8080 (WebSockets/Reverb):

```bash
# 1. Forwarding Port 80 (HTTP / Website) ke LXC 101
iptables -t nat -A PREROUTING -p tcp -d 100.107.175.84 --dport 80 -j DNAT --to-destination 10.10.10.3:80

# 2. Forwarding Port 8080 (Realtime WebSockets) ke LXC 101
iptables -t nat -A PREROUTING -p tcp -d 100.107.175.84 --dport 8080 -j DNAT --to-destination 10.10.10.3:8080

# 3. (Opsional) Mengaktifkan IP Masquerade jika belum aktif
iptables -t nat -A POSTROUTING -s 10.10.10.0/24 -j MASQUERADE
```
*(Perintah ini akan langsung aktif, namun akan hilang jika Proxmox di-restart. Untuk menjadikannya permanen, biasanya disimpan di file `/etc/network/interfaces` bagian `post-up`).*

---

## Langkah 3: Masuk ke Kontainer Aplikasi (LXC 101) & Unduh Kode
Setelah port forwarding aktif, sekarang pindah ke dalam kontainer yang dikhususkan untuk menjalankan aplikasi Docker:

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

---

## Langkah 4: Konfigurasi Environment (`.env`)
Aplikasi membutuhkan konfigurasi `.env`. Karena kita sudah melakukan port forwarding, pengaturan `APP_URL` dan `REVERB_HOST` wajib menggunakan IP Publik Proxmox (`100.107.175.84`).

Di dalam `/var/www/enotulen` (di LXC 101), jalankan perintah blok (copy-paste semua sekaligus) ini untuk membuat file `.env` secara otomatis:

```bash
cat << 'EOF' > .env
APP_NAME=enotulen
APP_ENV=production
APP_KEY=base64:duT5VTKp+gwtjhiMVlYRb3kXqjP8AmRmNfTu+vQOUdQ=
APP_DEBUG=false
APP_URL=http://100.107.175.84

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

# REVERB (WebSockets)
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=800000
REVERB_APP_KEY=my_reverb_key
REVERB_APP_SECRET=my_reverb_secret
REVERB_HOST="100.107.175.84"
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_APP_NAME="${APP_NAME}"
VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
EOF
```

---

## Langkah 5: Build & Jalankan Docker Compose
Langkah terakhir adalah melakukan *build* image Docker dan menjalankannya sebagai *background service*. Masih di dalam folder `/var/www/enotulen` (di LXC 101):

```bash
# Melakukan build docker image (Proses ini makan waktu beberapa menit karena akan install dependensi)
docker compose -f docker-compose.prod.yml build

# Menjalankan kontainer docker di background
docker compose -f docker-compose.prod.yml up -d
```

### 🎉 Selesai!
Aplikasi E-Notulen Anda sekarang berjalan dengan sempurna. 
Anda dapat langsung membukanya melalui browser di komputer Anda dengan mengunjungi:
**http://100.107.175.84**
