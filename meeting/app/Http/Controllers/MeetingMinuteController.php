<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingActionItem;
use App\Models\MeetingMinute;
use App\Services\OpenAiTranscriptionService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingMinuteController extends Controller
{
    public function index(Request $request)
    {
        // Stage 5 = Review / Notulen
        $query = Meeting::where('current_stage', 5);

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
        $meeting->load('participants.user', 'minutes.actionItems', 'documents', 'attendances');

        return Inertia::render('meetings/review', [
            'meeting' => $meeting,
        ]);
    }

    public function generateAiSummary(Request $request, Meeting $meeting, OpenAiTranscriptionService $aiService)
    {
        abort_unless(auth()->user()->can('minute.create'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengenerate ringkasan.');

        // 1. Ambil transkrip yang dikoreksi (atau asli jika belum dikoreksi)
        $transcripts = $meeting->transcripts()->with('corrections')->orderBy('sequence_order')->get();
        $transcriptText = '';
        foreach ($transcripts as $t) {
            $text = $t->corrections->count() > 0 ? $t->corrections->last()->corrected_text : $t->text;
            $transcriptText .= $text.' ';
        }

        if (empty(trim($transcriptText))) {
            return response()->json(['error' => 'Transkrip kosong. Harap rekam atau upload audio.'], 400);
        }

        // 2. Generate Summary using AI
        try {
            $summaryJson = $aiService->generateSummary($meeting, $transcriptText);

            // 3. Save to MeetingMinute
            $minute = MeetingMinute::updateOrCreate(
                ['meeting_id' => $meeting->id],
                [
                    'content' => collect($summaryJson)->except(['topik_count', 'keputusan_count'])->toArray(),
                    'ai_topics_count' => $summaryJson['topik_count'] ?? 0,
                    'ai_decisions_count' => $summaryJson['keputusan_count'] ?? 0,
                    'ai_summary_generated_at' => now(),
                    'status' => 'review',
                ]
            );

            // 4. Create Action Items from AI output
            if (! empty($summaryJson['tindak_lanjut'])) {
                $minute->actionItems()->delete(); // reset old action items
                foreach ($summaryJson['tindak_lanjut'] as $actionItem) {
                    MeetingActionItem::create([
                        'meeting_id' => $meeting->id,
                        'minute_id' => $minute->id,
                        'description' => $actionItem['description'] ?? '-',
                        'pic' => $actionItem['pic'] ?? '-',
                        'deadline' => isset($actionItem['deadline']) ? date('Y-m-d', strtotime($actionItem['deadline'])) : null,
                    ]);
                }
            }

            return back()->with('success', 'Ringkasan berhasil digenerate oleh AI.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
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
        }

        return redirect()->route('dashboard')->with('success', 'Notulen dikirim ke pimpinan.');
    }

    public function downloadPdf(Meeting $meeting)
    {
        $meeting->load('minutes.actionItems', 'participants.user');

        // Very basic PDF view render, we would need a resources/views/pdf/notulen.blade.php
        $pdf = Pdf::loadView('pdf.notulen', compact('meeting'));

        return $pdf->download('Notulen_'.$meeting->title.'.pdf');
    }
}
