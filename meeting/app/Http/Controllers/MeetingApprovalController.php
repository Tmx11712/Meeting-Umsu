<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingApproval;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingApprovalController extends Controller
{
    public function show(Meeting $meeting)
    {
        $meeting->load('minutes.actionItems', 'participants.user', 'documents');

        return Inertia::render('meetings/approval', [
            'meeting' => $meeting,
        ]);
    }

    public function store(Request $request, Meeting $meeting)
    {
        abort_unless(
            auth()->user()->hasAnyRole(['Pimpinan', 'Super Admin', 'Administrator']),
            403,
            'Akses Terbatas: Hanya Pimpinan yang dapat memberikan keputusan.'
        );

        $request->validate([
            'decision' => 'required|in:approved,rejected',
            'notes' => 'nullable|string|max:500',
        ]);

        $minute = $meeting->minutes()->latest()->firstOrFail();

        MeetingApproval::create([
            'meeting_id' => $meeting->id,
            'minute_id' => $minute->id,
            'approved_by' => $request->user()->id,
            'decision' => $request->decision,
            'notes' => $request->notes,
            'decided_at' => now(),
        ]);

        $minute->update(['status' => $request->decision === 'approved' ? 'disetujui' : 'ditolak']);
        if ($request->decision === 'approved') {
            $meeting->update([
                'status' => 'selesai',
                'current_stage' => 7,
            ]);
        }

        return redirect()->route('dashboard')->with('success', 'Keputusan notulen berhasil disimpan.');
    }
}
