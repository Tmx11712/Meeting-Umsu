<?php

namespace App\Http\Controllers;

use App\Events\MeetingUpdated;
use App\Http\Requests\Meeting\StoreCorrectionRequest;
use App\Models\Meeting;
use App\Models\MeetingTranscriptCorrection;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * [EDUKASI ARSITEKTUR: TAHAP KOREKSI TRANSKRIP]
 * Controller ini mengelola tahap ke-3 dari alur notulensi: Koreksi Teks Transkrip AI.
 *
 * Setelah AI selesai mentranskrip audio, hasilnya tidak langsung diterima mentah-mentah.
 * Notulis/Admin diberi kesempatan untuk mengoreksi kesalahan transkripsi (nama orang salah ejaan,
 * istilah teknis tidak dikenali AI, dll) melalui halaman yang dikelola controller ini.
 *
 * Setiap koreksi disimpan di tabel `meeting_transcript_corrections` (bukan menimpa teks asli),
 * sehingga perbandingan teks asli AI vs teks terkoreksi selalu bisa dilihat.
 */
class TranscriptCorrectionController extends Controller
{
    public function index(Request $request)
    {
        // Stage >= 3 (Sedang atau sudah lewat tahap koreksi)
        $query = Meeting::query()->where('current_stage', '>=', 3);

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
        $this->authorize('view', $meeting);

        /**
         * [EDUKASI ARSITEKTUR: EAGER LOADING DENGAN CLOSURE]
         * Daripada melakukan `load('recordings')` secara polos, kita bisa menyisipkan fungsi Closure
         * untuk menambahkan filter atau pengurutan (ORDER BY) khusus pada data relasi tersebut.
         * Di sini kita memastikan transkrip yang dimuat sudah urut berdasarkan `sequence_order`.
         */
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

    public function store(StoreCorrectionRequest $request, Meeting $meeting)
    {
        MeetingTranscriptCorrection::query()->updateOrCreate(
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
        $user = $request->user();
        abort_unless(
            $user->can('transcript.update') || $user->can('recording.update') || $user->hasRole('Pimpinan'),
            403,
            'Akses Terbatas: Anda tidak memiliki izin untuk menyelesaikan koreksi.'
        );
        $meeting->current_stage = 5; // Move to Review (skip Absensi)
        $meeting->save();

        safe_broadcast(new MeetingUpdated($meeting, 'stage_changed'), false);

        return redirect()->route('meetings.review', $meeting->id);
    }
}
