<?php

namespace App\Http\Controllers;

use App\Enums\MeetingRecordingStatus;
use App\Enums\MeetingStatus;
use App\Events\MeetingUpdated;
use App\Http\Requests\Meeting\StoreRecordingRequest;
use App\Http\Requests\Meeting\TranscribeRecordingRequest;
use App\Jobs\TranscribeAudioJob;
use App\Models\Meeting;
use App\Models\MeetingRecording;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MeetingRecordingController extends Controller
{
    public function show(Meeting $meeting)
    {
        $meeting->load(['recordings' => function ($q) {
            $q->orderBy('created_at', 'asc');
        }, 'recordings.transcripts' => function ($q) {
            $q->orderBy('sequence_order', 'asc');
        }, 'participants.user']);

        return Inertia::render('meetings/recording', [
            'meeting' => $meeting,
            'openAiConfigured' => ! empty(config('services.openai.key')),
        ]);
    }

    public function store(StoreRecordingRequest $request, Meeting $meeting)
    {
        $file = $request->file('file');
        $path = $file->store('recordings/'.$meeting->id, 'local');

        try {
            /**
             * [EDUKASI ARSITEKTUR: DATABASE TRANSACTIONS]
             * DB::transaction digunakan untuk memastikan data aman.
             * Jika proses insert `recordings` berhasil, tetapi update `meetings` gagal karena error,
             * seluruh operasi database di dalam blok ini akan dibatalkan (ROLLBACK).
             * Ini mencegah adanya rekaman "yatim piatu" tanpa merubah status rapat.
             */
            $recording = DB::transaction(function () use ($meeting, $request, $path, $file) {
                $recording = $meeting->recordings()->create([
                    'file_path' => $path,
                    'label' => $request->label,
                    'file_size' => $file->getSize(),
                    'duration_seconds' => $request->duration_seconds ?? 0,
                    'source' => $request->source,
                    'status' => MeetingRecordingStatus::UPLOADED->value,
                    'recorded_by' => $request->user()->id,
                ]);

                $meeting->status = MeetingStatus::BERLANGSUNG->value;
                $meeting->save();

                return $recording;
            });
        } catch (\Exception $e) {
            Storage::disk('local')->delete($path);
            throw $e;
        }

        safe_broadcast(new MeetingUpdated($meeting, 'recording_started'));

        return response()->json(['recording' => $recording, 'message' => 'File audio berhasil disimpan.']);
    }

    public function destroy(Meeting $meeting, string $recordingId)
    {
        abort_unless(request()->user()->can('recording.create'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk menghapus rekaman.');

        $recording = MeetingRecording::findOrFail($recordingId);

        if (Storage::disk('local')->exists($recording->file_path)) {
            Storage::disk('local')->delete($recording->file_path);
        }

        $recording->delete();

        safe_broadcast(new MeetingUpdated($meeting, 'recording_deleted'));

        return redirect()->back()->with('success', 'Rekaman berhasil dihapus.');
    }

    /**
     * Trigger AI transcription for a specific recording (manual action by user)
     */
    public function transcribe(TranscribeRecordingRequest $request, Meeting $meeting)
    {
        $recording = MeetingRecording::findOrFail($request->recording_id);

        // Don't re-transcribe if already done
        if ($recording->status === 'transcribed') {
            return redirect()->back()->with('info', 'Rekaman ini sudah pernah ditranskripsi.');
        }

        $recording->update([
            'status' => 'transcribing',
            'openai_model_used' => config('services.openai.transcribe_model'),
        ]);

        // Dispatch job for transcription
        TranscribeAudioJob::dispatch($recording->id);

        $meeting->current_stage = max($meeting->current_stage, 3);
        $meeting->save();

        safe_broadcast(new MeetingUpdated($meeting, 'transcription_started'));

        return redirect()->back()->with('success', 'Transkripsi AI sedang diproses. Harap tunggu beberapa saat.');
    }

    public function finishRecording(Request $request, Meeting $meeting)
    {
        abort_unless(request()->user()->can('recording.update'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk menyelesaikan rekaman.');

        // Otomatis jalankan transkripsi untuk semua rekaman yang masih berstatus 'uploaded'
        $untranscribedRecordings = $meeting->recordings()->where('status', 'uploaded')->get();
        $transcriptionStarted = false;

        foreach ($untranscribedRecordings as $recording) {
            $recording->fill([
                'status' => 'transcribing',
                'openai_model_used' => config('services.openai.transcribe_model'),
            ])->save();

            TranscribeAudioJob::dispatch($recording->id);
            $transcriptionStarted = true;
        }

        $meeting->fill([
            'current_stage' => 3,
            'status' => 'berlangsung',
        ])->save();

        if ($transcriptionStarted) {
            safe_broadcast(new MeetingUpdated($meeting, 'transcription_started'));
        }
        safe_broadcast(new MeetingUpdated($meeting, 'stage_changed'));

        return redirect()->route('meetings.correction', $meeting->id)
            ->with('success', 'Rekaman selesai. Lanjutkan ke tahap koreksi transkrip.');
    }

    /**
     * Stream audio file to browser for inline playback
     */
    public function stream(Meeting $meeting, MeetingRecording $recording)
    {
        abort_unless($recording->meeting_id === $meeting->id, 404, 'Rekaman tidak ditemukan untuk rapat ini.');

        $path = Storage::disk('local')->path($recording->file_path);

        abort_unless(file_exists($path), 404, 'File audio tidak ditemukan.');

        $mimeTypes = [
            'mp3' => 'audio/mpeg',
            'wav' => 'audio/wav',
            'm4a' => 'audio/mp4',
            'webm' => 'audio/webm',
            'ogg' => 'audio/ogg',
        ];

        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';

        return response()->file($path, [
            'Content-Type' => $mimeType,
            'Accept-Ranges' => 'bytes',
        ]);
    }

    public function startSession(Request $request, Meeting $meeting)
    {
        abort_unless(request()->user()->can('recording.create'), 403, 'Akses Terbatas');

        $meeting->recording_started_at = now();
        $meeting->status = 'berlangsung';
        $meeting->save();

        safe_broadcast(new MeetingUpdated($meeting, 'recording_session_started'));

        return response()->json(['message' => 'Recording session started']);
    }

    public function stopSession(Request $request, Meeting $meeting)
    {
        abort_unless(request()->user()->can('recording.create'), 403, 'Akses Terbatas');

        $meeting->recording_started_at = null;
        $meeting->save();

        safe_broadcast(new MeetingUpdated($meeting, 'recording_session_stopped'));

        return response()->json(['message' => 'Recording session stopped']);
    }
}
