<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * =========================================================================
 * EDUKASI ARSITEKTUR: FormRequest (Validasi Upload File & Otorisasi)
 * =========================================================================
 * FormRequest ini khusus menangani kompleksitas saat pengguna mengunggah (upload)
 * file audio/rekaman ke dalam server.
 * 
 * Mengapa logika ini dipisah dari Controller?
 * 1. MENCEGAH FILE BERBAHAYA: Bayangkan jika pengguna iseng mengunggah virus 
 *    atau file .exe yang disamarkan. Validasi 'mimes' di bawah ini menjadi
 *    filter keamanan (satpam) pertama sebelum file tersebut membebani server
 *    atau disimpan ke MinIO/S3.
 * 2. MENCEGAH SERVER OVERLOAD: Aturan 'max:204800' membatasi file maksimal 
 *    200MB. Jika file terlalu besar, Laravel akan menolaknya di pintu depan
 *    tanpa menghabiskan RAM server.
 * =========================================================================
 */
class StoreRecordingRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna saat ini diizinkan melakukan aksi ini.
     * Menggunakan sistem Role-Based Access Control (RBAC) Laravel.
     */
    public function authorize(): bool
    {
        return $this->user()->can('recording.create');
    }

    /**
     * Tentukan aturan validasi untuk request ini.
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Validasi ketat untuk file audio:
            // - required: File tidak boleh kosong.
            // - file: Harus benar-benar berupa file (bukan teks/array).
            // - mimes: Ekstensi harus mp3, wav, m4a, webm, atau ogg.
            // - max: Ukuran maksimal 204.800 KB (200 Megabyte).
            'file' => 'required|file|mimes:mp3,wav,m4a,webm,ogg|max:204800',
            
            // Mencegah data 'source' abal-abal dari Hacker.
            // Hacker tidak bisa mengirim source="hack", karena dibatasi 'in:upload,system_record'.
            'source' => 'required|in:upload,system_record',
            
            // Keterangan/label file, tidak wajib diisi (nullable), maksimal 255 karakter.
            'label' => 'nullable|string|max:255',
            
            // Durasi rekaman (opsional), jika ada harus berupa angka bulat (integer).
            'duration_seconds' => 'nullable|integer',
        ];
    }

    /**
     * Custom pesan error jika otorisasi gagal.
     * Jika $this->user()->can('recording.create') mengembalikan false,
     * sistem akan melempar error 403 Forbidden dengan pesan jelas berbahasa Indonesia.
     */
    protected function failedAuthorization(): void
    {
        abort(403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengunggah rekaman.');
    }
}
