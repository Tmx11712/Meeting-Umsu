<?php

namespace App\Http\Controllers;

use App\Http\Requests\Meeting\StoreRecordingRequest;
use App\Http\Requests\Meeting\TranscribeRecordingRequest;
use App\Jobs\TranscribeAudioJob;
use App\Models\Meeting;
use App\Models\MeetingRecording;
use Illuminate\Http\Request;
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

        $recording = $meeting->recordings()->create([
            'file_path' => $path,
            'label' => $request->label,
            'file_size' => $file->getSize(),
            'duration_seconds' => $request->duration_seconds ?? 0,
            'source' => $request->source,
            'status' => 'uploaded',
            'recorded_by' => $request->user()->id,
        ]);

        $meeting->update([
            'status' => 'berlangsung',
        ]);

        safe_broadcast(new \App\Events\MeetingUpdated($meeting, 'recording_started'));

        return response()->json(['recording' => $recording, 'message' => 'File audio berhasil disimpan.']);
    }

    public function destroy(Meeting $meeting, $recordingId)
    {
        abort_unless(auth()->user()->can('recording.create'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk menghapus rekaman.');

        $recording = MeetingRecording::findOrFail($recordingId);

        if (Storage::disk('local')->exists($recording->file_path)) {
            Storage::disk('local')->delete($recording->file_path);
        }

        $recording->delete();

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

        $meeting->update([
            'current_stage' => max($meeting->current_stage, 3),
        ]);

        safe_broadcast(new \App\Events\MeetingUpdated($meeting, 'transcription_started'));

        return redirect()->back()->with('success', 'Transkripsi AI sedang diproses. Harap tunggu beberapa saat.');
    }

    public function finishRecording(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->can('recording.update'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk menyelesaikan rekaman.');

        $meeting->update([
            'current_stage' => 3,
            'status' => 'berlangsung',
        ]);

        safe_broadcast(new \App\Events\MeetingUpdated($meeting, 'stage_changed'));

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
        abort_unless(auth()->user()->can('recording.create'), 403, 'Akses Terbatas');

        $meeting->update([
            'recording_started_at' => now(),
            'status' => 'berlangsung',
        ]);

        safe_broadcast(new \App\Events\MeetingUpdated($meeting, 'recording_session_started'));

        return response()->json(['message' => 'Recording session started']);
    }

    public function stopSession(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->can('recording.create'), 403, 'Akses Terbatas');

        $meeting->update([
            'recording_started_at' => null,
        ]);

        safe_broadcast(new \App\Events\MeetingUpdated($meeting, 'recording_session_stopped'));

        return response()->json(['message' => 'Recording session stopped']);
    }
}
