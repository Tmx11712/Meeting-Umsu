<?php

namespace App\Services;

use App\Models\Meeting;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class MeetingActionItemService
{
    /**
     * Update action items for a specific meeting minute.
     *
     * @param Meeting $meeting
     * @param array $actionItems
     * @return void
     */
    public function updateForMeeting(Meeting $meeting, array $actionItems): void
    {
        $minute = $meeting->minutes()->latest()->firstOrFail();

        DB::transaction(function () use ($meeting, $minute, $actionItems) {
            // Delete existing action items
            $minute->actionItems()->delete();

            // Insert the new action items
            foreach ($actionItems as $item) {
                if (empty(trim($item['description']))) {
                    continue; // Skip empty descriptions
                }
                
                $minute->actionItems()->create([
                    'meeting_id' => $meeting->id,
                    'description' => trim($item['description']),
                    'pic' => trim($item['pic'] ?? '-'),
                    'deadline' => !empty($item['deadline']) ? Carbon::parse($item['deadline'])->format('Y-m-d') : null,
                    'status' => 'pending',
                ]);
            }
        });
    }
}
