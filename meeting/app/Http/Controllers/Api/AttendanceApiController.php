<?php

namespace App\Http\Controllers\Api;

use App\Events\MeetingUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ScanAttendanceApiRequest;
use App\Http\Resources\AttendanceResource;
use App\Models\Meeting;
use App\Models\MeetingAttendance;
use App\Models\MeetingParticipant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class AttendanceApiController extends Controller
{
    /**
     * Mengambil daftar dan rekap kehadiran rapat (GET /api/meetings/{meeting}/attendance).
     */
    public function index(Meeting $meeting): JsonResponse
    {
        $attendances = $meeting->attendances()->with('user')->orderBy('check_in_time', 'desc')->get();

        $registeredCount = $meeting->participants()->count('*');
        $guestCount = $attendances->whereNull('user_id')->count();
        $totalParticipants = $registeredCount + $guestCount;

        $hadir = $attendances->where('status', 'hadir')->count();
        $terlambat = $attendances->where('status', 'terlambat')->count();
        $tidakHadir = max(0, $totalParticipants - $hadir - $terlambat);

        $attendanceRate = $totalParticipants > 0
            ? round((($hadir + $terlambat) / $totalParticipants) * 100, 1)
            : 0;

        return response()->json([
            'statusCode' => 200,
            'success' => true,
            'message' => 'The attendance data was retrieved successfully.',
            'summary' => [
                'total_participants' => $totalParticipants,
                'hadir' => $hadir,
                'terlambat' => $terlambat,
                'tidak_hadir' => $tidakHadir,
                'attendance_rate' => $attendanceRate,
            ],
            'data' => AttendanceResource::collection($attendances),
        ]);
    }

    /**
     * Mencatat kehadiran hasil scan QR via HP / API (POST /api/meetings/{meeting}/attendance/scan).
     */
    public function scan(ScanAttendanceApiRequest $request, Meeting $meeting): JsonResponse
    {
        // 1. Identifikasi peserta
        $user = $request->user();

        if (! $user && $request->user_id) {
            $user = User::query()->where('id', '=', $request->user_id, 'and')->first();
        }

        if (! $user && $request->email) {
            $user = User::query()->where('email', '=', $request->email, 'and')->first();
        }

        // 2. Tentukan status kehadiran (hadir atau terlambat)
        $now = now();
        $meetingStartTime = Carbon::parse($meeting->date.' '.$meeting->start_time);
        $status = $now->greaterThan($meetingStartTime) ? 'terlambat' : 'hadir';

        // 3. Simpan absensi
        if ($user) {
            // Pastikan terdaftar di tabel peserta rapat
            MeetingParticipant::query()->firstOrCreate([
                'meeting_id' => $meeting->id,
                'user_id' => $user->id,
            ]);

            $attendance = MeetingAttendance::query()->updateOrCreate(
                [
                    'meeting_id' => $meeting->id,
                    'user_id' => $user->id,
                ],
                [
                    'status' => $status,
                    'check_in_time' => $now,
                    'method' => 'qr_code',
                    'recorded_by' => $user->id,
                    'notes' => $request->notes,
                ]
            );

            $displayName = $user->name;
        } else {
            // Tamu eksternal
            $attendance = MeetingAttendance::query()->updateOrCreate(
                [
                    'meeting_id' => $meeting->id,
                    'guest_name' => $request->guest_name,
                    'guest_institution' => $request->guest_institution,
                ],
                [
                    'guest_email' => $request->email,
                    'status' => $status,
                    'check_in_time' => $now,
                    'method' => 'qr_code',
                    'recorded_by' => null,
                    'notes' => $request->notes,
                ]
            );

            $displayName = $request->guest_name;
        }

        // 4. Trigger WebSocket Broadcast ke layar proyektor / dashboard host
        safe_broadcast(new MeetingUpdated($meeting, 'attendance'), false);

        return response()->json([
            'statusCode' => 200,
            'success' => true,
            'message' => 'Absensi berhasil dicatat. Selamat datang, '.$displayName.'!',
            'data' => new AttendanceResource($attendance->load('user')),
        ]);
    }
}
