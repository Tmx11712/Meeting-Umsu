<?php

namespace App\Jobs;

use App\Models\Meeting;
use App\Models\MeetingRecording;
use App\Models\MeetingTranscript;
use App\Services\OpenAiTranscriptionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
        if (! $recording) {
            return;
        }

        try {
            $recording->update(['status' => 'transcribing']);

            // Assuming the file is on local storage
            // But Whisper API needs the actual file content/path.
            // We can download it to a temporary local file.
            $fileContent = Storage::disk('local')->get($recording->file_path);
            if (! $fileContent) {
                throw new \Exception('File rekaman tidak ditemukan di storage.');
            }

            $tempPath = sys_get_temp_dir().'/'.basename($recording->file_path);
            file_put_contents($tempPath, $fileContent);

            $result = $transcriptionService->transcribeChunk($tempPath);

            // Clean up temp file
            @unlink($tempPath);

            // Save each segment as a separate transcript with real timestamps
            $segments = $result['segments'] ?? [];
            foreach ($segments as $index => $segment) {
                MeetingTranscript::create([
                    'meeting_id' => $recording->meeting_id,
                    'recording_id' => $recording->id,
                    'timestamp_seconds' => (int) round($segment['start']),
                    'text' => $segment['text'],
                    'is_live' => false,
                    'sequence_order' => $index + 1,
                ]);
            }

            // Update recording with duration info
            $recording->update([
                'status' => 'completed',
                'duration_seconds' => (int) round($result['duration'] ?? 0),
            ]);

            // Update meeting stage to Koreksi (stage 3) — it stays here until manual advance
            $meeting = Meeting::find($recording->meeting_id);
            if ($meeting && $meeting->current_stage < 3) {
                $meeting->update(['current_stage' => 3]);
            }

            // Broadcast via WebSocket can be added here if Reverb is used.
        } catch (\Exception $e) {
            Log::error('TranscribeAudioJob Error: '.$e->getMessage());
            $recording->update(['status' => 'failed']);

            throw $e; // Trigger retry
        }
    }
}
