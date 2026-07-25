# PROMPT: Build "eNotulen" — Sistem Notulen Rapat Digital Terintegrasi

Kamu adalah senior full-stack developer. Bangun aplikasi **eNotulen** di atas project **Laravel React Starter Kit (Inertia.js)** yang SUDAH ter-install di direktori ini. Jangan buat project baru — deteksi struktur starter kit yang ada (`routes/web.php`, `resources/js/pages`, `app/Http/Controllers`, dll.) dan ikuti konvensinya (TypeScript, shadcn/ui, Tailwind, Ziggy).

Stack wajib:
- **Backend**: Laravel (versi starter kit terpasang), Inertia.js (server adapter sudah ada)
- **Frontend**: React + TypeScript (dari starter kit), Inertia.js client, shadcn/ui + Tailwind (sudah ada di starter kit — **pakai komponen yang sudah terpasang, jangan install ulang**)
- **Database**: PostgreSQL 16, jalan di **Docker**
- **File storage**: MinIO (S3-compatible), jalan di **Docker**
- **Queue**: Redis + Laravel Horizon/queue worker (untuk job transkripsi async), jalan di **Docker**
- **AI**: OpenAI API (Whisper untuk speech-to-text, GPT untuk ringkasan/action items)
- **DB client**: Tidak perlu container tambahan — user connect via **DBeaver** dari host ke port Postgres yang di-expose

Referensi visual: 11 screenshot mockup UI dilampirkan terpisah (sign_up, login, reset_pw, dashboard, jadwal, buat_rapat, rekam, absensi, review, pimpinan, role). **Ikuti field, label bahasa Indonesia, urutan kolom tabel, dan struktur breadcrumb/stepper PERSIS seperti di mockup** — jangan improvisasi nama field atau menambah/mengurangi kolom yang terlihat di gambar. **Tampilan visual (warna, spacing, tipografi, komponen) HARUS mengikuti 11 gambar mockup, BUKAN skema warna dari prototipe di bawah.**

## Referensi Prototipe — `aplikasi_rapat.html` + `script.js` + `style.css`

Selain 11 gambar mockup, tersedia juga **prototipe fungsional HTML/CSS/JS statis** (single-page, client-side) yang sudah mengimplementasikan sebagian alur secara nyata — termasuk pemanggilan OpenAI Whisper & GPT yang benar-benar jalan di browser. Prototipe ini **BUKAN referensi visual** (skema warnanya krem/`Plus Jakarta Sans`/Tabler Icons — abaikan semua itu, ikuti gambar mockup untuk tampilan). Prototipe ini adalah **referensi logic yang sudah terbukti jalan** dan harus dipakai sebagai basis, dengan penyesuaian arsitektur berikut:

**WAJIB dipertahankan logic-nya (porting ke Laravel service/job, jangan ditulis ulang dari nol):**
- Algoritma pemecahan audio besar di `splitAudioFile`, `sliceAudioBuffer`, `audioBufferToWavBlob` (script.js baris ~315–421): decode via `AudioContext`, target ±20MB per segmen WAV PCM 16-bit, threshold kirim-langsung vs pecah adalah **24MB** (batas Whisper API). Port logic penentuan ukuran segmen ini ke sisi yang paling sesuai (bisa tetap di browser sebelum upload, atau di backend job — putuskan berdasar UX, tapi angka 20MB/24MB harus sama).
- Urutan alur **koreksi transkrip terjadi SEBELUM ringkasan AI dibuat** (`toggleRec` → `renderTranskripUntukKoreksi` → user edit di textarea → `doLanjutkanRingkasan` mengirim `correctedTranscript`, BUKAN transkrip mentah, ke GPT). Ini bukan urutan yang saya asumsikan sebelumnya di prompt ini — pastikan `MeetingMinuteController@generateAiSummary` menerima transkrip HASIL KOREKSI dari tabel `meeting_transcript_corrections`, bukan `meeting_transcripts` mentah.
- Prompt GPT di `doLanjutkanRingkasan` (script.js baris ~1026–1042) — **pakai verbatim isinya** (aturan: heading per topik yang ditentukan dari isi transkrip bukan dipaksakan, paragraf naratif bukan bullet points, kaitkan pernyataan ke nama HANYA jika disebut eksplisit dalam transkrip — jangan pernah mengarang nama, gunakan tabel Markdown hanya untuk data tabular, gunakan bullet hanya untuk poin penting, section akhir "## Keputusan dan Tindak Lanjut" berupa numbered list dengan PIC+deadline jika disebutkan). Adaptasi ke `OpenAiTranscriptionService::generateSummary()`, ganti output format dari Markdown-only menjadi `response_format: json_object` terstruktur (sesuai Section 3 di bawah) TAPI pertahankan seluruh instruksi kualitatifnya sebagai bagian dari system/user prompt.
- Dukungan **dua sumber audio**: (a) upload file (`.mp3/.wav/.m4a`), dan (b) "Rekam dari Sistem" via `navigator.mediaDevices.getDisplayMedia({video:true, audio:true})` lalu ambil `getAudioTracks()` saja (script.js baris ~449–513) — ini untuk merekam audio dari tab/aplikasi lain (mis. Zoom/Meet), BUKAN sekadar mikrofon (`getUserMedia`). Sediakan keduanya sebagai pilihan di UI "Humas Rekam", persis seperti tab "Upload" vs "Rekam dari Sistem" di prototipe.
- Validasi: tanpa API key tersimpan → tombol transkripsi nonaktif dengan pesan jelas (`"Isi dan simpan API key OpenAI terlebih dahulu"`) — pertahankan pola UX ini, hanya pindahkan pengecekan ke server-side.

