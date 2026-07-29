# E-Notulen (Sistem Manajemen Rapat & Notulensi)

## Tentang Aplikasi
E-Notulen adalah aplikasi berbasis web yang dirancang untuk memudahkan proses manajemen rapat, mulai dari penjadwalan, pencatatan kehadiran (absensi), hingga dokumentasi hasil rapat (notulensi). Aplikasi ini dilengkapi dengan fitur perekaman audio yang dapat mentranskripsi percakapan secara otomatis menggunakan teknologi OpenAI, memungkinkan pembuatan notulensi menjadi lebih cepat, akurat, dan terstruktur. 

Fitur-fitur utama meliputi:
- **Manajemen Jadwal Rapat**: Pembuatan dan penjadwalan rapat.
- **Absensi & Kehadiran**: Pencatatan kehadiran peserta rapat.
- **Perekaman Rapat & Transkripsi Otomatis**: Merekam jalannya rapat dan menghasilkan transkrip otomatis menggunakan OpenAI.
- **Koreksi Transkrip**: Mengedit dan menyesuaikan hasil transkripsi rapat jika diperlukan.
- **Notulensi & Approval**: Review, pembuatan notulensi rapat, dan proses persetujuan (approval) oleh pimpinan.
- **Manajemen Pengguna & Peran**: Pengelolaan roles dan permissions pengguna aplikasi.

## Teknologi (Tech Stack)
- **Backend**: Laravel (PHP)
- **Frontend**: React (TypeScript), Inertia.js, Tailwind CSS
- **AI Service**: OpenAI API (untuk transkripsi)
- **Database**: MySQL/PostgreSQL

## Persyaratan Sistem
- PHP >= 8.2
- Composer
- Node.js & NPM / PNPM
- Database Server (MySQL/MariaDB atau PostgreSQL)
- Akun OpenAI untuk integrasi API (API Key)

## Cara Instalasi

Berikut adalah langkah-langkah untuk menjalankan aplikasi ini secara lokal (local development):

1. **Clone repositori**
   ```bash
   git clone https://github.com/Tmx11712/meeting.git
   cd meeting
   ```

2. **Install dependensi PHP (Backend)**
   ```bash
   composer install
   ```

3. **Install dependensi Node.js (Frontend)**
   Gunakan `pnpm` atau `npm`:
   ```bash
   pnpm install
   # atau
   npm install
   ```

4. **Konfigurasi Environment**
   Salin file konfigurasi `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Buka file `.env` dan sesuaikan konfigurasi database (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`), serta pastikan Anda mengisi API Key OpenAI:
   ```env
   OPENAI_API_KEY=your-openai-api-key-here
   ```

5. **Generate Application Key**
   ```bash
   php artisan key:generate
   ```

6. **Migrasi Database & Seeder**
   Pastikan server database Anda sudah berjalan, kemudian jalankan migrasi beserta data awal (roles/permissions):
   ```bash
   php artisan migrate --seed
   ```

7. **Jalankan Aplikasi**
   Anda perlu menjalankan server Laravel dan Vite secara bersamaan.
   
   Terminal 1 (Backend Laravel):
   ```bash
   php artisan serve
   ```
   
   Terminal 2 (Frontend Vite):
   ```bash
   pnpm run dev
   # atau
   npm run dev
   ```

8. **Akses Aplikasi**
   Buka browser dan akses aplikasi di: `http://localhost:8000`
