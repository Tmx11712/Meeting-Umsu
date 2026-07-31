<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingTranscriptCorrection;
use App\Events\MeetingUpdated;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TranscriptCorrectionController extends Controller
{
    public function index(Request $request)
    {
        // Stage >= 3 (Sedang atau sudah lewat tahap koreksi)
        $query = Meeting::where('current_stage', '>=', 3);

        if ($request->search) {
            $query->where('title', 'ilike', '%'.$request->search.'%');
        }

        $meetings = $query->orderBy('date', 'desc')->paginate(10);

        return Inertia::render('meetings/transcripts-index', [
            'meetings' => $meetings,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Meeting $meeting)
    {
        $meeting->load([
            'recordings' => function ($q) {
                $q->orderBy('created_at', 'asc');
            },
            'recordings.transcripts' => function ($q) {
                $q->orderBy('sequence_order', 'asc');
            },
            'recordings.transcripts.corrections',
            'participants.user',
        ]);

        return Inertia::render('meetings/correction', [
            'meeting' => $meeting,
        ]);
    }

    public function store(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->can('transcript.update'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengoreksi transkrip.');

        $request->validate([
            'transcript_id' => 'required|exists:meeting_transcripts,id',
            'original_text' => 'required|string',
            'corrected_text' => 'required|string',
        ]);

        MeetingTranscriptCorrection::updateOrCreate(
            ['transcript_id' => $request->transcript_id],
            [
                'original_text' => $request->original_text,
                'corrected_text' => $request->corrected_text,
                'corrected_by' => $request->user()->id,
            ]
        );

        return back();
    }

    public function finish(Request $request, Meeting $meeting)
    {
        $user = auth()->user();
        abort_unless(
            $user->can('transcript.update') || $user->can('recording.update') || $user->hasRole('Pimpinan'),
            403,
            'Akses Terbatas: Anda tidak memiliki izin untuk menyelesaikan koreksi.'
        );

        $meeting->update(['current_stage' => 4]); // Move to Absensi

        // Broadcast event to trigger auto-redirect on frontend
        broadcast(new MeetingUpdated($meeting, 'stage_changed'));

        return redirect()->route('meetings.attendance', $meeting->id);
    }
}