**WAJIB DIUBAH saat porting (jangan tiru pola ini apa adanya — ini kelemahan arsitektur prototipe yang harus diperbaiki):**
- **[KRITIS/KEAMANAN]** Prototipe memanggil `https://api.openai.com/...` **langsung dari browser** dengan API key disimpan di variabel JS sisi klien (`openaiApiKey`, diisi user via input field di halaman Humas Rekam, fungsi `saveWebhookUrl`). Ini membuat API key terlihat oleh siapa pun yang buka DevTools/Network tab. **Di implementasi Laravel, pola ini TIDAK BOLEH dibawa.** Browser hanya boleh mengirim file audio/teks ke endpoint Laravel milik sendiri (mis. `POST /meetings/{id}/transcribe`); Laravel-lah yang menyimpan `OPENAI_API_KEY` di `.env` dan melakukan call ke OpenAI dari server. Hapus total konsep "API key diisi user lewat form dan disimpan di sesi browser" — ganti dengan API key dikonfigurasi sekali oleh admin di level server/`.env`. Badge "Koneksi OpenAI API" di UI (`rekam.png`) tetap ada, tapi datanya berasal dari health-check ke backend Laravel, bukan validasi key di JS.
- Generate PDF saat ini 100% client-side pakai `jsPDF` + markdown-to-PDF renderer manual (`downloadNotulenPDF`, `renderMarkdownToPDF`, `renderTablePDF` — script.js baris ~678–940). Untuk versi Laravel, generate dokumen (`meeting_documents` kategori `notulen_pdf`/`notulen_docx`) di **backend** (pakai `barryvdh/laravel-dompdf` atau `phpoffice/phpword`) supaya dokumen tersimpan permanen di MinIO dan bisa diakses ulang dari halaman Review/Pimpinan (sesuai daftar "Dokumen Notulen" dengan tombol unduh per file di `pimpinan.png`), bukan cuma diunduh sekali dari sesi browser yang generate.
- Role-switching (`loginAs('umum'|'humas'|'pimpinan'|'viewer')`, klik kartu role di halaman login) adalah simulasi tanpa password untuk keperluan demo. Ganti total dengan auth Laravel sungguhan (register/login/reset password sesuai `sign_up.png`/`login.png`/`reset_pw.png`) — role ditentukan dari data user di database (tabel `model_has_roles`), bukan dipilih bebas saat login.
- Struktur navigasi prototipe pakai 6 step tanpa halaman "Pimpinan" (approval) terpisah — halaman notulen menangani publish langsung (`doPublish`). Mockup gambar (dan Section 4 di bawah) punya **7 tahap** termasuk halaman approval Pimpinan yang terpisah dari Review. Tambahkan tahap ke-7 ini; jangan gabungkan approval ke halaman Review seperti di prototipe.
- Style/warna/font/ikon: ganti total sesuai gambar mockup (lihat instruksi styling di Section 4). Jangan port `style.css` apa adanya.

Jika ada bagian logic di `script.js` yang tidak disebutkan eksplisit di atas tapi terlihat berguna (mis. `escapeHtml`, pola disable-button-saat-loading, format timer `HH:MM:SS`), silakan diadaptasi juga — poin di atas adalah yang **wajib**, bukan daftar lengkap satu-satunya yang boleh dipakai.

---

## 0. Docker Compose — infrastruktur

Buat/edit `docker-compose.yml` di root project. Jangan bikin ulang layanan `app`/`laravel` kalau starter kit sudah punya Sail atau setup Docker sendiri — **integrasikan**, jangan duplikasi. Services yang dibutuhkan:

```yaml
services:
  pgsql:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: enotulen
      POSTGRES_USER: enotulen
      POSTGRES_PASSWORD: <generate secure value, put in .env>
    volumes: ["enotulen-pgsql:/var/lib/postgresql/data"]
    healthcheck: pg_isready

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes: ["enotulen-redis:/data"]

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports: ["9000:9000", "9001:9001"]
    environment:
      MINIO_ROOT_USER: <value>
      MINIO_ROOT_PASSWORD: <value, min 8 chars>
    volumes: ["enotulen-minio:/data"]

  # Laravel app + queue worker containers per starter kit's existing convention
  # (reuse Sail if present; otherwise add a php-fpm + queue-worker service)

volumes:
  enotulen-pgsql:
  enotulen-redis:
  enotulen-minio:
```

Tambahkan `minio/mc` init step (bisa lewat entrypoint script atau one-shot container) yang otomatis membuat bucket `enotulen-recordings` dan `enotulen-documents` saat pertama kali `up`.

**`.env` tambahan:**
```
DB_CONNECTION=pgsql
DB_HOST=pgsql
DB_PORT=5432
DB_DATABASE=enotulen
DB_USERNAME=enotulen
DB_PASSWORD=...

FILESYSTEM_DISK=s3
AWS_ENDPOINT=http://minio:9000
AWS_USE_PATH_STYLE_ENDPOINT=true
AWS_BUCKET=enotulen-recordings
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

QUEUE_CONNECTION=redis
REDIS_HOST=redis

OPENAI_API_KEY=...
OPENAI_TRANSCRIBE_MODEL=whisper-1
OPENAI_SUMMARY_MODEL=gpt-4o-mini
```

