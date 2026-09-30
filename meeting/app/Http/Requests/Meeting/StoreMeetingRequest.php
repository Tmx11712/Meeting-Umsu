<?php

namespace App\Http\Requests\Meeting;

use App\Models\Meeting;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * =========================================================================
 * EDUKASI ARSITEKTUR: FormRequest (Validasi Pembuatan Rapat)
 * =========================================================================
 * FormRequest ini bertanggung jawab penuh untuk menyaring data sebelum
 * Rapat (Meeting) baru disimpan ke dalam database.
 * 
 * Manfaat Arsitektur Ini:
 * 1. KODE BERSIH (CLEAN CODE): Controller (MeetingController) tidak perlu 
 *    lagi menulis puluhan baris kode "if-else" untuk mengecek input.
 * 2. KONSISTENSI DATA: Mencegah data "sampah" atau tidak masuk akal 
 *    (misalnya jam selesai lebih awal dari jam mulai) masuk ke Database.
 * =========================================================================
 */
class StoreMeetingRequest extends FormRequest
{
    /**
     * Mengecek apakah pengguna memiliki izin (Policy) untuk membuat rapat.
     * Menggunakan Laravel Policy `can('create', Meeting::class)`.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Meeting::class);
    }

    /**
     * Aturan validasi (satpam data) untuk request pembuatan rapat.
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Judul rapat wajib diisi, berupa teks, maksimal 255 karakter.
            'title' => 'required|string|max:255',
            
            // Tipe rapat opsional (misal: Rapat Dosen, Rapat Senat).
            'type' => 'nullable|string|max:255',
            
            // Tanggal rapat wajib diisi dan formatnya harus berupa tanggal valid (YYYY-MM-DD).
            'date' => 'required|date',
            
            // Jam mulai wajib diisi, harus sesuai format 24 jam (Contoh: 14:30).
            'start_time' => 'required|date_format:H:i',
            
            // Jam selesai wajib ada, berformat 24 jam, DAN harus LEBIH BESAR (after) dari jam mulai!
            // Ini mencegah *logical bug* di mana rapat selesai sebelum dimulai.
            'end_time' => 'required|date_format:H:i|after:start_time',
            
            // Lokasi rapat (opsional).
            'location' => 'nullable|string|max:255',
            
            // Daftar peserta yang diundang. Harus berupa array (banyak).
            'participants' => 'nullable|array',
            
            // Tanda bintang (*) artinya "Setiap anggota di dalam array peserta".
            // Validasi ini memastikan bahwa ID peserta yang diundang benar-benar terdaftar 
            // di tabel 'users'. (Mencegah pengiriman ID siluman).
            'participants.*' => 'exists:users,id',
            
            // Opsi untuk memulai rekaman otomatis. Harus bernilai true/false (1 atau 0).
            'auto_record' => 'nullable|boolean',
        ];
    }

    /**
     * Pesan error custom jika pengguna tidak lolos pemeriksaan otorisasi (Role/Policy).
     */
    protected function failedAuthorization(): void
    {
        abort(403, 'Akses Terbatas: Anda tidak memiliki izin untuk membuat rapat.');
    }
}
