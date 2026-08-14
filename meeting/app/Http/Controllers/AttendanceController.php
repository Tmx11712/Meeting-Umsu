<?php

namespace App\Http\Controllers;

use App\Events\MeetingUpdated;
use App\Http\Requests\Meeting\StoreManualAttendanceRequest;
use App\Models\Meeting;
use App\Models\MeetingAttendance;
use App\Services\IrvanCloudSyncService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        // Stage >= 4 (Sedang atau sudah lewat tahap absensi)
        $query = Meeting::where('current_stage', '>=', 4);

        if ($request->search) {
            $query->where('title', 'ilike', '%'.$request->search.'%');
        }

        $meetings = $query->orderBy('date', 'desc')->paginate(10);

        return Inertia::render('meetings/attendances-index', [
            'meetings' => $meetings,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Meeting $meeting)
    {
        $meeting->load('participants.user', 'attendances.user');

        return Inertia::render('meetings/attendance', [
            'meeting' => $meeting,
        ]);
    }

    public function generateQrCode(Meeting $meeting)
    {
        abort_unless(auth()->user()->can('attendance.create'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengelola absensi.');

        $url = route('meetings.attendance.scan', ['meeting' => $meeting->id]);
        $qrCode = QrCode::size(300)->generate($url);

        return response()->json(['qr_code' => base64_encode($qrCode)]);
    }

    public function storeManual(StoreManualAttendanceRequest $request, Meeting $meeting)
    {
        if ($request->user_id) {
            // Absensi untuk user terdaftar (karyawan UMSU)
            MeetingAttendance::updateOrCreate(
                [
                    'meeting_id' => $meeting->id,
                    'user_id' => $request->user_id,
                ],
                [
                    'status' => $request->status,
                    'check_in_time' => now(),
                    'method' => 'manual',
                    'recorded_by' => $request->user()->id,
                    'notes' => $request->notes,
                ]
            );
        } else {
            // Absensi untuk tamu eksternal (bukan karyawan UMSU)
            MeetingAttendance::updateOrCreate(
                [
                    'meeting_id' => $meeting->id,
                    'guest_name' => $request->guest_name,
                    'guest_institution' => $request->guest_institution,
                ],
                [
                    'status' => $request->status,
                    'check_in_time' => now(),
                    'method' => 'manual',
                    'recorded_by' => $request->user()->id,
                    'notes' => $request->notes,
                ]
            );
        }

        safe_broadcast(new MeetingUpdated($meeting, 'attendance'), false);

        return back();
    }

    public function finish(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->can('attendance.update'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk menyelesaikan tahapan absensi.');

        $meeting->update(['current_stage' => 5]); // Move to Review

        safe_broadcast(new MeetingUpdated($meeting, 'stage_changed'), false);

        return redirect()->route('meetings.review', $meeting->id);
    }

    public function scan(Meeting $meeting)
    {
        $user = auth()->user();

        if (! $user) {
            abort(403, 'Silakan login terlebih dahulu untuk melakukan absensi.');
        }

        $now = now();
        $meetingStartTime = Carbon::parse($meeting->date.' '.$meeting->start_time);
        $status = $now->greaterThan($meetingStartTime) ? 'terlambat' : 'hadir';

        // Auto record attendance via QR scan
        MeetingAttendance::updateOrCreate(
            [
                'meeting_id' => $meeting->id,
                'user_id' => $user->id,
            ],
            [
                'status' => $status,
                'check_in_time' => $now,
                'method' => 'qr_code',
                'recorded_by' => $user->id,
            ]
        );

        safe_broadcast(new MeetingUpdated($meeting, 'attendance'), false);

        return Inertia::render('meetings/attendance-scan', [
            'meeting' => $meeting->load('participants.user'),
            'message' => 'Absensi berhasil dicatat. Selamat datang, '.$user->name.'!',
        ]);
    }

    public function syncIrvanCloud(Meeting $meeting, IrvanCloudSyncService $syncService)
    {
        abort_unless(auth()->user()->can('attendance.create') || auth()->user()->can('attendance.update'), 403);

        if ($meeting->source === 'irvan_cloud' && $meeting->external_id) {
            $syncService->syncEventDetails($meeting->external_id, $meeting);
        }

        return response()->json(['success' => true]);
    }
}
