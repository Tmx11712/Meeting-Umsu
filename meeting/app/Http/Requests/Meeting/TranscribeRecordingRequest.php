<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Foundation\Http\FormRequest;

class TranscribeRecordingRequest extends FormRequest
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
            'recording_id' => 'required|exists:meeting_recordings,id',
        ];
    }

    protected function failedAuthorization(): void
    {
        abort(403, 'Akses Terbatas: Anda tidak memiliki izin untuk mentranskripsi rekaman.');
    }
}
