<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreManualMeetingApiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation, supporting both standard format
     * and Irvan Cloud format (name, event_date, etc.).
     */
    protected function prepareForValidation(): void
    {
        $data = $this->all();

        // Support wrapping in {"data": { ... }}
        if (isset($data['data']) && is_array($data['data'])) {
            $data = array_merge($data, $data['data']);
        }

        // Support 'name' as alias for 'title' (Irvan Cloud format)
        if (isset($data['name']) && empty($data['title'])) {
            $data['title'] = $data['name'];
        }

        // Support 'event_date' as alias for 'date' (Irvan Cloud format)
        if (isset($data['event_date']) && empty($data['date'])) {
            $data['date'] = $data['event_date'];
        }

        // Default start_time and end_time if null (like Irvan Cloud sends null)
        if (empty($data['start_time'])) {
            $data['start_time'] = '08:00';
        } else {
            // Trim seconds if sent in H:i:s
            $data['start_time'] = substr($data['start_time'], 0, 5);
        }

        if (empty($data['end_time'])) {
            $data['end_time'] = '10:00';
        } else {
            // Trim seconds if sent in H:i:s
            $data['end_time'] = substr($data['end_time'], 0, 5);
        }

        if (empty($data['location'])) {
            $data['location'] = 'Ruang Rapat';
        }

        if (empty($data['type'])) {
            $data['type'] = 'offline';
        }

        $this->replace($data);
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
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'event_date' => 'nullable|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'location' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:50',
            'uuid' => 'nullable|string|max:255',
            'external_id' => 'nullable|string|max:255',
            'recording_path' => 'nullable|string|max:500',
            'agenda' => 'nullable|array',
            'agenda.*' => 'string|max:255',
            'participants' => 'nullable|array',
            'created_by' => 'nullable|exists:users,id',
        ];
    }
}
