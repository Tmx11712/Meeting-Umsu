<?php

namespace App\Actions\Meetings;

use App\Models\Meeting;
use App\Models\MeetingAttendance;
use App\Models\MeetingParticipant;
use App\Models\User;
use Carbon\Carbon;

class SyncMeetingAttendanceAction
{
    /**
     * Ensure the user is a participant and record their attendance if available.
     *
     * @param array $participantData
     * @param Meeting $meeting
     * @param User $user
     * @return void
     */
    public function execute(array $participantData, Meeting $meeting, User $user): void
    {
        // 1. Add as Meeting Participant
        MeetingParticipant::firstOrCreate([
            'meeting_id' => $meeting->id,
            'user_id' => $user->id,
        ]);

        // 2. Update Attendance if scanned (scanned_at is present)
        if (! empty($participantData['scanned_at'])) {
            // Try to parse the scanned_at time. API returns ISO8601
            $checkInTime = Carbon::parse($participantData['scanned_at'])->setTimezone(config('app.timezone'));
            $checkOutTime = !empty($participantData['scanned_out_at']) ? Carbon::parse($participantData['scanned_out_at'])->setTimezone(config('app.timezone')) : null;

            MeetingAttendance::updateOrCreate(
                [
                    'meeting_id' => $meeting->id,
                    'user_id' => $user->id,
                ],
                [
                    'status' => 'hadir',
                    'check_in_time' => $checkInTime,
                    'check_out_time' => $checkOutTime,
                    'method' => 'irvan_cloud_app',
                    'recorded_by' => null,
                ]
            );
        } else {
            // Ensure an attendance record exists with status tidak_hadir if they are a participant but haven't scanned yet
            MeetingAttendance::firstOrCreate(
                [
                    'meeting_id' => $meeting->id,
                    'user_id' => $user->id,
                ],
                [
                    'status' => 'tidak_hadir',
                    'method' => 'irvan_cloud_app',
                ]
            );
        }
    }
}
