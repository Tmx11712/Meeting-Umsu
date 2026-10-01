<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * =========================================================================
 * EDUKASI ARSITEKTUR: FormRequest (Validasi & Otorisasi Terpusat)
 * =========================================================================
 * Mengapa kita membuat file Request khusus (TranscribeRecordingRequest)?
 *
 * 1. SEPARATION OF CONCERNS (Pemisahan Tugas):
 *    Controller tidak boleh dipenuhi dengan logika "if-else" untuk mengecek
 *    hak akses atau validasi input. Controller harus fokus pada "Apa yang
 *    harus dilakukan" (misal: jalankan transkripsi).
 *
 * 2. KEAMANAN LAYER PERTAMA (First Line of Defense):
 *    Sebelum request masuk ke Controller, Laravel akan mencegatnya di sini.
 *    Jika otorisasi (authorize) gagal, atau validasi (rules) gagal,
 *    Laravel langsung menolak request tersebut dan tidak akan pernah
 *    sampai ke Controller. Ini mencegah eksploitasi keamanan.
 * =========================================================================
 */
class TranscribeRecordingRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna saat ini diizinkan untuk membuat request ini.
     * Di sini kita mengecek apakah role pengguna memiliki izin (permission) 'recording.create'.
     */
    public function authorize(): bool
    {
        return $this->user()->can('recording.create');
    }

    /**
     * Tentukan aturan validasi yang berlaku untuk request ini.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Memastikan bahwa input 'recording_id' wajib ada (required)
            // dan ID tersebut benar-benar ada di tabel 'meeting_recordings' (exists).
            // Ini mencegah serangan IDOR (Bypass manipulasi ID).
            'recording_id' => 'required|exists:meeting_recordings,id',
        ];
    }

    /**
     * Custom pesan error jika otorisasi gagal.
     * Jika $this->user()->can('recording.create') mengembalikan false,
     * sistem akan melempar error 403 Forbidden dengan pesan di bawah ini.
     */
    protected function failedAuthorization(): void
    {
        abort(403, 'Akses Terbatas: Anda tidak memiliki izin untuk mentranskripsi rekaman.');
    }
}
