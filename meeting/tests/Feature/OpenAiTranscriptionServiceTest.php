<?php

use App\Services\OpenAiTranscriptionService;
use Illuminate\Support\Facades\Http;

/**
 * Regression test: jalur legacy transcribeChunk() sempat mengembalikan array flat sehingga
 * TranscribeAudioJob (yang membaca ['segments'] & ['duration']) tidak pernah menyimpan transkrip.
 * FFmpeg/ffprobe di-mock agar test tidak bergantung pada binary di mesin.
 */
function makeFakeChunks(int $count): array
{
    $dir = sys_get_temp_dir().'/whisper_chunks_test_'.uniqid();
    mkdir($dir, 0755, true);

    $chunks = [];
    foreach (range(0, $count - 1) as $i) {
        $path = $dir.'/chunk_'.sprintf('%03d', $i).'.mp3';
        file_put_contents($path, 'fake-audio-'.$i);

        $chunks[] = [
            'index' => $i,
            'start_seconds' => (float) ($i * 900),
            'end_seconds' => (float) ($i * 900 + 915),
            'normal_end_seconds' => (float) (($i + 1) * 900),
            'local_path' => $path,
            'file_name' => basename($path),
        ];
    }

    return ['temp_dir' => $dir, 'chunks' => $chunks];
}

it('mengembalikan format segments + duration dan menghapus folder temp', function () {
    config(['services.openai.key' => 'test-key']);

    $split = makeFakeChunks(1);

    $service = Mockery::mock(OpenAiTranscriptionService::class)->makePartial();
    $service->shouldReceive('getAudioDuration')->andReturn(120.0);
    $service->shouldReceive('splitAudioToChunks')->once()->andReturn($split);

    Http::fake([
        'api.openai.com/*' => Http::response([
            'duration' => 120,
            'segments' => [
                ['start' => 0, 'end' => 4.5, 'text' => ' Selamat pagi. '],
                ['start' => 4.5, 'end' => 9.0, 'text' => 'Kita mulai rapat.'],
            ],
        ]),
    ]);

    $result = $service->transcribeChunk('/tmp/dummy.wav');

    expect($result)->toHaveKeys(['segments', 'duration'])
        ->and($result['duration'])->toBe(120.0)
        ->and($result['segments'])->toHaveCount(2)
        ->and($result['segments'][0]['text'])->toBe('Selamat pagi.')
        ->and(is_dir($split['temp_dir']))->toBeFalse();
});

it('menggeser timestamp tiap chunk dan membuang segmen overlap dari chunk non-terakhir', function () {
    config(['services.openai.key' => 'test-key']);

    $split = makeFakeChunks(2);

    $service = Mockery::mock(OpenAiTranscriptionService::class)->makePartial();
    $service->shouldReceive('getAudioDuration')->andReturn(1500.0);
    $service->shouldReceive('splitAudioToChunks')->andReturn($split);

    Http::fake([
        'api.openai.com/*' => Http::sequence()
            ->push([
                'segments' => [
                    ['start' => 10, 'end' => 20, 'text' => 'Chunk satu'],
                    // Mulai setelah normal_end (900) -> bagian overlap, harus dibuang
                    ['start' => 905, 'end' => 912, 'text' => 'Overlap'],
                ],
            ])
            ->push([
                'segments' => [
                    ['start' => 5, 'end' => 15, 'text' => 'Chunk dua'],
                ],
            ]),
    ]);

    $result = $service->transcribeChunk('/tmp/dummy.wav');

    expect($result['segments'])->toHaveCount(2)
        ->and($result['segments'][0]['text'])->toBe('Chunk satu')
        ->and($result['segments'][0]['start'])->toEqual(10)
        // chunk kedua dimulai di detik 900 -> 900 + 5
        ->and($result['segments'][1]['text'])->toBe('Chunk dua')
        ->and($result['segments'][1]['start'])->toEqual(905)
        ->and(is_dir($split['temp_dir']))->toBeFalse();
});

it('tetap menghapus folder temp saat panggilan OpenAI gagal', function () {
    config(['services.openai.key' => 'test-key']);

    $split = makeFakeChunks(1);

    $service = Mockery::mock(OpenAiTranscriptionService::class)->makePartial();
    $service->shouldReceive('getAudioDuration')->andReturn(60.0);
    $service->shouldReceive('splitAudioToChunks')->andReturn($split);

    Http::fake([
        'api.openai.com/*' => Http::response(['error' => ['message' => 'boom']], 500),
    ]);

    expect(fn () => $service->transcribeChunk('/tmp/dummy.wav'))->toThrow(Exception::class);
    expect(is_dir($split['temp_dir']))->toBeFalse();
});