Konfigurasi `config/filesystems.php` disk `s3` agar mengarah ke MinIO. Dokumentasikan di `README.md`: cara `docker compose up -d`, run migration, dan connect dari **DBeaver** (host `localhost`, port `5432`, kredensial dari `.env`).

---

## 1. Database Schema (migrations)

Buat migration untuk seluruh tabel berikut. Gunakan `uuid` sebagai primary key untuk semua tabel domain (bukan auto-increment), `timestamps()`, dan `softDeletes()` di tabel master (users, meetings, roles).

### RBAC (referensi: gambar `role.png`, panel 13–21)
- `roles` — id, name, guard_name (defaultnya `web`, terlihat di form Create Role), description, timestamps
- `permissions` — id, name (format `modul.aksi`, mis. `dashboard.read`, `meeting.create`, `meeting.update`, `meeting.delete`), group/module (mis. "Dashboard", "Rapat"), description
- `role_has_permissions` — pivot role_id, permission_id
- `model_has_roles` — pivot user_id, role_id (izinkan multi-role per user meski UI saat ini pilih satu role per user)
- `model_has_permissions` — pivot user_id, permission_id (untuk "User Permissions" — override langsung ke user, terpisah dari role)
- `menus` — id, name, route/url (mis. `dashboard.index`), icon (nama ikon lucide-react), order/urutan, status (aktif/nonaktif), parent_id (nullable, untuk submenu)
- `role_has_menus` — pivot untuk kontrol menu mana yang tampil per role (opsional tapi terlihat tersirat dari struktur — implementasikan agar sidebar dinamis sesuai role)

Gunakan package **spatie/laravel-permission** sebagai basis (sudah battle-tested untuk role/permission), tapi tambahkan tabel `menus` custom di atasnya karena spatie tidak menyediakan itu.

**Role tambahan di luar mockup — "Administrator":** gambar `role.png` hanya menampilkan 5 role (Bag. Umum, Bag. Humas, Pimpinan, Viewer, Super Admin). Selain kelima itu, tambahkan role ke-6 **Administrator** yang secara sengaja tidak ada di mockup — posisinya di hierarki hak akses ada **di bawah Super Admin, di atas role operasional lain**: bisa kelola data (users, meetings, absensi, notulen, laporan — sama seperti Super Admin di modul-modul ini) tapi **TIDAK punya akses ke modul konfigurasi RBAC inti** (Roles, Permissions, Menus, Role Permissions, User Permissions — 5 dari 6 panel Configuration tetap eksklusif Super Admin; Administrator hanya boleh akses panel Users di Configuration, itu pun tanpa bisa assign role setingkat Super Admin ke user lain). Perbedaan intinya: **Super Admin** = kontrol penuh sistem termasuk mendefinisikan role/permission/menu baru; **Administrator** = operasional harian penuh (semua modul bisnis) tanpa bisa mengubah struktur RBAC itu sendiri. Middleware/Policy harus menegakkan pembedaan ini secara nyata (bukan cuma label berbeda dengan permission set yang sama) — beri Administrator permission set eksplisit yang mengecualikan `role.*`, `permission.*`, `menu.*`.

### Users
- `users` — tambahkan ke migration bawaan starter kit: `username` (nullable, unique), `initials` (untuk avatar badge seperti "BU", "BH" di gambar — generate otomatis dari nama, jangan simpan manual kecuali eksplisit), `status` (aktif/nonaktif), `department` (Bag. Umum, Bag. Humas, dll — lihat gambar `role.png` panel 14 kolom "Role" menampilkan "Bag. Umum", "Bag. Humas", "Pimpinan", "Viewer", "Super Admin")

### Meetings (referensi: `buat_rapat.png`, `jadwal.png`)
- `meetings` — id, title (Judul Rapat, required), description (opsional), date, start_time, end_time, duration (computed atau stored), location (Ruangan/Lokasi, required), type (Tipe Rapat — buat enum: dropdown terlihat kosong di gambar, isi dengan opsi masuk akal: "Internal", "Eksternal", "Koordinasi", "Evaluasi"), notes (Catatan Tambahan, opsional), status (enum: `terjadwal`, `berlangsung`, `selesai`, dibatalkan), created_by (user_id), current_stage (integer 1-7, tracking stepper workflow)
- `meeting_participants` — meeting_id, user_id, is_invited (boolean, dari daftar "Pilih Peserta" di buat_rapat.png)

### Recording & Transcription (referensi: `rekam.png`)
- `meeting_recordings` — id, meeting_id, file_path (path di MinIO), file_size, duration_seconds, source (enum: `upload` / `system_record` — sesuai dua opsi di UI "Upload Rekaman" vs "Rekam dari Sistem"), status (enum: `recording`, `uploaded`, `processing`, `transcribing`, `completed`, `failed`), recorded_by (user_id — "Operator Rekam"), openai_model_used (mis. "gpt-4o-mini" terlihat di gambar sebagai model field, tapi untuk transkripsi gunakan whisper — dokumentasikan keduanya: whisper untuk STT, gpt-4o-mini untuk ringkasan)
- `meeting_transcripts` — id, meeting_id, recording_id, timestamp_seconds (integer, detik dari mulai rapat — untuk field seperti "00:01:15"), speaker (nullable, jika whisper diarization tersedia), text, is_live (boolean, untuk bedakan live-streaming chunk vs final), sequence_order
- `meeting_transcript_corrections` — id, transcript_id, original_text, corrected_text, corrected_by (user_id), created_at (untuk fitur "Koreksi Transkrip" di stepper tahap 4)

