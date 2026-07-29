<?php

namespace App\Http\Controllers;

use App\Jobs\TranscribeAudioJob;
use App\Models\Meeting;
use App\Models\MeetingRecording;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingRecordingController extends Controller
{
    public function show(Meeting $meeting)
    {
        $meeting->load('recordings', 'participants.user', 'transcripts');

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
        ]);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension() ?: 'mp3';
        $path = $file->storeAs('recordings/'.$meeting->id, uniqid('rec_').'.'.$extension, 'local');

        $recording = $meeting->recordings()->create([
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'source' => $request->source,
            'status' => 'uploaded',
            'recorded_by' => $request->user()->id,
        ]);

        $meeting->update([
            'status' => 'berlangsung',
        ]);

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

        return redirect()->back()->with('success', 'Transkripsi AI sedang diproses. Harap tunggu beberapa saat.');
    }

    public function finishRecording(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->can('recording.update'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk menyelesaikan rekaman.');

        $meeting->update([
            'current_stage' => 3,
            'status' => 'berlangsung',
        ]);

        return redirect()->route('meetings.correction', $meeting->id)
            ->with('success', 'Rekaman selesai. Lanjutkan ke tahap koreksi transkrip.');
    }
}
