<?php

namespace App\Http\Controllers;

use App\Events\MeetingUpdated;
use App\Models\Meeting;
use App\Models\MeetingAttendance;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * [EDUKASI ARSITEKTUR: PUBLIC ROUTE (Akses Tanpa Login)]
 * Controller ini menangani halaman absensi yang BISA DIAKSES SIAPA SAJA tanpa perlu login.
 *
 * Halaman ini muncul ketika peserta membuka URL dari QR Code yang di-scan.
 * Karena tamu/peserta belum tentu punya akun, route ini dikecualikan dari middleware `auth`.
 * Peserta cukup mengisi nama dan email mereka, sistem otomatis mencatat kehadiran.
 *
 * Ini adalah titik masuk paling krusial untuk fitur absensi real-time.
 */
class PublicAttendanceController extends Controller
{
    private function getAttendanceAvailability(Meeting $meeting): array
    {
        if ($meeting->status === 'dibatalkan') {
            return [
                'isOpen' => false,
                'reason' => 'Rapat ini telah dibatalkan.',
            ];
        }

        if ($meeting->status === 'selesai' || $meeting->current_stage >= 5) {
            return [
                'isOpen' => false,
                'reason' => 'Sesi absensi untuk rapat ini telah resmi ditutup.',
            ];
        }

        if ($meeting->date > now()->toDateString() && $meeting->status === 'terjadwal' && $meeting->current_stage < 2) {
            return [
                'isOpen' => false,
                'reason' => 'Sesi absensi belum dibuka. Absensi dibuka pada hari pelaksanaan rapat.',
            ];
        }

        return [
            'isOpen' => true,
            'reason' => null,
        ];
    }

    public function show(Meeting $meeting)
    {
        $availability = $this->getAttendanceAvailability($meeting);

        return Inertia::render('meetings/public-attendance', [
            'meeting' => [
                'id' => $meeting->id,
                'title' => $meeting->title,
                'date' => $meeting->date,
                'start_time' => $meeting->start_time,
                'end_time' => $meeting->end_time,
                'location' => $meeting->location,
                'status' => $meeting->status,
                'current_stage' => $meeting->current_stage,
            ],
            'isOpen' => $availability['isOpen'],
            'closedReason' => $availability['reason'],
        ]);
    }

    public function store(Request $request, Meeting $meeting)
    {
        $availability = $this->getAttendanceAvailability($meeting);

        if (! $availability['isOpen']) {
            return back()->with('error', $availability['reason'])->withErrors([
                'guest_name' => $availability['reason'],
            ]);
        }

        $validated = $request->validate([
            'guest_name' => 'required|string|max:255',
            'guest_unit_kerja' => 'required|string|max:255',
            'guest_email' => 'nullable|email|max:255',
            'guest_institution' => 'required|string|max:255',
        ]);

        $name = trim(strip_tags($validated['guest_name']));
        $unitKerja = trim(strip_tags($validated['guest_unit_kerja']));
        $institution = trim(strip_tags($validated['guest_institution']));
        $email = ! empty($validated['guest_email']) ? strtolower(trim($validated['guest_email'])) : null;

        // Check if this guest already submitted attendance based on name and institution
        $existing = MeetingAttendance::query()->where('meeting_id', '=', $meeting->id)
            ->where('guest_name', '=', $name)
            ->where('guest_institution', '=', $institution)
            ->first();

        if ($existing) {
            return back()->with('success', 'Anda sudah melakukan absensi sebelumnya.');
        }

        MeetingAttendance::create([
            'meeting_id' => $meeting->id,
            'guest_name' => $name,
            'guest_email' => $email,
            'guest_unit_kerja' => $unitKerja,
            'guest_institution' => $institution,
            'status' => 'hadir',
            'method' => 'qr_code',
            'check_in_time' => now(),
        ]);

        // Broadcast event agar layar admin/notulis langsung ter-update otomatis
        safe_broadcast(new MeetingUpdated($meeting, 'attendance'), false);

        return back()->with('success', 'Absensi berhasil dicatat. Terima kasih!');
    }
}
