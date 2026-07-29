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
        abort_unless(auth()->user()->can('recording.create'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengunggah rekaman.');

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
        abort_unless(auth()->user()->can('recording.create'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengunggah rekaman.');

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
            $result = $transcriptionService->transcribeChunk(Storage::path($tempPath));
            
            // Calculate time offset based on existing transcripts for this recording
            $lastTranscript = MeetingTranscript::where('recording_id', $recordingId)
                ->orderBy('timestamp_seconds', 'desc')
                ->first();
            $timeOffset = $lastTranscript ? $lastTranscript->timestamp_seconds : 0;
            // Use the sequence_order * chunk_duration as a better offset estimate
            $chunkOffset = ($request->sequence_order - 1) * 10; // each chunk is ~10 seconds
            $baseOffset = max($timeOffset, $chunkOffset);

            $segments = $result['segments'] ?? [];
            $lastText = '';
            
            foreach ($segments as $index => $segment) {
                $timestampSeconds = (int) round($baseOffset + ($segment['start'] ?? 0));
                MeetingTranscript::create([
                    'meeting_id' => $meeting->id,
                    'recording_id' => $recordingId,
                    'timestamp_seconds' => $timestampSeconds,
                    'text' => $segment['text'],
                    'is_live' => true,
                    'sequence_order' => ($request->sequence_order * 100) + $index,
                ]);
                $lastText .= $segment['text'] . ' ';
            }
            
            Storage::delete($tempPath);
            
            return response()->json([
                'success' => true, 
                'text' => trim($lastText), 
                'recording_id' => $recordingId,
                'duration' => $result['duration'] ?? 0,
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
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
