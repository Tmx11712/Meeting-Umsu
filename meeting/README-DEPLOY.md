# Panduan Lengkap (Full) Deployment E-Notulen ke Server Proxmox

Tutorial ini disusun secara lengkap dan tidak dirangkum, agar Anda dapat melakukan *deployment* aplikasi dari nol (LXC kosong) hingga aplikasi menyala dengan sempurna, termasuk proses instalasi alat yang dibutuhkan dan inisialisasi *database*.

---

## 1. Arsitektur Infrastruktur
Sebelum mulai, pastikan Anda memahami IP dari masing-masing komponen:
- **Host Proxmox**: `100.107.175.84` (IP Publik / Akses dari Luar)
- **LXC 100 (Database)**: PostgreSQL (`10.10.10.2`)
- **LXC 101 (Aplikasi)**: Docker App Server (`10.10.10.3`) - *Fokus utama kita*
- **LXC 102 (Cache/Queue)**: Redis (`10.10.10.4`)
- **LXC 103 (Storage)**: MinIO (`10.10.10.5`)

---

## 2. Mengatur Jaringan (Port Forwarding) di Host Proxmox
Agar aplikasi di dalam kontainer `10.10.10.3` bisa diakses menggunakan IP Proxmox (`100.107.175.84`), kita harus mengatur *Port Forwarding*.

1. Buka terminal di laptop Anda dan masuk ke Proxmox Host:
   ```bash
   ssh root@100.107.175.84
   # Masukkan password: Allahuakbar1213*
   ```
2. Jalankan perintah `iptables` ini untuk meneruskan trafik Port 80 (Web) dan 8080 (WebSockets):
   ```bash
   iptables -t nat -A PREROUTING -p tcp -d 100.107.175.84 --dport 80 -j DNAT --to-destination 10.10.10.3:80
   iptables -t nat -A PREROUTING -p tcp -d 100.107.175.84 --dport 8080 -j DNAT --to-destination 10.10.10.3:8080
   iptables -t nat -A POSTROUTING -s 10.10.10.0/24 -j MASQUERADE
   ```
3. **PENTING**: Agar aturan *port forwarding* ini tidak hilang saat Proxmox di-restart, simpan secara permanen dengan menginstal `iptables-persistent`:
   ```bash
   apt update
   apt install iptables-persistent -y
   ```
   *(Saat muncul layar ungu/biru menanyakan "Save current IPv4 rules?", pilih **Yes / Enter**).*

---

## 3. Persiapan LXC 101 (Install Git & Docker)
Setelah jaringan siap, kita masuk ke dalam "kamar" aplikasi (LXC 101) dan menginstal alat yang wajib ada.

1. Masuk ke dalam LXC 101:
   ```bash
   pct enter 101
   ```
2. Lakukan *update* sistem operasi dan pasang Git:
   ```bash
   apt update && apt upgrade -y
   apt install git curl wget nano -y
   ```
3. Pasang Docker & Docker Compose (Jika belum terpasang di LXC 101):
   ```bash
   # Script otomatis menginstal Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```
   *(Tunggu proses instalasi Docker selesai).*

---

## 4. Mengunduh Aplikasi (Git Clone)
Setelah Git dan Docker siap, mari kita unduh kode aplikasi dari Github.

1. Buat folder `/var/www` dan masuk ke dalamnya:
   ```bash
   mkdir -p /var/www
   cd /var/www
   ```
2. Unduh *source code*:
   ```bash
   git clone https://github.com/Tmx11712/Meeting-Umsu.git enotulen
   ```
3. Masuk ke folder proyek:
   ```bash
   cd enotulen
   ```

---

## 5. Mengatur Konfigurasi Environment (`.env`)
Di dalam direktori `/var/www/enotulen`, buat file konfigurasi untuk menghubungkan aplikasi ke *Database*, *Redis*, dan *MinIO*.

1. Jalankan perintah *copy-paste* blok ini secara utuh (tekan Enter):
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

## 6. Build dan Jalankan Aplikasi (Docker)
Sekarang waktunya merakit (*build*) aplikasi menjadi *Docker Image* dan menjalankannya.

1. Lakukan Build (Ini akan menginstal ekstensi PHP, Composer, dan Node.js/Vite di dalam kontainer):
   ```bash
   docker compose -f docker-compose.prod.yml build
   ```
2. Nyalakan aplikasi di belakang layar (*background*):
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

---

## 7. Inisialisasi Database & Cache (Penting!)
Aplikasi sudah menyala, tapi *database* masih kosong. Kita harus menjalankan *Migration* (membuat tabel) dari dalam kontainer Docker PHP (`app`).

1. Masuk sementara ke dalam kontainer PHP aplikasi kita:
   ```bash
   docker compose -f docker-compose.prod.yml exec app bash
   ```
2. Di dalam kontainer tersebut (`/var/www/html#`), jalankan perintah Laravel berikut:
   ```bash
   # Membuat tabel database
   php artisan migrate --force
   
   # Menyiapkan Storage Link (Jika ada gambar lokal)
   php artisan storage:link
   
   # Optimasi aplikasi (Caching rute, view, dan konfigurasi)
   php artisan optimize
   
   # Keluar dari kontainer
   exit
   ```

---

### 🎉 Selesai!
Selamat! Seluruh tahapan dari nol sudah Anda lakukan. 
Aplikasi E-Notulen kini berjalan sempurna di *production*. Silakan buka browser di laptop/PC Anda dan kunjungi:

**http://100.107.175.84**
