<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingTranscriptCorrection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TranscriptCorrectionController extends Controller
{
    public function show(Meeting $meeting)
    {
        $meeting->load('recordings', 'transcripts.corrections', 'participants.user');
        
        return Inertia::render('meetings/correction', [
            'meeting' => $meeting
        ]);
    }

    public function store(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->hasRole(['Bag. Umum', 'Super Admin', 'Administrator']), 403, 'Akses Terbatas.');

        $request->validate([
            'transcript_id' => 'required|exists:meeting_transcripts,id',
            'original_text' => 'required|string',
            'corrected_text' => 'required|string'
        ]);

        MeetingTranscriptCorrection::updateOrCreate(
            ['transcript_id' => $request->transcript_id],
            [
                'original_text' => $request->original_text,
                'corrected_text' => $request->corrected_text,
                'corrected_by' => $request->user()->id
            ]
        );

        return back();
    }

    public function finish(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->hasRole(['Bag. Umum', 'Super Admin', 'Administrator']), 403, 'Akses Terbatas.');

        $meeting->update(['current_stage' => 4]); // Move to Absensi
        return redirect()->route('meetings.attendance', $meeting->id);
    }
}
