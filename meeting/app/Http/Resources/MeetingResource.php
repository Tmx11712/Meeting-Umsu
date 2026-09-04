<?php

namespace App\Http\Resources;

use App\Models\Meeting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Meeting
 */
class MeetingResource extends JsonResource
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
            'uuid' => $this->external_id ?? $this->id,
            'name' => $this->title,
            'title' => $this->title,
            'description' => $this->description,
            'event_date' => $this->date,
            'date' => $this->date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'duration' => $this->duration,
            'duration_formatted' => $this->duration_formatted,
            'location' => $this->location,
            'type' => $this->type,
            'category' => $this->category,
            'status' => $this->status,
            'source' => $this->source,
            'current_stage' => $this->current_stage,
            'agenda' => $this->agenda ?? [],
            'created_by' => $this->whenLoaded('createdBy', function () {
                return [
                    'id' => $this->createdBy?->id,
                    'name' => $this->createdBy?->name,
                    'email' => $this->createdBy?->email,
                ];
            }, $this->created_by),
            'participants' => $this->whenLoaded('participants', function () {
                return $this->participants->map(function ($p) {
                    return [
                        'id' => $p->id,
                        'user_id' => $p->user_id,
                        'email' => $p->user?->email,
                        'fullname' => $p->user?->name,
                        'name' => $p->user?->name,
                        'department' => $p->user?->department,
                        'is_invited' => $p->is_invited,
                    ];
                });
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
