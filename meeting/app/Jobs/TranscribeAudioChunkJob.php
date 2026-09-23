<?php

namespace App\Jobs;

use App\Models\MeetingRecording;
use App\Models\MeetingTranscript;
use App\Models\MeetingTranscriptionChunk;
use App\Services\OpenAiTranscriptionService;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TranscribeAudioChunkJob implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600; // 10 menit per chunk OpenAI

    public int $tries = 3;

    protected int $chunkId;

    protected float $offsetSeconds;

    protected float $normalEndSeconds;

    protected bool $isLastChunk;

    public function __construct(int $chunkId, float $offsetSeconds, float $normalEndSeconds, bool $isLastChunk)
    {
        $this->chunkId = $chunkId;
        $this->offsetSeconds = $offsetSeconds;
        $this->normalEndSeconds = $normalEndSeconds;
        $this->isLastChunk = $isLastChunk;
    }

    public function handle(OpenAiTranscriptionService $transcriptionService): void
    {
        if ($this->batch() && $this->batch()->cancelled()) {
            return;
        }

        /** @var MeetingTranscriptionChunk|null $chunk */
        $chunk = MeetingTranscriptionChunk::query()->find($this->chunkId);
        if (! $chunk) {
            Log::error("[TranscribeChunk] Chunk ID {$this->chunkId} tidak ditemukan.");

            return;
        }

        $chunk->increment('attempts');
        $chunk->update(['status' => 'processing', 'error_message' => null]);

        $startTime = microtime(true);
        $disk = config('filesystems.default');

        if (! Storage::disk($disk)->exists($chunk->file_path)) {
            $msg = "File chunk tidak ditemukan di MinIO: {$chunk->file_path}";
            $chunk->update(['status' => 'failed', 'error_message' => $msg]);
            $this->fail(new \Exception($msg));

            return;
        }

        // 1. Download dari MinIO ke local /tmp
        $localChunkPath = sys_get_temp_dir().'/'.uniqid('chunk_').'_'.basename($chunk->file_path);
        file_put_contents($localChunkPath, Storage::disk($disk)->get($chunk->file_path));

        try {
            // 2. Transcribe via OpenAI (dengan filter overlap)
            $apiStartTime = microtime(true);
            $segments = $transcriptionService->transcribeSingleChunk(
                $localChunkPath,
                $this->offsetSeconds,
                $this->normalEndSeconds,
                $this->isLastChunk
            );
            $apiTime = microtime(true) - $apiStartTime;
            Log::info("[TranscribeChunk_{$chunk->chunk_index}] OpenAI API call: {$apiTime} sec");

            // 3. Database Upsert/Delete-Insert (Idempotency)
            DB::transaction(function () use ($chunk, $segments) {
                // Hapus data lama milik chunk ini (jika job ini hasil dari retry)
                MeetingTranscript::query()->where('chunk_id', $chunk->id)->delete();

                $rows = [];
                $segmentIndex = 0;
                foreach ($segments as $s) {
                    $rows[] = [
                        'recording_id' => $chunk->recording_id,
                        'chunk_id' => $chunk->id,
                        'sequence_order' => $segmentIndex, // Sudah tidak dipakai untuk global ordering, tapi disimpan
                        'speaker_name' => 'Speaker '.rand(1, 3), // Atau logic identifikasi speaker
                        'start_time' => date('H:i:s', (int) $s['start']),
                        'end_time' => date('H:i:s', (int) $s['end']),
                        'timestamp_seconds' => $s['start'],
                        'content' => $s['text'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    $segmentIndex++;
                }

                // Bulk insert
                if (! empty($rows)) {
                    DB::table('meeting_transcripts')->insert($rows);
                }

                // Mark chunk completed
                $chunk->update([
                    'status' => 'completed',
                    'completed_at' => now(),
                ]);
            });

            // 4. Cleanup: Hapus file lokal & MinIO setelah sukses
            @unlink($localChunkPath);
            Storage::disk($disk)->delete($chunk->file_path);

            $totalTime = microtime(true) - $startTime;
            Log::info("[TranscribeChunk_{$chunk->chunk_index}] Selesai dalam {$totalTime} sec.");

        } catch (\Throwable $e) {
            @unlink($localChunkPath);
            $chunk->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
            Log::error("[TranscribeChunk_{$chunk->chunk_index}] Gagal: ".$e->getMessage());

            // Jika ada status failed, set recording juga ke failed
            /** @var MeetingRecording|null $recording */
            $recording = MeetingRecording::query()->find($chunk->recording_id);
            if ($recording && $recording->status !== 'completed') {
                $recording->fill(['status' => 'failed'])->save();
            }

            $this->fail($e);
        }
    }
}
