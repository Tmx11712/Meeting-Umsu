# 📋 E-Notulen — Sistem Manajemen Rapat UMSU

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2-9553E9?style=for-the-badge&logo=inertia&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-Whisper-412991?style=for-the-badge&logo=openai&logoColor=white)

**Aplikasi manajemen rapat berbasis web untuk Universitas Muhammadiyah Sumatera Utara (UMSU)**

</div>

---

## 📖 Tentang Aplikasi

**E-Notulen** adalah sistem manajemen rapat digital yang mendigitalisasi seluruh siklus rapat — dari penjadwalan, absensi, perekaman audio, transkripsi otomatis berbasis AI, hingga pembuatan dan persetujuan notulensi resmi.

### 🔄 Alur Kerja

```
Jadwal Rapat → Absensi → Rekam Audio → Transkripsi AI → Koreksi → Review Notulensi → Approval Pimpinan → Laporan PDF
```

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|-------|-----------|
| 📅 **Manajemen Rapat** | Buat & jadwalkan rapat, tracking status otomatis |
| 👥 **Absensi Digital** | Pencatatan kehadiran peserta rapat |
| 🎙️ **Rekam Audio** | Rekam langsung dari browser atau upload file audio |
| 🤖 **Transkripsi AI** | Otomatis menggunakan OpenAI Whisper API |
| ✏️ **Koreksi Transkrip** | Edit & perbaiki hasil transkripsi |
| 📝 **Notulensi** | Generate & review hasil notulensi rapat |
| ✅ **Approval** | Pimpinan menyetujui/menolak notulensi |
| 📄 **Laporan PDF** | Unduh notulensi dalam format PDF |
| ⚙️ **Manajemen Akses** | Role-based permissions (Super Admin, Admin, Pimpinan, dll) |
| 📊 **Dashboard** | Statistik dan ringkasan aktivitas rapat |

---

## 🛠️ Tech Stack

- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: React 19 + TypeScript + Inertia.js
- **UI Components**: shadcn/ui + Tailwind CSS
- **Database**: MySQL
- **AI Service**: OpenAI Whisper API (transkripsi otomatis)
- **Auth**: Laravel Jetstream + Passkey support

---

## 🚀 Cara Instalasi

### Persyaratan Sistem
- PHP >= 8.2
- Composer
- Node.js & NPM
- MySQL / MariaDB
- OpenAI API Key

### Langkah Instalasi

**1. Clone repositori**
```bash
git clone https://github.com/Tmx11712/Meeting-Umsu.git
cd Meeting-Umsu/meeting
```

**2. Install dependensi PHP**
```bash
composer install
```

**3. Install dependensi Node.js**
```bash
npm install
```

**4. Konfigurasi environment**
```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan:
```env
DB_DATABASE=nama_database
DB_USERNAME=username_db
DB_PASSWORD=password_db

OPENAI_API_KEY=your-openai-api-key-here
```

**5. Generate application key**
```bash
php artisan key:generate
```

**6. Migrasi & seed database**
```bash
php artisan migrate --seed
```

**7. Jalankan aplikasi**

Terminal 1 (Backend):
```bash
php artisan serve
```

Terminal 2 (Frontend):
```bash
npm run dev
```

**8. Akses aplikasi**

Buka browser di: `http://localhost:8000`

---

## 👤 Default User

Setelah menjalankan seeder, akun default:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@example.com | password |

---

## 📁 Struktur Proyek

```
meeting/
├── app/
│   ├── Http/Controllers/    # Controller rapat, notulensi, approval, dll
│   ├── Models/              # Model Eloquent
│   ├── Services/            # OpenAI, Transkripsi, Sinkronisasi
│   └── Jobs/                # Background job transkripsi audio
├── resources/
│   ├── js/
│   │   ├── pages/meetings/  # Halaman React: rekam, review, approval, dll
│   │   ├── components/      # Komponen UI reusable
│   │   └── hooks/           # Custom React hooks (permissions, dll)
│   └── views/pdf/           # Template PDF notulensi
└── routes/
    └── web.php              # Definisi route aplikasi
```

---

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan internal **UMSU**.

---

<div align="center">
  Dikembangkan dengan ❤️ untuk UMSU
</div>
