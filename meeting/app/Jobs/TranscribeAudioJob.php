<?php

namespace App\Jobs;

use App\Models\MeetingRecording;
use App\Models\MeetingTranscript;
use App\Services\OpenAiTranscriptionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class TranscribeAudioJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [10, 30, 60];

    protected $recordingId;

    public function __construct(string $recordingId)
    {
        $this->recordingId = $recordingId;
    }

    public function handle(OpenAiTranscriptionService $transcriptionService): void
    {
        $recording = MeetingRecording::find($this->recordingId);
        if (!$recording) {
            return;
        }

        try {
            $recording->update(['status' => 'transcribing']);

            // Assuming the file is on local storage
            // But Whisper API needs the actual file content/path.
            // We can download it to a temporary local file.
            $fileContent = Storage::disk('local')->get($recording->file_path);
            if (!$fileContent) {
                throw new \Exception("File rekaman tidak ditemukan di storage.");
            }

            $tempPath = sys_get_temp_dir() . '/' . basename($recording->file_path);
            file_put_contents($tempPath, $fileContent);

            $text = $transcriptionService->transcribeChunk($tempPath);

            // Clean up temp file
            @unlink($tempPath);

            // Save to transcript
            MeetingTranscript::create([
                'meeting_id' => $recording->meeting_id,
                'recording_id' => $recording->id,
                'timestamp_seconds' => 0,
                'text' => $text,
                'is_live' => false,
                'sequence_order' => 1,
            ]);

            $recording->update(['status' => 'completed']);
            
            // Update meeting stage to Koreksi
            $meeting = \App\Models\Meeting::find($recording->meeting_id);
            if ($meeting && $meeting->current_stage < 4) {
                $meeting->update(['current_stage' => 4]);
            }
            
            // Broadcast via WebSocket can be added here if Reverb is used.
        } catch (\Exception $e) {
            Log::error("TranscribeAudioJob Error: " . $e->getMessage());
            $recording->update(['status' => 'failed']);
            
            throw $e; // Trigger retry
        }
    }
}
