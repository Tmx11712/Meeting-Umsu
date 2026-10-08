<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class ScanAttendanceApiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'nullable|exists:users,id',
            'email' => 'nullable|email',
            'guest_name' => 'nullable|string|max:255',
            'guest_institution' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:255',
        ];
    }

    /**
     * Pastikan minimal ada 1 identitas peserta yang dikirim.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (! $this->user() && empty($this->user_id) && empty($this->email) && empty($this->guest_name)) {
                $validator->errors()->add('identity', 'Identitas peserta (user_id, email, atau guest_name) wajib disertakan.');
            }
        });
    }
}
