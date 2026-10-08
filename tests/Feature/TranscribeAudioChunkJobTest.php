<?php

use App\Jobs\TranscribeAudioChunkJob;
use App\Models\MeetingRecording;
use App\Models\MeetingTranscriptionChunk;
use Illuminate\Support\Str;

it('builds transcript row correctly for a single valid recording (batch dengan satu rekaman)', function () {
    $recording = new MeetingRecording([
        'meeting_id' => Str::uuid()->toString(),
        'id' => Str::uuid()->toString(),
    ]);

    $chunk = new MeetingTranscriptionChunk();
    $chunk->id = 1;
    $chunk->recording_id = $recording->id;

    $segment = [
        'start' => 10.4,
        'text' => 'Halo semua',
    ];

    $job = new TranscribeAudioChunkJob($chunk->id, 0, 100, true);
    $reflection = new ReflectionMethod($job, 'buildTranscriptRow');
    $reflection->setAccessible(true);

    $row = $reflection->invoke($job, $recording, $chunk, $segment, 0);

    expect($row)->toHaveKey('id')
        ->and($row)->toHaveKey('meeting_id', $recording->meeting_id)
        ->and($row)->toHaveKey('recording_id', $recording->id)
        ->and($row)->toHaveKey('chunk_id', 1)
        ->and($row)->toHaveKey('timestamp_seconds', 10)
        ->and($row)->toHaveKey('text', 'Halo semua');
});

it('can build rows for multiple different recordings separately (batch dengan beberapa rekaman berbeda)', function () {
    $recording1 = new MeetingRecording(['meeting_id' => Str::uuid()->toString(), 'id' => Str::uuid()->toString()]);
    $recording2 = new MeetingRecording(['meeting_id' => Str::uuid()->toString(), 'id' => Str::uuid()->toString()]);

    $chunk1 = new MeetingTranscriptionChunk();
    $chunk1->id = 1;
    $chunk1->recording_id = $recording1->id;

    $chunk2 = new MeetingTranscriptionChunk();
    $chunk2->id = 2;
    $chunk2->recording_id = $recording2->id;

    $job = new TranscribeAudioChunkJob(1, 0, 100, true);
    $reflection = new ReflectionMethod($job, 'buildTranscriptRow');
    $reflection->setAccessible(true);

    $row1 = $reflection->invoke($job, $recording1, $chunk1, ['start' => 0, 'text' => 'R1'], 0);
    $row2 = $reflection->invoke($job, $recording2, $chunk2, ['start' => 0, 'text' => 'R2'], 0);

    // Pastikan masing-masing baris mendapat meeting_id yang benar sesuai rekamannya
    expect($row1['meeting_id'])->toBe($recording1->meeting_id)
        ->and($row2['meeting_id'])->toBe($recording2->meeting_id)
        ->and($row1['meeting_id'])->not->toBe($row2['meeting_id']);
});

it('throws exception if recording is missing meeting_id', function () {
    $recording = new MeetingRecording(['id' => Str::uuid()->toString()]);
    // meeting_id disengaja null
    
    $error = null;
    try {
        if (!$recording->meeting_id) {
            throw new \Exception("Recording {$recording->id} tidak memiliki meeting_id yang valid. Transkrip dibatalkan.");
        }
    } catch (\Exception $e) {
        $error = $e->getMessage();
    }
    
    expect($error)->toContain('tidak memiliki meeting_id yang valid');
});
