<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMinuteRequest extends FormRequest
{
    /**
     * [EDUKASI ARSITEKTUR: AUTHORIZATION DI FORM REQUEST]
     * Selain untuk validasi (rules), Form Request juga bertugas memeriksa izin (Authorization).
     * Jika `authorize()` mengembalikan false, Laravel akan otomatis memblokir aksi ini dengan error 403.
     * Ini memastikan bahwa hanya pengguna dengan izin `minute.update` yang bisa menyimpan perubahan notulen.
     */
    public function authorize(): bool
    {
        return $this->user()->can('minute.update');
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'content' => 'required|array',
        ];
    }

    protected function failedAuthorization(): void
    {
        abort(403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengedit notulen.');
    }
}
