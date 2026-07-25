<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingRecording;
use App\Models\MeetingTranscript;
use App\Jobs\TranscribeAudioJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MeetingRecordingController extends Controller
{
    public function show(Meeting $meeting)
    {
        $meeting->load('recordings', 'participants.user', 'transcripts');
        
        return Inertia::render('meetings/recording', [
            'meeting' => $meeting,
            'openAiConfigured' => !empty(config('services.openai.key') ?? env('OPENAI_API_KEY'))
        ]);
    }

    public function store(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->hasRole(['Bag. Humas', 'Super Admin', 'Administrator']), 403, 'Akses Terbatas: Hanya Bagian Humas yang dapat mengakses fitur ini.');

        $request->validate([
            'file' => 'required|file|mimes:mp3,wav,m4a|max:204800', // 200MB max
            'source' => 'required|in:upload,system_record'
        ]);

        $file = $request->file('file');
        $path = $file->store('recordings/' . $meeting->id, 'local');

        $recording = $meeting->recordings()->create([
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'source' => $request->source,
            'status' => 'uploaded',
            'recorded_by' => $request->user()->id,
            'openai_model_used' => env('OPENAI_TRANSCRIBE_MODEL', 'whisper-1')
        ]);

        // Dispatch job for transcription
        TranscribeAudioJob::dispatch($recording->id);

        $meeting->update([
            'status' => 'berlangsung',
            'current_stage' => 3
        ]);

        return response()->json(['recording' => $recording, 'message' => 'Upload berhasil dan sedang ditranskrip.']);
    }

    public function uploadChunk(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->hasRole(['Bag. Humas', 'Super Admin', 'Administrator']), 403, 'Akses Terbatas.');

        $request->validate([
            'file' => 'required|file|mimes:mp3,wav,m4a,webm,ogg',
            'sequence_order' => 'required|integer',
            'recording_id' => 'nullable|exists:meeting_recordings,id'
        ]);

        $recordingId = $request->recording_id;

        if (!$recordingId) {
            $recording = $meeting->recordings()->create([
                'file_path' => 'live_recording_placeholder',
                'file_size' => 0,
                'source' => 'system_record',
                'status' => 'recording',
                'recorded_by' => $request->user()->id,
            ]);
            $recordingId = $recording->id;
            
            $meeting->update([
                'status' => 'berlangsung',
                'current_stage' => 3
            ]);
        }

        // Store chunk temp
        $file = $request->file('file');
        $tempPath = $file->store('temp_chunks');
        
        // Transcribe chunk immediately (in real implementation, queue it for speed)
        try {
            $transcriptionService = new \App\Services\OpenAiTranscriptionService();
            $text = $transcriptionService->transcribeChunk(Storage::path($tempPath));
            
            MeetingTranscript::create([
                'meeting_id' => $meeting->id,
                'recording_id' => $recordingId,
                'timestamp_seconds' => $request->sequence_order * 10, // heuristic
                'text' => $text,
                'is_live' => true,
                'sequence_order' => $request->sequence_order,
            ]);
            
            Storage::delete($tempPath);
            
            return response()->json(['success' => true, 'text' => $text, 'recording_id' => $recordingId]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function finishRecording(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->hasRole(['Bag. Humas', 'Super Admin', 'Administrator']), 403, 'Akses Terbatas.');

        $meeting->update([
            'current_stage' => 4,
            'status' => 'berlangsung' // Maintain as berlangsung or review depending on business logic, here we keep 'berlangsung' until review stage
        ]);

        return redirect()->route('dashboard')->with('success', 'Rekaman selesai, beralih ke tahap koreksi.');
    }
}
