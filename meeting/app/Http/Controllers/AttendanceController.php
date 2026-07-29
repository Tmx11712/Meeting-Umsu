<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingAttendance;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        // Stage 4 = Absensi
        $query = Meeting::where('current_stage', 4);
        
        if ($request->search) {
            $query->where('title', 'ilike', '%' . $request->search . '%');
        }
        
        $meetings = $query->orderBy('date', 'desc')->paginate(10);
        
        return Inertia::render('meetings/attendances-index', [
            'meetings' => $meetings,
            'filters' => $request->only(['search'])
        ]);
    }
    public function show(Meeting $meeting)
    {
        $meeting->load('participants.user', 'attendances.user');
        
        return Inertia::render('meetings/attendance', [
            'meeting' => $meeting
        ]);
    }

    public function generateQrCode(Meeting $meeting)
    {
        abort_unless(auth()->user()->can('attendance.create'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengelola absensi.');

        $url = route('meetings.attendance.scan', ['meeting' => $meeting->id]);
        $qrCode = QrCode::size(300)->generate($url);
        
        return response()->json(['qr_code' => base64_encode($qrCode)]);
    }

    public function storeManual(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->can('attendance.create'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk menyimpan absensi.');

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'status' => 'required|in:hadir,terlambat,tidak_hadir',
            'notes' => 'nullable|string'
        ]);

        MeetingAttendance::updateOrCreate(
            [
                'meeting_id' => $meeting->id,
                'user_id' => $request->user_id
            ],
            [
                'status' => $request->status,
                'check_in_time' => now(),
                'method' => 'manual',
                'recorded_by' => $request->user()->id,
                'notes' => $request->notes
            ]
        );

        return back();
    }

    public function finish(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->can('attendance.update'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk menyelesaikan tahapan absensi.');

        $meeting->update(['current_stage' => 5]); // Move to Review
        return redirect()->route('meetings.review', $meeting->id);
    }

    public function scan(Meeting $meeting)
    {
        $user = auth()->user();

        if (! $user) {
            abort(403, 'Silakan login terlebih dahulu untuk melakukan absensi.');
        }

        // Auto record attendance via QR scan
        MeetingAttendance::updateOrCreate(
            [
                'meeting_id' => $meeting->id,
                'user_id' => $user->id,
            ],
            [
                'status' => 'hadir',
                'check_in_time' => now(),
                'method' => 'qr_code',
                'recorded_by' => $user->id,
            ]
        );

        return Inertia::render('meetings/attendance-scan', [
            'meeting' => $meeting->load('participants.user'),
            'message' => 'Absensi berhasil dicatat. Selamat datang, ' . $user->name . '!',
        ]);
    }
}
