<?php

namespace App\Http\Controllers;

use App\Http\Requests\Meeting\UpdateMinuteRequest;
use App\Models\Meeting;
use App\Models\MeetingActionItem;
use App\Models\MeetingMinute;
use App\Events\MeetingUpdated;
use App\Services\MeetingMinuteGenerationService;
use App\Services\OpenAiTranscriptionService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingMinuteController extends Controller
{
    public function index(Request $request)
    {
        // Stage 5, 6, 7 = Review / Notulen, Persetujuan, Selesai
        $query = Meeting::whereIn('current_stage', [5, 6, 7]);

        if ($request->search) {
            $query->where('title', 'ilike', '%'.$request->search.'%');
        }

        $meetings = $query->orderBy('date', 'desc')->paginate(10);

        return Inertia::render('meetings/minutes-index', [
            'meetings' => $meetings,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Meeting $meeting)
    {
        $meeting->load([
            'participants.user', 
            'minutes.actionItems', 
            'documents', 
            'attendances',
            'recordings' => function ($q) {
                $q->orderBy('created_at', 'asc');
            },
            'recordings.transcripts' => function ($q) {
                $q->orderBy('sequence_order', 'asc');
            },
            'recordings.transcripts.corrections'
        ]);

        return Inertia::render('meetings/review', [
            'meeting' => $meeting,
        ]);
    }

    public function generateAiSummary(Request $request, Meeting $meeting, MeetingMinuteGenerationService $service)
    {
        abort_unless(auth()->user()->can('minute.create'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengenerate ringkasan.');

        try {
            $service->generate($meeting);

            return back()->with('success', 'Ringkasan berhasil digenerate oleh AI.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(UpdateMinuteRequest $request, Meeting $meeting)
    {
        $minute = $meeting->minutes()->latest()->first();
        if ($minute) {
            $minute->update([
                'content' => $request->content,
            ]);
            return back()->with('success', 'Notulen berhasil diperbarui.');
        }
        
        return back()->with('error', 'Notulen belum tersedia.');
    }

    public function sendToPimpinan(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->can('minute.update'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengirim ke pimpinan.');

        $minute = $meeting->minutes()->latest()->first();
        if ($minute) {
            $minute->update([
                'status' => 'menunggu_persetujuan',
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
            ]);
            $meeting->update(['current_stage' => 6]); // Move to Pimpinan
            try {
                event(new MeetingUpdated($meeting, 'stage_changed'));
            } catch (\Exception $e) {}
        }

        return redirect()->route('meetings.approval', $meeting->id)->with('success', 'Notulen dikirim ke pimpinan.');
    }

    public function downloadPdf(Meeting $meeting)
    {
        $meeting->load('minutes.actionItems', 'participants.user');

        // Very basic PDF view render, we would need a resources/views/pdf/notulen.blade.php
        $pdf = Pdf::loadView('pdf.notulen', compact('meeting'));

        return $pdf->download('Notulen_'.$meeting->title.'.pdf');
    }
}