### Absensi (referensi: `absensi.png`)
- `meeting_attendances` — id, meeting_id, user_id, status (enum: `hadir`, `terlambat`, `tidak_hadir` — sesuai 3 status di donut chart), check_in_time, method (enum: `qr_code`, `manual`), recorded_by (nullable user_id, untuk manual input oleh operator), notes

### Notulen / Minutes (referensi: `review.png`, `pimpinan.png`)
- `meeting_minutes` — id, meeting_id, content (JSON terstruktur: pembukaan, pembahasan[], keputusan[], tindak_lanjut[] — lihat struktur numbered list di gambar review.png), ai_topics_count, ai_decisions_count, ai_summary_generated_at, version (mis. "v1.0"), status (enum: `draft`, `review`, `siap_dikirim`, `menunggu_persetujuan`, `disetujui`, `ditolak`), reviewed_by (user_id), reviewed_at, review_notes
- `meeting_action_items` — id, meeting_id, minute_id, description, pic (person in charge — free text atau user_id), deadline, status (enum: `open`, `in_progress`, `done`)
- `meeting_documents` — id, meeting_id, file_path, file_name, file_size, mime_type, category (enum: `notulen_pdf`, `notulen_docx`, `action_items_xlsx`, `supporting`), uploaded_by
- `meeting_approvals` — id, meeting_id, minute_id, approved_by (user_id, harus role Pimpinan), decision (enum: `approved`, `rejected`), notes (opsional, maks 500 karakter sesuai counter di gambar), decided_at

**Wajib**: setiap migration pakai `foreignId(...)->constrained()->cascadeOnDelete()` yang sesuai, dan tambahkan index pada kolom yang sering di-query (meeting_id, status, user_id).

---

## 2. Models & Relationships

Buat Eloquent model untuk tiap tabel di atas dengan relasi lengkap (`belongsTo`, `hasMany`, `belongsToMany`). Model penting:

- `Meeting` — relasi ke participants, recordings, transcripts, attendances, minutes, actionItems, documents, approval; accessor `getAttendanceRateAttribute()`, `getDurationFormattedAttribute()` (format `HH:MM:SS` seperti "01:24:36" di gambar)
- `User` — trait `HasRoles` (spatie), relasi ke meetings created, meetings participated
- Gunakan **Laravel Policy** per model (`MeetingPolicy`, `UserPolicy`, dll.) yang cek permission via spatie (`$user->can('meeting.update')`), didaftarkan di `AuthServiceProvider`.

---

## 3. Backend: Controllers, Routes, Middleware

### Struktur routing (Inertia)
Ikuti pola resource controller Laravel + Inertia response (`Inertia::render('PageName', [...])`), grouped dengan middleware `auth` dan permission check kustom.

```
routes/web.php
  Route::middleware(['auth'])->group(function () {
    Dashboard, Meetings (jadwal-rapat), Recordings, Attendances,
    Minutes (notulen), Reports (laporan)
  });
  Route::middleware(['auth', 'permission:users.manage'])->prefix('configuration')->group(...)
    Users, Roles, Permissions, Menus, RolePermissions, UserPermissions
routes/auth.php — login, register (sign-up), password reset (starter kit sudah menyediakan basisnya — SESUAIKAN field & copy Bahasa Indonesia, jangan bikin dari nol)
```

### Middleware kustom
Buat `CheckMenuPermission` middleware yang memvalidasi akses menu berdasarkan tabel `menus` + `role_has_menus`, dipakai untuk generate sidebar dinamis (bukan hardcode di frontend).

### Controllers wajib (buat semua, dengan validasi Form Request terpisah per controller):
1. `Auth/RegisteredUserController` — modifikasi field sesuai `sign_up.png`: nama_lengkap, email, username (opsional), password, password_confirmation
2. `Auth/PasswordResetLinkController` — sesuai `reset_pw.png`
3. `DashboardController@index` — return stats: rapat bulan ini (+ % vs bulan lalu), notulen selesai, action items terbuka, rata-rata kehadiran; + rapat terbaru (3 terakhir), action items mendesak (diurutkan by deadline), jadwal mendatang (3 berikutnya)
4. `MeetingController` — full resource CRUD (index dengan search+filter status+filter bulan sesuai `jadwal.png`, store, update, destroy)
5. `MeetingRecordingController` — `store` (upload file ke MinIO via `Storage::disk('s3')`), `startSystemRecording`, `stopSystemRecording`, `uploadChunk` (untuk live recording browser)
6. `TranscriptionController@transcribe` — dispatch job async ke queue, endpoint untuk poll progress
7. `TranscriptCorrectionController` — CRUD koreksi per baris transkrip
8. `AttendanceController` — index, `generateQrCode` (pakai package `simplesoftwareio/simple-qrcode` atau serupa), `checkInViaQr`, `storeManual`, `destroy`
9. `MeetingMinuteController` — index (review notulen), `generateAiSummary` (panggil OpenAI), `update` (edit manual), `sendToPimpinan` (ubah status → `menunggu_persetujuan`)
10. `MeetingApprovalController@store` — approve/reject oleh Pimpinan, validasi `$user->hasRole('Pimpinan')`
11. `ReportController@index` — laporan (halaman "Laporan" di sidebar — belum ada mockup detail, buat halaman ringkas dengan filter tanggal + export)
12. Configuration controllers: `UserManagementController`, `RoleController`, `PermissionController`, `MenuController`, `RolePermissionController`, `UserPermissionController` — semua CRUD sesuai 6 panel di `role.png`

