<?php

namespace App\Http\Resources;

use App\Models\MeetingAttendance;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin MeetingAttendance
 */
/**
 * [EDUKASI ARSITEKTUR: ELOQUENT API RESOURCE (Transformer Data Absensi)]
 * Resource ini memformat data absensi sebelum dikirim sebagai JSON ke aplikasi mobile.
 *
 * Field-field sensitif (seperti `id` internal UUID) bisa dikecualikan dari output,
 * sementara kita bisa menambahkan field kalkulasi (computed field) yang tidak ada di tabel,
 * seperti `duration_minutes` dari `check_in_time` dan `check_out_time`.
 * @mixin MeetingAttendance
 */
class AttendanceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'meeting_id' => $this->meeting_id,
            'user_id' => $this->user_id,
            'name' => $this->user?->name ?? $this->guest_name ?? 'Peserta',
            'email' => $this->user?->email ?? $this->guest_email,
            'department' => $this->user?->department ?? $this->guest_institution,
            'status' => $this->status,
            'check_in_time' => $this->check_in_time?->toDateTimeString(),
            'check_out_time' => $this->check_out_time?->toDateTimeString(),
            'method' => $this->method,
            'is_guest' => empty($this->user_id),
            'guest_name' => $this->guest_name,
            'guest_institution' => $this->guest_institution,
            'notes' => $this->notes,
        ];
    }
}
