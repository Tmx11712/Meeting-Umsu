<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMeetingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $meeting = $this->route('meeting');

        return $this->user()->can('update', $meeting);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'location' => 'required|string|max:255',
            'type' => 'required|string',
            'category' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'participants' => 'nullable|array',
            'participants.*' => 'exists:users,id',
            'agenda' => 'nullable|array',
            'agenda.*' => 'string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'end_time.after' => 'Waktu selesai harus setelah waktu mulai.',
            'participants.required' => 'Peserta rapat wajib diisi.',
        ];
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization(): void
    {
        abort(403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengelola rapat.');
    }
}