### OpenAI Integration — DETAIL PENTING

**Keamanan (baca dulu sebelum implementasi):** prototipe referensi (`script.js`) memanggil OpenAI langsung dari browser dengan key tersimpan di sisi klien — pola ini **dilarang** di sini. Semua call ke `api.openai.com` HARUS terjadi di Laravel (server-side), memakai `OPENAI_API_KEY` dari `.env`. Browser hanya berkomunikasi dengan endpoint Laravel sendiri (`/meetings/{id}/recordings`, `/meetings/{id}/transcribe`, dst).

Buat `app/Services/OpenAiTranscriptionService.php`:
- Method `transcribeChunk(string $filePathOrBlob): string` → panggil OpenAI Whisper API (`audio.transcriptions`, model `whisper-1`, `language: 'id'`), return teks. Jika file melebihi **24MB** (batas Whisper), pecah dulu jadi beberapa segmen sebelum dikirim satu-per-satu lalu digabung — port logic pemecahan ini dari prototipe (lihat "Referensi Prototipe" di atas: decode audio, target ±20MB/segmen WAV PCM 16-bit, gabung hasil transkrip tiap segmen dengan spasi). Boleh dilakukan di backend (pakai `getID3`/ekstensi audio PHP) ATAU tetap di browser sebelum upload (kirim WAV per-segmen ke endpoint Laravel) — pilih yang lebih sederhana untuk diimplementasikan dengan benar, tapi angka threshold 24MB/target 20MB harus dipertahankan karena itu batas asli API Whisper, bukan angka sembarang.
- Method `generateSummary(Meeting $meeting, string $correctedTranscript): array` → **input WAJIB transkrip yang sudah dikoreksi** (dari `meeting_transcript_corrections`, hasil tahap "Koreksi Transkrip"), BUKAN transkrip mentah dari Whisper. Kirim ke GPT (`gpt-4o-mini`) memakai **prompt yang sudah terbukti di prototipe** (`script.js` fungsi `doLanjutkanRingkasan`, baris ~1026–1042) sebagai basis instruksi — pertahankan semua aturan kualitatifnya (topik ditentukan dari isi transkrip bukan struktur baku, narasi bukan bullet paksa, larangan mengarang nama, tabel Markdown hanya untuk data tabular, section akhir "Keputusan dan Tindak Lanjut" numbered dengan PIC+deadline). Modifikasi bagian akhir prompt supaya modelnya me-return **JSON** (`response_format: {type: "json_object"}`) berstruktur `{pembukaan, pembahasan: [{topik, narasi, tabel?, list?}], keputusan: [], tindak_lanjut: [{description, pic, deadline}], topik_count, keputusan_count}` alih-alih Markdown mentah, supaya bisa disimpan terstruktur ke `meeting_minutes.content` dan dirender ulang di halaman Review/Pimpinan sesuai numbered-list format di gambar `review.png`/`pimpinan.png`.
- Buat `TranscribeAudioJob` (implements `ShouldQueue`) yang dijalankan async, update `meeting_recordings.status` step-by-step (`processing` → `transcribing` → `completed`), broadcast progress via **Laravel Reverb / Echo** (WebSocket) supaya progress bar & live transcript di frontend update real-time tanpa polling — atau minimal, sediakan endpoint polling tiap 3 detik sebagai fallback jika Reverb tidak mau dipakai.
- Rate limit request ke OpenAI (gambar `rekam.png` menampilkan "Request/Menit: 12/60", "Sisa Kuota: 48 (80%)") — implementasikan counter ini via Redis, tampilkan real value bukan hardcode.
- Tangani error OpenAI (rate limit, timeout, invalid audio, **API key belum dikonfigurasi**) dengan retry logic (`Job::backoff()`) dan update status `failed` + simpan error message jika semua retry gagal. Jika `OPENAI_API_KEY` kosong di `.env`, endpoint transkripsi harus menolak dengan pesan jelas ("API key OpenAI belum dikonfigurasi di server"), bukan gagal diam-diam — pertahankan semangat validasi yang ada di prototipe (`toggleRec` menolak jalan tanpa key), hanya pindahkan pengecekannya ke server.

### Audio Recording dari Browser (real, bukan mock)

Sediakan **dua sumber audio** di halaman Humas Rekam, sesuai dua tab di prototipe (`switchAudioSource`) dan dua panel "Upload Rekaman" / "Rekam dari Sistem" di `rekam.png`:

1. **Upload file** — drag-drop atau pilih file (`.mp3`, `.wav`, `.m4a`), maks 200MB (sesuai teks di `rekam.png`), lalu dikirim ke backend untuk ditranskripsi.
2. **Rekam dari Sistem** — pakai `navigator.mediaDevices.getDisplayMedia({video: true, audio: true})`, ambil `stream.getAudioTracks()` saja (buang video track), rekam dengan `MediaRecorder` native. Ini menangkap audio dari tab/aplikasi lain (mis. Zoom/Google Meet yang sedang share screen), BUKAN sekadar mikrofon lokal — port logic ini dari prototipe (`startSystemRecording`/`stopSystemRecording`, termasuk validasi jika user tidak mencentang "share audio" saat dialog browser muncul, dan auto-stop kalau `audioTracks[0]` mengirim event `ended`).

