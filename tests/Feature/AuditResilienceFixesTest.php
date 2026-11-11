<?php

use App\Actions\Meetings\GenerateMeetingMinuteAction;
use App\Enums\MeetingMinuteStatus;
use App\Jobs\GenerateMeetingMinuteJob;
use App\Jobs\PrepareAudioForTranscriptionJob;
use App\Jobs\TranscribeAudioChunkJob;
use App\Models\Meeting;
use App\Models\MeetingMinute;
use App\Models\MeetingRecording;
use App\Models\MeetingTranscriptionChunk;
use App\Models\User;
use App\Services\OpenAiTranscriptionService;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Broadcasting\BroadcastManager;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

beforeEach(function () {
    /** @var TestCase $this */
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('form requests reject non-uuid IDs cleanly and manual attendance requires user or guest name', function () {
    /** @var TestCase $this */
    /** @var User $creator */
    $creator = User::factory()->create(['status' => 'aktif']);
    $creator->assignRole('Bag. Umum');

    $meeting = Meeting::create([
        'title' => 'Rapat Validasi UUID',
        'date' => now()->toDateString(),
        'start_time' => '09:00:00',
        'end_time' => '11:00:00',
        'duration' => 7200,
        'location' => 'Ruang Rapat 1',
        'type' => 'Rapat Koordinasi',
        'status' => 'berlangsung',
        'source' => 'manual',
        'created_by' => $creator->id,
        'current_stage' => 4,
    ]);

    // Invalid UUID on public API attendance scan returns 422 instead of Postgres 22P02 500
    $this->postJson("/api/meetings/{$meeting->id}/attendance/scan", [
        'user_id' => 'not-a-uuid',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('user_id');

    // Invalid UUID on meeting store participants returns validation error
    $this->actingAs($creator)
        ->post(route('meetings.store'), [
            'title' => 'Rapat Test',
            'date' => now()->toDateString(),
            'start_time' => '09:00',
            'end_time' => '10:00',
            'participants' => ['not-a-uuid'],
        ])
        ->assertSessionHasErrors('participants.0');

    // Empty manual attendance without user_id or guest_name is rejected
    $this->actingAs($creator)
        ->post(route('meetings.attendance.manual', $meeting), [
            'status' => 'hadir',
        ])
        ->assertSessionHasErrors(['user_id', 'guest_name']);
});

test('viewer can see meetings read-only while uninvited outsider without viewer role cannot see or tamper with documents', function () {
    /** @var TestCase $this */
    /** @var User $creator */
    $creator = User::factory()->create(['status' => 'aktif']);
    $creator->assignRole('Bag. Umum');

    /** @var User $viewer */
    $viewer = User::factory()->create(['status' => 'aktif']);
    $viewer->assignRole('Viewer');

    /** @var User $outsider */
    $outsider = User::factory()->create(['status' => 'aktif']);
    $outsider->givePermissionTo(['minute.read', 'minute.update']);

    $draftMeeting = Meeting::create([
        'title' => 'Rapat Internal Draft Rahasia',
        'date' => now()->toDateString(),
        'start_time' => '09:00:00',
        'end_time' => '11:00:00',
        'duration' => 7200,
        'location' => 'Ruang Tertutup',
        'type' => 'Rapat Pimpinan',
        'status' => 'berlangsung',
        'source' => 'manual',
        'created_by' => $creator->id,
        'current_stage' => 5,
    ]);

    MeetingMinute::create([
        'meeting_id' => $draftMeeting->id,
        'status' => MeetingMinuteStatus::REVIEW->value,
        'content' => ['sections' => []],
    ]);

    // Viewer can see draft meeting in minutes index (read-only like Pimpinan) but cannot mutate documents
    $this->actingAs($viewer)
        ->get(route('minutes.index'))
        ->assertOk()
        ->assertSee('Rapat Internal Draft Rahasia');

    $this->actingAs($viewer)
        ->post(route('meetings.documents.store', $draftMeeting), [])
        ->assertForbidden();

    // User without Viewer/Pimpinan/operator role cannot see uninvited meetings or tamper with documents
    $this->actingAs($outsider)
        ->get(route('minutes.index'))
        ->assertOk()
        ->assertDontSee('Rapat Internal Draft Rahasia');

    $this->actingAs($outsider)
        ->post(route('meetings.documents.store', $draftMeeting), [])
        ->assertForbidden();
});

test('generate meeting minute job survives offline broadcaster and clears dashboard_stats_v2 cache', function () {
    /** @var TestCase $this */
    /** @var User $creator */
    $creator = User::factory()->create(['status' => 'aktif']);
    $creator->assignRole('Bag. Umum');

    $meeting = Meeting::create([
        'title' => 'Rapat AI Broadcast Test',
        'date' => now()->toDateString(),
        'start_time' => '09:00:00',
        'end_time' => '11:00:00',
        'duration' => 7200,
        'location' => 'Ruang AI',
        'type' => 'Rapat Koordinasi',
        'status' => 'berlangsung',
        'source' => 'manual',
        'created_by' => $creator->id,
        'current_stage' => 5,
        'ai_status' => 'processing',
    ]);

    $minute = MeetingMinute::create([
        'meeting_id' => $meeting->id,
        'status' => MeetingMinuteStatus::REVIEW->value,
        'content' => ['sections' => []],
    ]);

    Cache::put('dashboard_stats_v2', ['stale' => true], 300);

    $actionMock = Mockery::mock(GenerateMeetingMinuteAction::class);
    $actionMock->shouldReceive('execute')->once()->andReturn($minute);

    $broadcastMock = Mockery::mock(BroadcastManager::class);
    $broadcastMock->shouldReceive('event')->andThrow(new RuntimeException('Reverb offline'));
    $this->app->instance(BroadcastManager::class, $broadcastMock);

    $job = new GenerateMeetingMinuteJob($meeting);
    $job->handle($actionMock);

    $meeting->refresh();
    expect($meeting->ai_status)->toBe('completed');

    $minute->update(['status' => MeetingMinuteStatus::DISETUJUI->value]);
    expect(Cache::has('dashboard_stats_v2'))->toBeFalse();

    // Job::failed resets processing status if worker timed out
    $meeting->update(['ai_status' => 'processing']);
    $job->failed(new RuntimeException('Worker timeout'));
    expect($meeting->fresh()->ai_status)->toBe('failed');
});

test('prepare and chunk transcription jobs recover cleanly on retries, failures, and re-transcribe', function () {
    /** @var TestCase $this */
    $disk = config('filesystems.default');
    Storage::fake($disk);

    /** @var User $operator */
    $operator = User::factory()->create(['status' => 'aktif']);
    $operator->assignRole('Bag. Humas');

    $meeting = Meeting::create([
        'title' => 'Rapat Rekam Panjang',
        'date' => now()->toDateString(),
        'start_time' => '09:00:00',
        'end_time' => '11:00:00',
        'duration' => 7200,
        'location' => 'Aula',
        'type' => 'Rapat Koordinasi',
        'status' => 'berlangsung',
        'source' => 'manual',
        'created_by' => $operator->id,
        'current_stage' => 2,
    ]);

    $audioPath = "recordings/{$meeting->id}/audio.mp3";
    Storage::disk($disk)->put($audioPath, 'fake-mp3');

    $recording = MeetingRecording::create([
        'meeting_id' => $meeting->id,
        'file_path' => $audioPath,
        'file_size' => 1024,
        'duration_seconds' => 1500,
        'source' => 'upload',
        'status' => 'transcribing',
        'recorded_by' => $operator->id,
    ]);

    $chunkPath = "meetings/{$meeting->id}/recordings/{$recording->id}/chunks/chunk_000.mp3";
    Storage::disk($disk)->put($chunkPath, 'fake-chunk');

    $chunk = MeetingTranscriptionChunk::create([
        'recording_id' => $recording->id,
        'chunk_index' => 0,
        'start_seconds' => 0,
        'end_seconds' => 915,
        'normal_end_seconds' => 900,
        'file_path' => $chunkPath,
        'status' => 'pending',
    ]);

    // Transient 500 error in chunk job rethrows for retry without immediately failing recording
    Http::fake([
        'api.openai.com/*' => Http::response(['error' => 'upstream error'], 500),
    ]);
    config(['services.openai.key' => 'test-key']);

    $chunkJob = new TranscribeAudioChunkJob($chunk->id, 0, 900, true);
    expect(fn () => $chunkJob->handle(app(OpenAiTranscriptionService::class)))
        ->toThrow(RequestException::class);

    expect($recording->fresh()->status)->toBe('transcribing');

    // Permanent failed() marks chunk + recording failed
    $chunkJob->failed(new RuntimeException('Exhausted retries'));
    expect($chunk->fresh()->status)->toBe('failed')
        ->and($recording->fresh()->status)->toBe('failed');

    // PrepareAudioForTranscriptionJob::failed() resets stuck transcribing recording
    $recording->update(['status' => 'transcribing']);
    (new PrepareAudioForTranscriptionJob($recording->id))->failed(new RuntimeException('FFmpeg crashed'));
    expect($recording->fresh()->status)->toBe('failed');

    // Re-triggering transcribe clears stale chunk rows
    Bus::fake();
    $this->actingAs($operator)
        ->post(route('meetings.recording.transcribe', $meeting), [
            'recording_id' => $recording->id,
        ])
        ->assertRedirect();

    expect(MeetingTranscriptionChunk::query()->where('recording_id', '=', $recording->id)->count())->toBe(0)
        ->and($recording->fresh()->status)->toBe('transcribing');
});

test('login page reflects google oauth availability accurately', function () {
    /** @var TestCase $this */
    config(['services.google.client_id' => null, 'services.google.client_secret' => null]);

    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->where('canGoogleLogin', false)
        );

    config(['services.google.client_id' => 'client-id', 'services.google.client_secret' => 'client-secret']);

    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->where('canGoogleLogin', true)
        );
});
