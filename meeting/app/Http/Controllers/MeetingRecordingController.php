<?php

namespace App\Http\Controllers;

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
            'openAiConfigured' => ! empty(config('services.openai.key') ?? env('OPENAI_API_KEY')),
        ]);
    }

    public function store(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->can('recording.create'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengunggah rekaman.');

        $request->validate([
            'file' => 'required|file|mimes:mp3,wav,m4a,webm,ogg|max:204800', // 200MB max
            'source' => 'required|in:upload,system_record',
            'label' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension() ?: 'mp3';
        $path = $file->storeAs('recordings/'.$meeting->id, uniqid('rec_').'.'.$extension, 'local');

        $recording = $meeting->recordings()->create([
            'file_path' => $path,
            'label' => $request->label,
            'file_size' => $file->getSize(),
            'source' => $request->source,
            'status' => 'uploaded',
            'recorded_by' => $request->user()->id,
        ]);

        $meeting->update([
            'status' => 'berlangsung',
        ]);

        event(new \App\Events\MeetingUpdated($meeting, 'recording_started'));

        return response()->json(['recording' => $recording, 'message' => 'File audio berhasil disimpan.']);
    }

    /**
     * Trigger AI transcription for a specific recording (manual action by user)
     */
    public function transcribe(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->can('recording.create'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk mentranskripsi rekaman.');

        $request->validate([
            'recording_id' => 'required|exists:meeting_recordings,id',
        ]);

        $recording = MeetingRecording::findOrFail($request->recording_id);

        // Don't re-transcribe if already done
        if ($recording->status === 'transcribed') {
            return redirect()->back()->with('info', 'Rekaman ini sudah pernah ditranskripsi.');
        }

        $recording->update([
            'status' => 'transcribing',
            'openai_model_used' => env('OPENAI_TRANSCRIBE_MODEL', 'whisper-1'),
        ]);

        // Dispatch job for transcription
        TranscribeAudioJob::dispatch($recording->id);

        $meeting->update([
            'current_stage' => max($meeting->current_stage, 3),
        ]);

        event(new \App\Events\MeetingUpdated($meeting, 'transcription_started'));

        return redirect()->back()->with('success', 'Transkripsi AI sedang diproses. Harap tunggu beberapa saat.');
    }

    public function finishRecording(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->can('recording.update'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk menyelesaikan rekaman.');

        $meeting->update([
            'current_stage' => 3,
            'status' => 'berlangsung',
        ]);

        event(new \App\Events\MeetingUpdated($meeting, 'stage_changed'));

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
}
