<?php

namespace App\Actions\Meetings;

use App\Models\Meeting;
use App\Models\MeetingAttendance;
use App\Models\MeetingParticipant;
use App\Models\User;
use Carbon\Carbon;

/**
 * [EDUKASI ARSITEKTUR: ELOQUENT PIVOT]
 * Action ini khusus mengurus tabel pivot (relasi Many-to-Many antara Rapat dan Peserta).
 * Karena satu peserta bisa ikut banyak rapat, dan satu rapat punya banyak peserta, 
 * maka logika penyambungannya (sync) dipisahkan ke sini agar tidak mengotori logika pembuatan Rapat.
 */
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
        /**
         * [EDUKASI ARSITEKTUR: FIRST OR CREATE]
         * Metode firstOrCreate sangat tangguh. Ia akan mengecek apakah data sudah ada di database.
         * Jika belum ada, baru ia melakukan INSERT. Ini mencegah duplikasi data (Duplicate Entry Error).
         */
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
