<?php

use App\Enums\MeetingActionItemStatus;
use App\Enums\MeetingMinuteStatus;
use App\Models\Meeting;
use App\Models\MeetingActionItem;
use App\Models\MeetingAttendance;
use App\Models\MeetingMinute;
use App\Models\MeetingParticipant;
use App\Models\Menu;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\RolesAndPermissionsSeeder;
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
    $viewerRole = Role::firstOrCreate(['name' => 'Viewer', 'guard_name' => 'web']);
    /** @var User $user */
    $user = User::factory()->create();
    $user->assignRole($viewerRole);

    $meeting = createTestMeeting([
        'status' => 'selesai',
        'current_stage' => 7,
    ]);

    $participant1 = User::factory()->create();
    $participant2 = User::factory()->create();

    MeetingParticipant::create([
        'meeting_id' => $meeting->id,
        'user_id' => $participant1->id,
    ]);

    MeetingParticipant::create([
        'meeting_id' => $meeting->id,
        'user_id' => $participant2->id,
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

test('meeting store and update accept frontend payload without mass assignment exception', function () {
    /** @var TestCase $this */
    $this->seed(RolesAndPermissionsSeeder::class);

    /** @var User $umum */
    $umum = User::factory()->create(['status' => 'aktif']);
    $umum->assignRole('Bag. Umum');

    $this->actingAs($umum)
        ->post(route('meetings.store'), [
            'title' => 'Rapat Pengurus',
            'type' => 'Rapat internal',
            'date' => now()->toDateString(),
            'start_time' => '09:00',
            'end_time' => '11:00',
            'location' => 'Ruang Rapat A',
            'participants' => [],
            'auto_record' => true,
        ])
        ->assertRedirect(route('dashboard'));

    $meeting = Meeting::query()->where('title', '=', 'Rapat Pengurus')->firstOrFail();

    $this->actingAs($umum)
        ->put(route('meetings.update', $meeting), [
            'title' => 'Rapat Pengurus Revisi',
            'type' => 'Rapat internal',
            'date' => now()->toDateString(),
            'start_time' => '09:30',
            'end_time' => '11:30',
            'location' => 'Ruang Rapat B',
            'participants' => [$umum->id],
        ])
        ->assertRedirect(route('meetings.show', $meeting));

    expect($meeting->fresh()->title)->toBe('Rapat Pengurus Revisi');
});

test('action items preserve status and avoid utc off-by-one deadline shift in Asia/Jakarta', function () {
    /** @var TestCase $this */
    config(['app.timezone' => 'Asia/Jakarta']);
    date_default_timezone_set('Asia/Jakarta');

    $this->seed(RolesAndPermissionsSeeder::class);

    /** @var User $pimpinan */
    $pimpinan = User::factory()->create(['status' => 'aktif']);
    $pimpinan->assignRole('Pimpinan');

    $meeting = createTestMeeting(['current_stage' => 6, 'created_by' => $pimpinan->id]);
    $minute = MeetingMinute::create([
        'meeting_id' => $meeting->id,
        'status' => MeetingMinuteStatus::MENUNGGU_PERSETUJUAN->value,
        'content' => ['sections' => []],
    ]);

    $existingItem = MeetingActionItem::create([
        'meeting_id' => $meeting->id,
        'minute_id' => $minute->id,
        'description' => 'Susun anggaran',
        'pic' => 'Keuangan',
        'deadline' => '2026-11-12',
        'status' => MeetingActionItemStatus::DONE->value,
    ]);

    expect($existingItem->fresh()->toArray()['deadline'])->toBe('2026-11-12');

    // Simulate ISO UTC string serialized for midnight Asia/Jakarta (2026-11-12T00:00+07:00 == 2026-11-11T17:00:00Z)
    $this->actingAs($pimpinan)
        ->put(route('meetings.approval.action-items', $meeting), [
            'action_items' => [
                [
                    'id' => $existingItem->id,
                    'description' => 'Susun anggaran final',
                    'pic' => 'Keuangan',
                    'deadline' => '2026-11-11T17:00:00.000000Z',
                ],
            ],
        ])
        ->assertRedirect();

    $updated = $existingItem->fresh();
    expect($updated->deadline->format('Y-m-d'))->toBe('2026-11-12')
        ->and($updated->status)->toBe(MeetingActionItemStatus::DONE->value);
});

test('invalid query filters, non-uuid routes, uninvited dashboard isolation, and self-parent menu are guarded safely', function () {
    /** @var TestCase $this */
    $this->seed(RolesAndPermissionsSeeder::class);

    /** @var User $admin */
    $admin = User::factory()->create(['status' => 'aktif']);
    $admin->assignRole('Administrator');

    /** @var User $stranger */
    $stranger = User::factory()->create(['status' => 'aktif']);

    createTestMeeting([
        'title' => 'Rapat Rahasia Dashboard',
        'status' => 'berlangsung',
        'current_stage' => 2,
    ]);

    // Warm global stats cache first as admin
    $this->actingAs($admin)->get(route('dashboard'))->assertOk();

    // Uninvited user without global role does not inherit cached global dashboard data
    $this->actingAs($stranger)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.meetingsThisMonth', 0)
            ->has('todayMeetings', 0)
        );

    // Invalid month / report dates / api date / non-UUID routes do not trigger SQL 500
    $this->actingAs($admin)->get(route('meetings.index', ['month' => 'invalid-month']))->assertOk();
    $this->actingAs($admin)->get(route('reports.index', ['start_date' => 'not-a-date', 'end_date' => 'bad']))->assertOk();
    $this->actingAs($admin)->getJson('/api/meetings?date=not-a-date')->assertOk();
    $this->actingAs($admin)->get('/meetings/not-a-uuid')->assertNotFound();

    // Menu self-parent rejected cleanly
    $menu = Menu::create(['name' => 'Custom Item', 'order' => 1, 'status' => true]);
    $this->actingAs($admin)
        ->put(route('configuration.menus.update', $menu), [
            'name' => 'Custom Item',
            'order' => 1,
            'parent_id' => $menu->id,
        ])
        ->assertSessionHasErrors('parent_id');
});
