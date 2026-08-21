<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Meeting;
use App\Models\MeetingAttendance;
use Inertia\Inertia;

class PublicAttendanceController extends Controller
{
    public function show(Meeting $meeting)
    {
        return Inertia::render('meetings/public-attendance', [
            'meeting' => [
                'id' => $meeting->id,
                'title' => $meeting->title,
                'date' => $meeting->date,
                'start_time' => $meeting->start_time,
                'end_time' => $meeting->end_time,
                'location' => $meeting->location,
                'status' => $meeting->status,
            ]
        ]);
    }

    public function store(Request $request, Meeting $meeting)
    {
        $request->validate([
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'nullable|email|max:255',
            'guest_institution' => 'required|string|max:255',
        ]);

        // Check if this guest already submitted attendance based on name and institution
        $existing = MeetingAttendance::query()->where('meeting_id', $meeting->id)
            ->where('guest_name', $request->guest_name)
            ->where('guest_institution', $request->guest_institution)
            ->first();

        if ($existing) {
            return back()->with('success', 'Anda sudah melakukan absensi sebelumnya.');
        }

        MeetingAttendance::create([
            'meeting_id' => $meeting->id,
            'guest_name' => $request->guest_name,
            'guest_email' => $request->guest_email,
            'guest_institution' => $request->guest_institution,
            'status' => 'hadir',
            'method' => 'qr_code',
            'check_in_time' => now(),
        ]);

        // Broadcast event agar layar admin/notulis langsung ter-update otomatis
        safe_broadcast(new \App\Events\MeetingUpdated($meeting, 'attendance'), false);

        return back()->with('success', 'Absensi berhasil dicatat. Terima kasih!');
    }
}