Untuk live progress (waveform + timer + live transcript berjalan seperti di `rekam.png`): kirim audio dalam **chunk periodik** (mis. tiap 10-15 detik) ke endpoint Laravel selama rekaman berlangsung, bukan menunggu rekaman selesai baru upload semua — supaya `Live Transcript` bisa terisi progresif dan waveform (`AnalyserNode` dari Web Audio API) menampilkan level audio real, bukan animasi statis. Simpan tiap chunk sebagai baris `meeting_transcripts` terpisah (`sequence_order` berurutan, `is_live: true`) sampai rekaman berhenti, baru gabungkan jadi transkrip final untuk tahap Koreksi.

---

## 4. Frontend: React + Inertia Pages

Buat halaman di `resources/js/pages/` sesuai konvensi starter kit yang sudah ada (cek pola penamaan file yang sudah dipakai starter kit, ikuti persis). Setiap halaman **HARUS** cocok dengan mockup: label Bahasa Indonesia sama persis, urutan field sama, warna badge status sama (hijau=hadir/selesai/aktif, kuning=terlambat/pending, merah=tidak hadir/live/hapus, biru=terjadwal/info).

**Soal styling — sumber kebenaran visual adalah 11 gambar mockup, BUKAN `style.css` dari prototipe.** Jangan port CSS variables prototipe (`--bg: #f5f4f0` krem, font `Plus Jakarta Sans`, ikon Tabler). Pakai design token yang sudah ada di starter kit (Tailwind config + shadcn/ui theme) dan sesuaikan ke palet yang terlihat di gambar: background utama putih/abu sangat terang, card putih dengan border tipis, biru sebagai warna aksen utama (tombol primer, link, badge info), hijau untuk status positif/sukses, kuning/oranye untuk warning/pending, merah untuk danger/live/hapus. Ikon pakai `lucide-react` (sudah tersedia di starter kit) — cari padanan visual dari ikon Tabler yang dipakai prototipe (mis. `speakerphone`→`Megaphone`, `layout-dashboard`→`LayoutDashboard`, `calendar-event`→`CalendarDays`), jangan install `@tabler/icons`.

### Auth
- `auth/register.tsx` — form: Nama Lengkap, Email, Username (opsional), Password (dgn toggle show/hide via ikon mata), Konfirmasi Password. Link "Masuk di sini" ke halaman login.
- `auth/login.tsx` — Email, Password (toggle visibility), checkbox "Ingat saya", link "Lupa password?" ke reset, tombol "Masuk"
- `auth/forgot-password.tsx` — Email saja, tombol "Kirim Link Reset", link "← Kembali ke login"

Semua 3 halaman auth pakai layout terpusat (card putih di tengah, logo megaphone biru eNotulen, background abu muda) — **cek apakah starter kit sudah punya `AuthLayout` yang cocok, styling-nya tinggal disesuaikan warna/logo, jangan bikin layout baru dari nol.**

### Dashboard (`dashboard.tsx`)
4 stat card di atas (Rapat bulan ini, Notulen selesai, Action item terbuka, Rata-rata kehadiran) dengan ikon berwarna + delta persentase hijau. Section "Rapat terbaru" (list dengan badge status Live/Selesai/Review). Section "Action items mendesak" (list dengan color-coded left border: merah/kuning/abu berdasar urgency, PIC, deadline). Section "Jadwal mendatang" (3 card horizontal).

### Jadwal Rapat (`meetings/index.tsx`)
Tabel dengan search bar, dropdown filter status, date picker filter bulan, tombol "Filter". Kolom: No, Judul Rapat, Tanggal, Waktu, Ruangan, Peserta, Status (badge warna sesuai status), Aksi (ikon edit biru + hapus merah). Pagination di bawah. Tombol "+ Buat Rapat" di kanan atas.

### Buat Rapat (`meetings/create.tsx`)
Form 2 kolom: Judul Rapat*, Deskripsi (textarea), Tanggal* (date picker), Waktu Mulai*/Waktu Selesai* (time picker) + Durasi (auto-computed read-only), Ruangan/Lokasi*, Tipe Rapat (dropdown). Section "Peserta Rapat*" — **dual list box**: kiri daftar semua user dengan checkbox + search, kanan "Peserta Terpilih" dengan counter, tombol panah `>` `<` untuk pindah antar list. Textarea "Catatan Tambahan" di bawah. Footer: Batal / Simpan Rapat.

### Workflow Rapat — Stepper Layout (dipakai di 5 halaman: Humas Rekam, Koreksi Transkrip, Absensi, Review, Pimpinan)
Buat **shared component** `<MeetingStepper currentStage={n} stages={[...]} />` — horizontal stepper 7 langkah (Login, Buat Rapat, Humas Rekam, Koreksi Transkrip, Absensi, Review, Pimpinan) dengan checkmark hijau untuk selesai, lingkaran biru terisi untuk current, lingkaran abu untuk belum. Reuse di semua halaman workflow — **jangan duplikasi kode stepper di tiap halaman.**

Card "Informasi Rapat" (judul, tanggal, waktu, ruangan, peserta terdaftar, tombol "Lihat Detail Rapat") juga **shared component**, dipakai di semua halaman workflow.

