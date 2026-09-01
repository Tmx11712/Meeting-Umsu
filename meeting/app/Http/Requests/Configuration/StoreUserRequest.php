<?php

namespace App\Http\Requests\Configuration;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Protected by EnsureConfigAccess middleware
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
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
            'status' => 'required|in:aktif,nonaktif',
        ];
    }
}
