<?php

use App\Enums\MeetingMinuteStatus;
use App\Models\Meeting;
use App\Models\MeetingMinute;
use App\Models\MeetingParticipant;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Tests\TestCase;

beforeEach(function () {
    /** @var TestCase $this */
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('deactivated users cannot authenticate via login screen', function () {
    /** @var TestCase $this */
    $user = User::factory()->create([
        'status' => 'nonaktif',
    ]);

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertGuest();
});

test('uninvited viewer cannot access confidential meeting endpoints or update action items', function () {
    /** @var TestCase $this */
    /** @var User $creator */
    $creator = User::factory()->create(['status' => 'aktif']);
    $creator->assignRole('Bag. Umum');

    /** @var User $uninvitedViewer */
    $uninvitedViewer = User::factory()->create(['status' => 'aktif']);
    $uninvitedViewer->assignRole('Viewer');

    /** @var User $invitedViewer */
    $invitedViewer = User::factory()->create(['status' => 'aktif']);
    $invitedViewer->assignRole('Viewer');

    $meeting = Meeting::create([
        'title' => 'Rapat Rahasia Pimpinan',
        'date' => now()->toDateString(),
        'start_time' => '09:00:00',
        'end_time' => '11:00:00',
        'duration' => 7200,
        'location' => 'Ruang Rektor',
        'type' => 'Rapat Pimpinan',
        'status' => 'selesai',
        'source' => 'manual',
        'created_by' => $creator->id,
        'current_stage' => 7,
    ]);

    MeetingParticipant::create([
        'meeting_id' => $meeting->id,
        'user_id' => $invitedViewer->id,
        'is_invited' => true,
    ]);

    MeetingMinute::create([
        'meeting_id' => $meeting->id,
        'status' => MeetingMinuteStatus::DISETUJUI->value,
        'content' => ['sections' => []],
    ]);

    // Uninvited viewer is blocked from transcription progress, action-items update, and PDF download
    $this->actingAs($uninvitedViewer)
        ->getJson(route('meetings.transcription.progress', $meeting))
        ->assertForbidden();

    $this->actingAs($uninvitedViewer)
        ->put(route('meetings.approval.action-items', $meeting), [
            'action_items' => [
                ['description' => 'Unauthorized item', 'pic' => 'Nobody'],
            ],
        ])
        ->assertForbidden();

    $this->actingAs($uninvitedViewer)
        ->get(route('meetings.review.pdf', $meeting))
        ->assertForbidden();

    // Invited viewer can view transcription progress
    $this->actingAs($invitedViewer)
        ->getJson(route('meetings.transcription.progress', $meeting))
        ->assertOk();
});

test('public api attendance scan does not escalate uninvited user to invited viewer and blocks closed meetings', function () {
    /** @var TestCase $this */
    /** @var User $creator */
    $creator = User::factory()->create(['status' => 'aktif']);
    $creator->assignRole('Bag. Umum');

    /** @var User $outsider */
    $outsider = User::factory()->create(['status' => 'aktif']);
    $outsider->assignRole('Viewer');

    $meeting = Meeting::create([
        'title' => 'Rapat Internal',
        'date' => now()->toDateString(),
        'start_time' => '09:00:00',
        'end_time' => '11:00:00',
        'duration' => 7200,
        'location' => 'Ruang Sidang',
        'type' => 'Rapat Koordinasi',
        'status' => 'berlangsung',
        'source' => 'manual',
        'created_by' => $creator->id,
        'current_stage' => 4,
    ]);

    $this->postJson("/api/meetings/{$meeting->id}/attendance/scan", [
        'user_id' => $outsider->id,
    ])->assertOk();

    // Participant record is created with is_invited = false so they still cannot view restricted meeting details
    $participant = MeetingParticipant::query()
        ->where('meeting_id', '=', $meeting->id)
        ->where('user_id', '=', $outsider->id)
        ->first();

    expect($participant)->not->toBeNull()
        ->and((bool) $participant->is_invited)->toBeFalse()
        ->and($outsider->can('view', $meeting))->toBeFalse();

    // Once meeting moves to stage 5 (review) or is cancelled, public API scan is rejected
    $meeting->update(['current_stage' => 5]);

    $this->postJson("/api/meetings/{$meeting->id}/attendance/scan", [
        'user_id' => $outsider->id,
    ])->assertStatus(422);
});

test('administrator cannot escalate privileges to super admin or rename core system roles', function () {
    /** @var TestCase $this */
    /** @var User $admin */
    $admin = User::factory()->create(['status' => 'aktif']);
    $admin->assignRole('Administrator');

    $superAdminRole = Role::query()->where('name', '=', 'Super Admin')->firstOrFail();
    $pimpinanRole = Role::query()->where('name', '=', 'Pimpinan')->firstOrFail();

    $this->actingAs($admin)
        ->post('/configuration/users', [
            'name' => 'Rogue Super Admin',
            'email' => 'rogue@umsu.ac.id',
            'password' => 'password123',
            'status' => 'aktif',
            'role_id' => $superAdminRole->id,
        ])
        ->assertForbidden();

    /** @var User $superAdmin */
    $superAdmin = User::factory()->create(['status' => 'aktif']);
    $superAdmin->assignRole('Super Admin');

    $this->actingAs($superAdmin)
        ->put("/configuration/roles/{$pimpinanRole->id}", [
            'name' => 'Pimpinan Renamed',
            'description' => 'Should not allow renaming core role',
        ])
        ->assertForbidden();
});

test('appearance cookie is whitelisted against script injection', function () {
    /** @var TestCase $this */
    $response = $this->withUnencryptedCookie('appearance', "';alert(1);//")
        ->get(route('login'));

    $response->assertOk();
    $response->assertDontSee("';alert(1);//", false);
});