#### Humas Rekam (`meetings/recording.tsx`)
3 kolom atas: Informasi Rapat | Status Meeting (badge LIVE merah + durasi timer berjalan + nama operator) | Koneksi OpenAI API (status terkoneksi, model, request/menit, sisa kuota, tombol "Uji Koneksi" — panggil real health-check endpoint).
3 kolom bawah: Upload Rekaman (drag-drop zone) | Rekam dari Sistem (timer besar + waveform visual + tombol Stop/Pause — **implementasikan waveform real** pakai `Web Audio API` `AnalyserNode`, bukan animasi statis) | Progress Transkripsi (progress bar % real dari job queue + estimasi waktu + Live Transcript scrollable list dengan timestamp).

#### Koreksi Transkrip
Halaman belum ada di mockup terlampir — buat halaman dengan list transcript per baris (timestamp + text), tiap baris bisa diedit inline (klik → jadi textarea → simpan), riwayat asli vs koreksi disimpan (`meeting_transcript_corrections`). Tombol "Selesai Koreksi" → lanjut ke Absensi.

#### Absensi (`meetings/attendance.tsx`)
Card Informasi Rapat | Ringkasan Absensi (3 angka besar + donut chart pakai **Recharts**, breakdown Hadir/Terlambat/Tidak Hadir dgn persentase) | Metode Absensi (QR Code — generate & tampilkan QR asli yang encode meeting_id + token, tombol "Tampilkan QR Code"; Manual — tombol "Input Manual" buka modal/drawer form pilih user + status). Tabel peserta: No, Nama, Departemen, Jabatan, Status (badge), Waktu Absen, Metode, Aksi (hapus). Search + filter status + filter departemen. Sidebar kanan: "Peserta Tidak Hadir" list + textarea Catatan. Tombol "Simpan Absensi".

#### Review Notulen (`meetings/review.tsx`)
Card kiri: Informasi Rapat, Ringkasan Otomatis AI (4 angka: Topik/Keputusan/Tindak Lanjut/Durasi), Dokumen Pendukung (list file dgn ikon per tipe + size + "Lihat Semua Dokumen"). Tengah: "Notulen Rapat" dengan tombol Edit Notulen + Unduh, isi terstruktur numbered (Pembukaan, Pembahasan, Keputusan, Tindak Lanjut dengan checkbox hijau + deadline). Kanan: Peserta Rapat (breakdown persentase), Informasi Review (siapa+kapan+status+catatan), box kuning "Langkah Selanjutnya". Tombol "Kirim ke Pimpinan" di kanan atas.

#### Persetujuan Pimpinan (`meetings/approval.tsx`)
Mirip Review tapi read-only + section "Persetujuan Pimpinan": box hijau info, textarea Catatan (opsional, counter 0/500 karakter — **implementasikan counter real**), 2 tombol: "Tolak & Kembalikan" (merah, outline) dan "Setuju Notulen" (hijau, solid). Footer info: Dibuat oleh, Tanggal Review, Versi.

### Configuration / RBAC (`configuration/*.tsx`) — 6 halaman
1. **Dashboard config** (`index.tsx`) — 6 card grid (Users, Roles, Permissions, Menus, Role Permissions, User Permissions) masing-masing dengan ikon, count, tombol panah →
2. **Users** (`users/index.tsx`) — tabel: No, Name, Email, Role (badge warna per role), Status, Aksi (view/edit/delete icons). Tombol "+ Add User".
3. **Create/Edit User** (`users/create.tsx`, `users/edit.tsx`) — kiri form data (Nama, Email, Username, Password+Konfirmasi utk create / read-only info utk edit, Status dropdown), kanan "Pilih Role" dropdown + deskripsi role otomatis muncul + "Diberikan oleh"/"Diberikan pada" (utk edit).
4. **Roles** (`roles/index.tsx`) — tabel: No, Nama Role, Deskripsi, Jumlah User, Aksi (icon assign-user/edit/delete). Tombol "+ Add Role".
5. **Create Role** (`roles/create.tsx`) — Nama Role, Guard Name (default "web"), Deskripsi, panel kanan ringkasan (Jumlah Permission, Jumlah User, Dibuat oleh, Dibuat pada).
6. **Permissions** (`permissions/index.tsx`) — tabel: No, Permission (format `modul.aksi`), Grup/Modul, Deskripsi, Aksi. Tombol "+ Add Permission".
7. **Menus** (`menus/index.tsx`) — tabel: No, Nama Menu, Route/URL, Icon, Urutan, Status toggle, Aksi. Tombol "+ Add Menu".
8. **Role Permissions** (`role-permissions/index.tsx`) — dropdown "Pilih Role" di atas, lalu grouped checkbox list per modul (Dashboard, Rapat, dst — collapsible section), setiap permission punya checkbox + label + deskripsi kecil. Tombol "Simpan Perubahan".
9. **User Permissions** — sama seperti Role Permissions tapi target langsung ke user individual (override permission di luar role-nya).

Sidebar kiri config punya section terpisah "CONFIGURATION" (Users, Roles, Permissions, Menus, Role Permissions, User Permissions) di bawah menu utama — **generate menu ini dinamis dari tabel `menus` + permission user yang login**, JANGAN hardcode array menu di komponen React.

