<?php

namespace App\Http\Requests\Configuration;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Protected by EnsureConfigAccess middleware
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('email')) {
            $this->merge([
                'email' => strtolower(trim((string) $this->input('email'))),
            ]);
        }
    }

    /**
     * [EDUKASI ARSITEKTUR: FORM REQUEST VALIDATION]
     * Inilah tempat berkumpulnya semua aturan wajib (rules) sebelum data masuk ke Controller.
     * Aturan seperti `unique:users,email` secara otomatis akan memeriksa ke database
     * apakah email tersebut sudah dipakai atau belum. Sangat praktis!
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'string', Password::defaults()],
            'role_id' => 'required|uuid|exists:roles,id',
            'status' => 'required|in:aktif,nonaktif',
        ];
    }
}
