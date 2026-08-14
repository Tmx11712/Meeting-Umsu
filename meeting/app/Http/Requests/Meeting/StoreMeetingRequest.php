<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMeetingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Set to true assuming middleware or policy already handled it.
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
            'title' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:50',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'location' => 'nullable|string|max:255',
            'participants' => 'nullable|array',
            'participants.*' => 'exists:users,id',
            'agenda' => 'nullable|array',
            'agenda.*' => 'string|max:255',
            'auto_record' => 'nullable|boolean',
        ];
    }
}