### Layout & komponen bersama
- Header: logo eNotulen (ikon megaphone biru rounded), nama app, kanan: toggle theme (ikon sun/moon — cek apakah starter kit sudah ada dark mode, jika ada REUSE), badge inisial user (2 huruf, background hijau muda), nama+role user, dropdown chevron.
- Sidebar kiri: menu utama (Dashboard, Jadwal Rapat, Koreksi Transkrip, Absensi, Notulen, Laporan), footer sidebar: avatar+nama+role user, "Ganti akun".
- Semua tabel: pagination component reusable, badge status component reusable (terima `status` + `variant map` sebagai prop, jangan hardcode warna per halaman).
- Gunakan **Recharts** untuk semua chart (donut Absensi). Cek dulu apakah sudah terpasang di starter kit; jika belum, tambahkan.

---

## 5. Seeders (WAJIB — supaya bisa langsung didemo)

Buat `DatabaseSeeder` yang menjalankan:
1. `RolesAndPermissionsSeeder` — buat role: **Super Admin** (semua permission tanpa kecuali, termasuk `role.*`/`permission.*`/`menu.*`), **Administrator** (semua permission modul bisnis — dashboard, meeting, recording, transcript, attendance, minute, report, DAN `user.*` — TAPI TANPA `role.*`/`permission.*`/`menu.*`/`role_permission.*`/`user_permission.*`, sesuai batasan di Section 1), **Bag. Umum** (kelola rapat, absensi, notulen, laporan), **Bag. Humas** (operator rekam+absensi), **Pimpinan** (review+approve saja), **Viewer** (read-only notulen). Buat permission set lengkap per modul (dashboard, meeting, recording, transcript, attendance, minute, report, user, role, permission, menu) x (read, create, update, delete) sesuai kebutuhan masing-masing.
2. `MenuSeeder` — isi tabel `menus` sesuai sidebar (Dashboard, Jadwal Rapat, Koreksi Transkrip, Absensi, Notulen, Laporan, + submenu Configuration).
3. `UserSeeder` — buat user contoh sesuai nama-nama di mockup: Budi Wibowo (Direksi/Direktur Utama, role Pimpinan), Siti Rahayu (Keuangan/Manager Keuangan), Andi Pratama (Marketing/Manager Marketing), Rina Kartika (Product/Product Manager), Dimas Aditama (Operasional/Manager Operasional), Admin Utama (IT Support, role **Super Admin** — persis seperti di gambar `role.png` tabel Users baris ke-5), dan user login utama **Bag. Umum** (initials "BU", role Bag. Umum, ini yang dipakai di semua screenshot sebagai user aktif). Tambahkan juga satu user contoh baru **di luar mockup** dengan role **Administrator** (mis. nama "Andini Putri", initials "AP", department "IT Admin") supaya role ini bisa langsung didemo dan dibedakan perilakunya dari Super Admin saat login (Administrator harus TIDAK bisa melihat/masuk ke panel Roles/Permissions/Menus/Role Permissions/User Permissions di Configuration, sementara Super Admin bisa).
4. `MeetingSeeder` — buat rapat "Review Strategi Q3 2026" (4 Juni 2026, 09:00-11:00, Rapat A - Lantai 3, 12 peserta) sebagai rapat lengkap contoh berstatus "Berlangsung" dengan semua data terkait (transcript, attendance 10 hadir/1 terlambat/1 tidak hadir, minutes dengan 4 tindak lanjut persis seperti di gambar `pimpinan.png`), plus beberapa rapat lain dengan status bervariasi (Selesai, Terjadwal) sesuai daftar di `jadwal.png`.

---

## 6. Testing & Verifikasi (jalankan sendiri sebelum menyerahkan hasil)

Setelah kode ditulis, WAJIB jalankan urutan ini dan laporkan hasilnya — jangan asumsikan berhasil tanpa dicoba:

```bash
docker compose up -d
docker compose exec app php artisan migrate:fresh --seed
docker compose exec app php artisan test          # jika ada test suite starter kit
npm run build                                       # pastikan tidak ada TypeScript error
docker compose exec app php artisan route:list | grep meeting   # verifikasi route ke-generate
```

Buka browser ke `localhost` (port sesuai starter kit), login pakai user seeded, **navigasi manual seluruh alur**: register → login → dashboard → buat rapat → jalankan rekaman asli dari mikrofon browser → cek transkrip live muncul → koreksi transkrip → isi absensi (scan QR pakai HP atau input manual) → review notulen (klik generate AI summary, cek beneran manggil OpenAI dan bukan data dummy) → kirim ke pimpinan → login sebagai Pimpinan → approve.

Verifikasi khusus RBAC: login sebagai **Administrator**, cek sidebar Configuration hanya menampilkan panel **Users** (Roles/Permissions/Menus/Role Permissions/User Permissions harus tersembunyi atau menghasilkan 403 kalau diakses lewat URL langsung). Lalu login sebagai **Super Admin**, pastikan sidebar Configuration menampilkan **semua 6 panel**. Kalau Administrator ternyata bisa akses salah satu dari 5 panel yang dibatasi, itu bug — perbaiki middleware/policy-nya sebelum lanjut.

Jika OpenAI API key belum diisi user, **jangan biarkan fitur transkripsi/summary silently gagal** — tampilkan error jelas di UI ("API key belum dikonfigurasi") supaya user tahu harus isi `.env`.

Laporkan di akhir: apa yang sudah teruji jalan, apa yang butuh OpenAI key asli untuk ditest lebih lanjut, dan langkah setup yang harus dilakukan user (isi `.env`, `docker compose up`, dst).
