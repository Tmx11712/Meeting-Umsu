<?php

namespace App\Jobs;

use App\Events\MeetingUpdated;
use App\Models\Meeting;
use App\Models\MeetingRecording;
use App\Models\MeetingTranscript;
use App\Models\MeetingTranscriptionChunk;
use App\Services\OpenAiTranscriptionService;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Client\RequestException;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TranscribeAudioChunkJob implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600; // 10 menit per chunk OpenAI

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [10, 30, 60];

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

        // 1. Download dari MinIO ke local /tmp via stream (hemat RAM)
        $localChunkPath = sys_get_temp_dir().'/'.uniqid('chunk_').'_'.basename($chunk->file_path);
        $readStream = Storage::disk($disk)->readStream($chunk->file_path);
        if (! $readStream) {
            $msg = "Gagal membuka stream file chunk dari storage: {$chunk->file_path}";
            $chunk->update(['status' => 'failed', 'error_message' => $msg]);
            $this->fail(new \Exception($msg));

            return;
        }
        $writeStream = fopen($localChunkPath, 'wb');
        stream_copy_to_stream($readStream, $writeStream);
        fclose($writeStream);
        if (is_resource($readStream)) {
            fclose($readStream);
        }

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

                // Ambil recording untuk meeting_id
                $recording = MeetingRecording::query()->find($chunk->recording_id);
                if (! $recording) {
                    throw new \Exception("Recording dengan ID {$chunk->recording_id} tidak ditemukan untuk chunk {$chunk->id}.");
                }
                if (! $recording->meeting_id) {
                    throw new \Exception("Recording {$recording->id} tidak memiliki meeting_id yang valid. Transkrip dibatalkan.");
                }

                $rows = [];
                $segmentIndex = 0;
                foreach ($segments as $s) {
                    $rows[] = $this->buildTranscriptRow($recording, $chunk, $s, $segmentIndex);
                    $segmentIndex++;
                }

                // Bulk insert
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

        } catch (RequestException $e) {
            @unlink($localChunkPath);
            if ($e->response->status() === 429) {
                Log::warning("[TranscribeChunk_{$chunk->chunk_index}] Rate Limit OpenAI (429). Menunggu 60 detik sebelum mencoba lagi.");
                $this->release(60);

                return;
            }

            $chunk->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
            Log::error("[TranscribeChunk_{$chunk->chunk_index}] Gagal API: ".$e->getMessage());

            throw $e;
        } catch (\Throwable $e) {
            @unlink($localChunkPath);
            $chunk->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
            Log::error("[TranscribeChunk_{$chunk->chunk_index}] Gagal: ".$e->getMessage());

            throw $e;
        }
    }

    public function failed(?\Throwable $exception = null): void
    {
        $this->batch()?->cancel();

        /** @var MeetingTranscriptionChunk|null $chunk */
        $chunk = MeetingTranscriptionChunk::query()->find($this->chunkId);
        if (! $chunk) {
            return;
        }

        if ($chunk->status !== 'completed') {
            $chunk->update([
                'status' => 'failed',
                'error_message' => $exception?->getMessage() ?? $chunk->error_message ?? 'Chunk transkripsi gagal diproses.',
            ]);
        }

        /** @var MeetingRecording|null $recording */
        $recording = MeetingRecording::query()->find($chunk->recording_id);
        if ($recording && $recording->status !== 'completed') {
            $recording->fill(['status' => 'failed'])->save();

            /** @var Meeting|null $meeting */
            $meeting = Meeting::query()->find($recording->meeting_id);
            if ($meeting) {
                safe_broadcast(new MeetingUpdated($meeting, 'transcript_failed'));
            }
        }
    }

    /**
     * Membangun satu baris data transkrip untuk keperluan bulk insert.
     * Dipisahkan dari logika loop agar semua validasi struktur baris ada di satu tempat.
     */
    protected function buildTranscriptRow(MeetingRecording $recording, MeetingTranscriptionChunk $chunk, array $segment, int $segmentIndex): array
    {
        return [
            'id' => Str::uuid()->toString(),
            'meeting_id' => $recording->meeting_id,
            'recording_id' => $chunk->recording_id,
            'chunk_id' => $chunk->id,
            'sequence_order' => (($chunk->chunk_index ?? 0) * 10000) + $segmentIndex,
            'speaker' => 'Speaker (Otomatis)',
            'timestamp_seconds' => (int) round($segment['start'] ?? 0),
            'text' => $segment['text'] ?? '',
            'is_live' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
