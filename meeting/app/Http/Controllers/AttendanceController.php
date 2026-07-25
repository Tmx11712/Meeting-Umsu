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
    public function show(Meeting $meeting)
    {
        $meeting->load('participants.user', 'attendances.user');
        
        return Inertia::render('meetings/attendance', [
            'meeting' => $meeting
        ]);
    }

    public function generateQrCode(Meeting $meeting)
    {
        abort_unless(auth()->user()->hasRole(['Bag. Umum', 'Bag. Humas', 'Super Admin', 'Administrator']), 403, 'Akses Terbatas.');

        $url = route('meetings.attendance.scan', ['meeting' => $meeting->id]);
        $qrCode = QrCode::size(300)->generate($url);
        
        return response()->json(['qr_code' => base64_encode($qrCode)]);
    }

    public function storeManual(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->hasRole(['Bag. Umum', 'Bag. Humas', 'Super Admin', 'Administrator']), 403, 'Akses Terbatas.');

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
        abort_unless(auth()->user()->hasRole(['Bag. Umum', 'Bag. Humas', 'Super Admin', 'Administrator']), 403, 'Akses Terbatas.');

        $meeting->update(['current_stage' => 5]); // Move to Review
        return redirect()->route('meetings.review', $meeting->id);
    }
}
