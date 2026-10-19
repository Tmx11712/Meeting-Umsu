<?php

use App\Models\Meeting;
use App\Models\MeetingAttendance;
use App\Models\MeetingParticipant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

function createTestMeeting(array $attributes = []): Meeting
{
    static $counter = 1;
    $owner = User::factory()->create();

    return Meeting::create(array_merge([
        'title' => 'Rapat Koordinasi '.($counter++),
        'date' => Carbon::now()->toDateString(),
        'start_time' => '09:00:00',
        'end_time' => '11:00:00',
        'status' => 'terjadwal',
        'current_stage' => 1,
        'location' => 'Ruang Sidang Biro Lt. 3',
        'type' => 'internal',
        'created_by' => $owner->id,
    ], $attributes));
}

test('public attendance is closed when meeting is dibatalkan', function () {
    /** @var TestCase $this */
    $meeting = createTestMeeting([
        'status' => 'dibatalkan',
        'current_stage' => 1,
    ]);

    $response = $this->get("/attend/{$meeting->id}");

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('meetings/public-attendance')
        ->where('isOpen', false)
        ->where('closedReason', 'Rapat ini telah dibatalkan.')
    );

    // Submission should also be rejected
    $submitResponse = $this->post("/attend/{$meeting->id}", [
        'guest_name' => 'Budi Santoso',
        'guest_unit_kerja' => 'Fakultas Teknik',
        'guest_institution' => 'Dosen',
    ]);

    $submitResponse->assertSessionHasErrors('guest_name');
    expect(MeetingAttendance::query()->where('meeting_id', '=', $meeting->id, 'and')->count('*'))->toBe(0);
});

test('public attendance is closed when meeting is selesai or stage >= 5', function () {
    /** @var TestCase $this */
    $meeting = createTestMeeting([
        'status' => 'selesai',
        'current_stage' => 5,
    ]);

    $response = $this->get("/attend/{$meeting->id}");

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('meetings/public-attendance')
        ->where('isOpen', false)
        ->where('closedReason', 'Sesi absensi untuk rapat ini telah resmi ditutup.')
    );

    $submitResponse = $this->post("/attend/{$meeting->id}", [
        'guest_name' => 'Budi Santoso',
        'guest_unit_kerja' => 'Fakultas Teknik',
        'guest_institution' => 'Dosen',
    ]);

    $submitResponse->assertSessionHasErrors('guest_name');
    expect(MeetingAttendance::query()->where('meeting_id', '=', $meeting->id, 'and')->count('*'))->toBe(0);
});

test('public attendance is closed for future scheduled meetings with stage < 2', function () {
    /** @var TestCase $this */
    $meeting = createTestMeeting([
        'date' => Carbon::now()->addDays(3)->toDateString(),
        'status' => 'terjadwal',
        'current_stage' => 1,
    ]);

    $response = $this->get("/attend/{$meeting->id}");

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('meetings/public-attendance')
        ->where('isOpen', false)
        ->where('closedReason', 'Sesi absensi belum dibuka. Absensi dibuka pada hari pelaksanaan rapat.')
    );
});

test('public attendance is open for active or today meetings', function () {
    /** @var TestCase $this */
    $meeting = createTestMeeting([
        'date' => Carbon::now()->toDateString(),
        'status' => 'berlangsung',
        'current_stage' => 3,
    ]);

    $response = $this->get("/attend/{$meeting->id}");

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('meetings/public-attendance')
        ->where('isOpen', true)
        ->where('closedReason', null)
    );

    $submitResponse = $this->post("/attend/{$meeting->id}", [
        'guest_name' => 'Dr. Irvan, M.Kom.',
        'guest_unit_kerja' => 'Biro IT',
        'guest_institution' => 'Staff IT',
    ]);

    $submitResponse->assertSessionHas('success');
    expect(MeetingAttendance::query()->where('meeting_id', '=', $meeting->id, 'and')->count('*'))->toBe(1);
});

test('dashboard calculates avg attendance accurately with sql count without ram overhead', function () {
    /** @var TestCase $this */
    /** @var User $user */
    $user = User::factory()->create();

    $meeting = createTestMeeting([
        'status' => 'selesai',
        'current_stage' => 7,
    ]);

    $participant1 = User::factory()->create();
    $participant2 = User::factory()->create();

    MeetingParticipant::create([
        'meeting_id' => $meeting->id,
        'user_id' => $participant1->id,
        'role' => 'peserta',
    ]);

    MeetingParticipant::create([
        'meeting_id' => $meeting->id,
        'user_id' => $participant2->id,
        'role' => 'peserta',
    ]);

    // 1 guest attendance
    MeetingAttendance::create([
        'meeting_id' => $meeting->id,
        'guest_name' => 'Tamu 1',
        'guest_unit_kerja' => 'IT',
        'guest_institution' => 'Staff',
        'status' => 'hadir',
        'method' => 'qr_code',
        'check_in_time' => now(),
    ]);

    // Clear stats cache so calculate runs fresh
    Cache::forget('dashboard_stats');

    // Total target = 2 participants + 1 guest = 3. Total attended = 1. Rate = round(1/3 * 100) = 33%
    $response = $this->actingAs($user)->get(route('dashboard'));
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->where('stats.avgAttendance', 33)
    );
});

test('db backup command runs successfully', function () {
    /** @var TestCase $this */
    $this->artisan('db:backup', ['--keep' => 7])
        ->assertExitCode(0);
});
