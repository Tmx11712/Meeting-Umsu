<?php

namespace App\Jobs;

use App\Enums\MeetingRecordingStatus;
use App\Events\MeetingUpdated;
use App\Models\Meeting;
use App\Models\MeetingRecording;
use App\Models\MeetingTranscript;
use App\Services\OpenAiTranscriptionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Client\RequestException;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TranscribeAudioJob implements ShouldQueue
{
    /**
     * [EDUKASI ARSITEKTUR: BACKGROUND JOBS (QUEUE)]
     * Implementasi `ShouldQueue` menandakan bahwa perintah dalam file ini (transkripsi AI yang memakan waktu lama)
     * tidak akan dieksekusi secara sinkron yang membuat browser "hang" menunggu.
     * Alih-alih, ia akan dimasukkan ke "Antrean" (Queue), dan dieksekusi di belakang layar (background) oleh worker.
     */
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public $backoff = [10, 30, 60];

    protected string $recordingId;

    public function __construct(string $recordingId)
    {
        $this->recordingId = $recordingId;
    }

    public function handle(OpenAiTranscriptionService $transcriptionService): void
    {
        /** @var MeetingRecording|null $recording */
        $recording = MeetingRecording::find($this->recordingId, ['*']);
        if (! $recording) {
            return;
        }

        try {
            $recording->status = MeetingRecordingStatus::TRANSCRIBING->value;
            $recording->save();

            // Assuming the file is on local storage
            // But Whisper API needs the actual file content/path.
            // We can download it to a temporary local file.
            $fileContent = Storage::disk('local')->get($recording->file_path);
            if (! $fileContent) {
                throw new \RuntimeException('File rekaman tidak ditemukan di storage.');
            }

            $tempPath = sys_get_temp_dir() . '/' . basename($recording->file_path);
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
            $recording->status = MeetingRecordingStatus::COMPLETED->value;
            $recording->duration_seconds = (int) round($result['duration'] ?? 0);
            $recording->save();

            // Update meeting stage to Koreksi (stage 3) — it stays here until manual advance
            /** @var Meeting|null $meeting */
            $meeting = Meeting::find($recording->meeting_id, ['*']);
            if ($meeting && $meeting->current_stage < 3) {
                $meeting->current_stage = 3;
                $meeting->save();
            }

            if ($meeting) {
                try {
                    event(new MeetingUpdated($meeting, 'transcript_ready'));
                } catch (\Exception $broadcastEx) {
                    Log::error('Broadcast failed: ' . $broadcastEx->getMessage());
                }
            }
        } catch (RequestException $e) {
            Log::error('Transcribe API Network Error: ' . $e->getMessage());
            $this->failJob($recording, 'Terjadi kesalahan jaringan saat menghubungi API.');
        } catch (\RuntimeException $e) {
            Log::error('Transcribe Runtime Error: ' . $e->getMessage());
            $this->failJob($recording, $e->getMessage());
        } catch (\Throwable $e) {
            Log::error('Transcribe System Error: ' . $e->getMessage());
            $this->failJob($recording, 'Terjadi kesalahan sistem internal.');
            throw $e; // Re-throw critical system errors (like syntax errors) to be caught by the queue worker properly
        }
    }

    protected function failJob(MeetingRecording $recording, string $reason)
    {
        $recording->status = MeetingRecordingStatus::FAILED->value;
        $recording->save();

        /** @var Meeting|null $meeting */
        $meeting = Meeting::find($recording->meeting_id, ['*']);
        if ($meeting) {
            try {
                event(new MeetingUpdated($meeting, 'transcript_failed'));
            } catch (\Exception $broadcastEx) {
                Log::error('Broadcast failed: ' . $broadcastEx->getMessage());
            }
        }
    }
}
