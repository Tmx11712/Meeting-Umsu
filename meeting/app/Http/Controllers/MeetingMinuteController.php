<?php

namespace App\Http\Controllers;

use App\Actions\Meetings\GenerateMeetingMinuteAction;
use App\Enums\MeetingMinuteStatus;
use App\Events\MeetingUpdated;
use App\Http\Requests\Meeting\UpdateMinuteRequest;
use App\Models\Meeting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/**
 * [EDUKASI ARSITEKTUR: THIN CONTROLLER]
 * Controller ini dirancang agar sangat "Tipis" (Thin). Ia tidak berisi logika bisnis yang rumit.
 * Tugas Controller HANYA: menerima Request dari user, mendelegasikannya ke Action Class, dan mengembalikan Response.
 */
class MeetingMinuteController extends Controller
{
    public function index(Request $request)
    {
        // Stage 5, 6, 7 = Review / Notulen, Persetujuan, Selesai
        $query = Meeting::whereIn('current_stage', [4, 5, 6, 7]);

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
            'attendances.user',
            'recordings' => function ($q) {
                $q->orderBy('created_at', 'asc');
            },
            'recordings.transcripts' => function ($q) {
                $q->orderBy('sequence_order', 'asc');
            },
            'recordings.transcripts.corrections',
        ]);

        return Inertia::render('meetings/review', [
            'meeting' => $meeting,
        ]);
    }

    /**
     * [EDUKASI ARSITEKTUR: DEPENDENCY INJECTION]
     * Perhatikan parameter GenerateMeetingMinuteAction $action.
     * Laravel secara otomatis membuatkan (instantiate) class Action tersebut untuk kita.
     * Kita tinggal memanggil `$action->execute($meeting)`. Sangat rapi dan profesional!
     */
    public function generateAiSummary(Request $request, Meeting $meeting, GenerateMeetingMinuteAction $action)
    {
        abort_unless(auth()->user()->can('minute.create'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengenerate ringkasan.');

        try {
            $action->execute($meeting);

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
            DB::transaction(function () use ($minute, $meeting, $request) {
                $minute->update([
                    'status' => MeetingMinuteStatus::MENUNGGU_PERSETUJUAN->value,
                    'reviewed_by' => $request->user()->id,
                    'reviewed_at' => now(),
                ]);

                $meeting->update([
                    'current_stage' => 6,
                ]);
            });

            try {
                event(new MeetingUpdated($meeting, 'stage_changed'));
            } catch (\Exception $e) {
            }
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
