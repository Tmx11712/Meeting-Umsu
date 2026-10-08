<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * =========================================================================
 * EDUKASI ARSITEKTUR: FormRequest (Otorisasi Tindakan Pimpinan)
 * =========================================================================
 * Request ini khusus untuk mengamankan proses "Persetujuan (Approval) Notulen".
 *
 * Perhatikan pada method authorize():
 * Ini adalah contoh sempurna bagaimana kita melindungi fitur krusial.
 * Meskipun seorang mahasiswa/peserta biasa berhasil menebak URL persetujuan
 * (atau mencoba "hacking" lewat Postman/API), Laravel akan langsung menendang
 * mereka di pintu depan karena mereka tidak memiliki Role 'Pimpinan'.
 * =========================================================================
 */
class StoreApprovalRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna saat ini diizinkan melakukan aksi ini.
     * HANYA pengguna dengan role Pimpinan, Super Admin, atau Administrator
     * yang bisa lolos dari penjagaan ini.
     */
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['Pimpinan', 'Super Admin', 'Administrator']);
    }

    /**
     * Tentukan aturan validasi untuk request ini.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Mencegah nilai abal-abal. Keputusan HANYA boleh bernilai
            // "approved" (disetujui) atau "rejected" (ditolak).
            'decision' => 'required|in:approved,rejected',

            // Catatan persetujuan/penolakan bersifat opsional,
            // namun dibatasi maksimal 500 karakter agar database tidak penuh.
            'notes' => 'nullable|string|max:500',
        ];
    }

    /**
     * Jika `authorize()` mengembalikan false, tampilkan pesan ini.
     */
    protected function failedAuthorization(): void
    {
        abort(403, 'Akses Terbatas: Hanya Pimpinan yang dapat memberikan keputusan persetujuan.');
    }
}
