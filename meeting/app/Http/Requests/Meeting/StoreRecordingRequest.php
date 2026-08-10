<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecordingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('recording.create');
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file' => 'required|file|mimes:mp3,wav,m4a,webm,ogg|max:204800',
            'source' => 'required|in:upload,system_record',
            'label' => 'nullable|string|max:255',
            'duration_seconds' => 'nullable|integer',
        ];
    }

    protected function failedAuthorization(): void
    {
        abort(403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengunggah rekaman.');
    }
}
