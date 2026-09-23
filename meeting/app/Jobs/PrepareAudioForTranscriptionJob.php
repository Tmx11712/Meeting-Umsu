<?php

namespace App\Jobs;

use App\Events\MeetingUpdated;
use App\Models\MeetingRecording;
use App\Models\MeetingTranscriptionChunk;
use App\Services\OpenAiTranscriptionService;
use Illuminate\Bus\Batch;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

class PrepareAudioForTranscriptionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 3600; // 1 jam maksimum untuk preparation

    protected int $recordingId;

    public function __construct(int $recordingId)
    {
        $this->recordingId = $recordingId;
    }

    public function handle(OpenAiTranscriptionService $transcriptionService): void
    {
        $recordingId = $this->recordingId;
        $startTime = microtime(true);
        
        /** @var MeetingRecording|null $recording */
        $recording = MeetingRecording::query()->find($recordingId);

        if (! $recording) {
            Log::error("[PrepareAudio] Recording ID {$recordingId} tidak ditemukan.");

            return;
        }

        $disk = config('filesystems.default');

        if (! Storage::disk($disk)->exists($recording->file_path)) {
            Log::error("[PrepareAudio] File audio tidak ditemukan di MinIO: {$recording->file_path}");
            $recording->fill(['status' => 'failed'])->save();

            return;
        }

        // 1. Download audio asli dari MinIO ke local /tmp
        $localOriginalPath = sys_get_temp_dir().'/'.uniqid('original_').'_'.basename($recording->file_path);
        file_put_contents($localOriginalPath, Storage::disk($disk)->get($recording->file_path));

        $downloadTime = microtime(true) - $startTime;
        Log::info("[PrepareAudio] Download audio selesai: {$downloadTime} sec");

        // 2. Gunakan Service untuk mengekstrak durasi
        $duration = $transcriptionService->getAudioDuration($localOriginalPath);
        $threshold = (int) config('services.openai.transcription_concurrent_threshold', 1200); // default 20 mins

        // Jika durasi di bawah threshold, kita gunakan job legacy untuk menghemat resource Redis/batching
        if ($duration < $threshold) {
            Log::info("[PrepareAudio] Durasi audio {$duration} sec < threshold {$threshold} sec. Fallback ke TranscribeAudioJob (Legacy).");
            @unlink($localOriginalPath);
            TranscribeAudioJob::dispatch($recording->id);

            return;
        }

        // 3. Split dengan overlap
        $chunkDuration = (int) config('services.openai.transcription_chunk_duration', 900);
        $chunkOverlap = (int) config('services.openai.transcription_chunk_overlap', 15);

        $splitStartTime = microtime(true);
        $splitResult = $transcriptionService->splitAudioToChunks($localOriginalPath, $chunkDuration, $chunkOverlap);
        $splitTime = microtime(true) - $splitStartTime;
        Log::info("[PrepareAudio] FFmpeg split selesai: {$splitTime} sec, total chunks: ".count($splitResult['chunks']));

        // Hapus file original lokal setelah di-split
        @unlink($localOriginalPath);

        // 4. Upload chunk ke MinIO dan insert ke Database
        $jobs = [];
        $tempDir = $splitResult['temp_dir'];

        foreach ($splitResult['chunks'] as $chunkMeta) {
            $chunkMinioPath = "meetings/{$recording->meeting_id}/recordings/{$recording->id}/chunks/{$chunkMeta['file_name']}";

            // Upload ke MinIO
            $contents = file_get_contents($chunkMeta['local_path']);
            if ($contents !== false) {
                Storage::disk($disk)->put($chunkMinioPath, $contents);
            }
            @unlink($chunkMeta['local_path']); // Hapus local chunk

            // Daftarkan di Database
            $chunkRecord = MeetingTranscriptionChunk::create([
                'recording_id' => $recording->id,
                'chunk_index' => $chunkMeta['index'],
                'start_seconds' => $chunkMeta['start_seconds'],
                'end_seconds' => $chunkMeta['end_seconds'],
                'normal_end_seconds' => $chunkMeta['normal_end_seconds'],
                'file_path' => $chunkMinioPath,
                'status' => 'pending',
            ]);

            $isLastChunk = ($chunkMeta['index'] === count($splitResult['chunks']) - 1);

            $jobs[] = new TranscribeAudioChunkJob(
                $chunkRecord->id,
                $chunkMeta['start_seconds'],
                $chunkMeta['normal_end_seconds'],
                $isLastChunk
            );
        }

        @rmdir($tempDir);

        // 4. Dispatch Batch
        $batchId = Bus::batch($jobs)->then(function (Batch $batch) use ($recordingId, $disk) {
            // Semua chunk sukses
            Log::info("[Batch] Semua chunk sukses untuk Recording ID: {$recordingId}");

            /** @var MeetingRecording|null $recording */
            $recording = MeetingRecording::query()->find($recordingId);
            if ($recording) {
                // Di sini kita bisa panggil logic re-order jika perlu,
                // tapi ordering sudah ditangani via start_seconds di frontend/query
                $recording->fill(['status' => 'completed'])->save();

                // Hapus folder chunks di MinIO
                Storage::disk($disk)->deleteDirectory("meetings/{$recording->meeting_id}/recordings/{$recordingId}/chunks");

                // Trigger event transcript_ready (ambil data meeting dan broadcast)
                /** @var \App\Models\Meeting|null $meetingObj */
                $meetingObj = \App\Models\Meeting::query()->find($recording->meeting_id);
                if ($meetingObj) {
                    event(new MeetingUpdated($meetingObj, 'transcript_ready'));
                }
            }
        })->catch(function (Batch $batch, Throwable $e) use ($recordingId) {
            Log::error("[Batch] Kegagalan pada batch Transkripsi untuk Recording ID: {$recordingId} - ".$e->getMessage());
        })->finally(function (Batch $batch) use ($recordingId) {
            Log::info("[Batch] Selesai dieksekusi untuk Recording ID: {$recordingId}");
        })->name('Transcription Batch - Rec: '.$recordingId)
            ->dispatch();

        Log::info('[PrepareAudio] Total waktu persiapan: '.(microtime(true) - $startTime)." sec. Batch ID: {$batchId->id}");
    }
}
