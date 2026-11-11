<?php

use App\Enums\MeetingMinuteStatus;
use App\Models\Meeting;
use App\Models\MeetingDocument;
use App\Models\MeetingMinute;
use App\Models\MeetingParticipant;
use App\Models\MeetingRecording;
use App\Models\MeetingTranscript;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Laravel\Passkeys\Passkey;
use Laravel\Passkeys\Passkeys;
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

test('viewer can view meeting and approved pdf but cannot update action items or download unapproved draft pdf', function () {
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
        'title' => 'Rapat Pimpinan',
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

    $minute = MeetingMinute::create([
        'meeting_id' => $meeting->id,
        'status' => MeetingMinuteStatus::REVIEW->value,
        'content' => ['sections' => []],
    ]);

    // Viewer is blocked from updating action items and from downloading unapproved draft PDF
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

    // Once approved, any Viewer (including Google login users) can view the meeting and download the approved PDF
    $minute->update(['status' => MeetingMinuteStatus::DISETUJUI->value]);

    $this->actingAs($uninvitedViewer)
        ->get(route('meetings.show', $meeting))
        ->assertRedirect(route('meetings.approval', $meeting));

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
        ->and($outsider->can('update', $meeting))->toBeFalse();

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

test('approving meeting minute stores pdf in storage and purges raw recordings and transcripts', function () {
    /** @var TestCase $this */
    $disk = config('filesystems.default');
    Storage::fake($disk);

    /** @var User $pimpinan */
    $pimpinan = User::factory()->create(['status' => 'aktif']);
    $pimpinan->assignRole('Pimpinan');

    $meeting = Meeting::create([
        'title' => 'Rapat Evaluasi Tahunan',
        'date' => now()->toDateString(),
        'start_time' => '09:00:00',
        'end_time' => '10:00:00',
        'duration' => 3600,
        'location' => 'Ruang Rapat Utama',
        'type' => 'Rapat Evaluasi',
        'status' => 'berlangsung',
        'source' => 'manual',
        'created_by' => $pimpinan->id,
        'current_stage' => 6,
    ]);

    $audioPath = "recordings/{$meeting->id}-rapat-evaluasi-tahunan/audio.webm";
    Storage::disk($disk)->put($audioPath, 'fake-audio-binary');

    $recording = MeetingRecording::create([
        'meeting_id' => $meeting->id,
        'file_path' => $audioPath,
        'label' => 'Rekaman 1',
        'file_size' => 1024,
        'duration_seconds' => 4500,
        'source' => 'microphone',
        'status' => 'completed',
        'recorded_by' => $pimpinan->id,
    ]);

    MeetingTranscript::create([
        'meeting_id' => $meeting->id,
        'recording_id' => $recording->id,
        'timestamp_seconds' => 10,
        'speaker' => 'Pembicara 1',
        'text' => 'Transkrip mentah yang akan dihapus setelah disetujui.',
        'is_live' => false,
        'sequence_order' => 1,
    ]);

    MeetingMinute::create([
        'meeting_id' => $meeting->id,
        'status' => MeetingMinuteStatus::MENUNGGU_PERSETUJUAN->value,
        'content' => [
            'sections' => [
                ['title' => 'Pembahasan', 'content' => 'Ringkasan resmi rapat evaluasi.'],
            ],
        ],
    ]);

    $this->actingAs($pimpinan)
        ->post(route('meetings.approval.store', $meeting), [
            'decision' => 'approved',
            'notes' => 'Disetujui untuk diarsipkan.',
        ])
        ->assertRedirect(route('dashboard'));

    expect(Storage::disk($disk)->exists($meeting->getPdfStoragePath()))->toBeTrue()
        ->and(Storage::disk($disk)->exists($audioPath))->toBeFalse()
        ->and($meeting->recordings()->count())->toBe(0)
        ->and($meeting->transcripts()->count())->toBe(0)
        ->and($meeting->fresh()->duration)->toBe(4500);

    $this->actingAs($pimpinan)
        ->get(route('meetings.review.pdf', $meeting))
        ->assertOk()
        ->assertHeader('Content-Type', 'application/pdf');
});

test('approved or stage 6+ meetings cannot be reopened via recording endpoints', function () {
    /** @var TestCase $this */
    /** @var User $humas */
    $humas = User::factory()->create(['status' => 'aktif']);
    $humas->assignRole('Bag. Humas');

    $meeting = Meeting::create([
        'title' => 'Rapat Sudah Selesai',
        'date' => now()->toDateString(),
        'start_time' => '09:00:00',
        'end_time' => '10:00:00',
        'duration' => 3600,
        'location' => 'Ruang Rapat',
        'type' => 'Rapat Pimpinan',
        'status' => 'selesai',
        'source' => 'manual',
        'created_by' => $humas->id,
        'current_stage' => 7,
    ]);

    $this->actingAs($humas)
        ->post(route('meetings.recording.finish', $meeting))
        ->assertStatus(422);

    $this->actingAs($humas)
        ->postJson(route('meetings.recording.startSession', $meeting))
        ->assertStatus(422);

    expect($meeting->fresh()->status)->toBe('selesai')
        ->and($meeting->fresh()->current_stage)->toBe(7);
});

test('meeting duration calculation handles normal daytime and overnight rollover without negative values', function () {
    expect(Meeting::calculateDurationSeconds('09:00', '11:00'))->toBe(7200)
        ->and(Meeting::calculateDurationSeconds('09:21', '00:21'))->toBe(54000);
});

test('operator index pages enforce permission checks and block unauthorized roles', function () {
    /** @var TestCase $this */
    /** @var User $viewer */
    $viewer = User::factory()->create(['status' => 'aktif']);
    $viewer->assignRole('Viewer');

    /** @var User $humas */
    $humas = User::factory()->create(['status' => 'aktif']);
    $humas->assignRole('Bag. Humas');

    $this->actingAs($viewer)
        ->get(route('transcripts.index'))
        ->assertForbidden();

    $this->actingAs($viewer)
        ->get(route('attendances.index'))
        ->assertForbidden();

    $this->actingAs($humas)
        ->get(route('minutes.index'))
        ->assertForbidden();
});

test('public api attendance scan blocks deactivated users and unauthenticated pimpinan email spoofing', function () {
    /** @var TestCase $this */
    /** @var User $creator */
    $creator = User::factory()->create(['status' => 'aktif']);
    $creator->assignRole('Bag. Umum');

    /** @var User $deactivated */
    $deactivated = User::factory()->create(['status' => 'nonaktif']);
    $deactivated->assignRole('Viewer');

    /** @var User $pimpinan */
    $pimpinan = User::factory()->create(['status' => 'aktif', 'email' => 'rektor@umsu.ac.id']);
    $pimpinan->assignRole('Pimpinan');

    $meeting = Meeting::create([
        'title' => 'Rapat Senat',
        'date' => now()->toDateString(),
        'start_time' => '09:00:00',
        'end_time' => '11:00:00',
        'duration' => 7200,
        'location' => 'Aula',
        'type' => 'Rapat Pimpinan',
        'status' => 'berlangsung',
        'source' => 'manual',
        'created_by' => $creator->id,
        'current_stage' => 4,
    ]);

    $this->postJson("/api/meetings/{$meeting->id}/attendance/scan", [
        'user_id' => $deactivated->id,
    ])->assertForbidden();

    $this->postJson("/api/meetings/{$meeting->id}/attendance/scan", [
        'email' => $pimpinan->email,
    ])->assertForbidden();

    $this->postJson("/api/meetings/{$meeting->id}/attendance/scan", [
        'user_id' => $pimpinan->id,
    ])->assertForbidden();
});

test('viewer can view ongoing meetings and reports read-only while uninvited outsider without role is blocked and report search works on non-pgsql drivers', function () {
    /** @var TestCase $this */
    $disk = config('filesystems.default');
    Storage::fake($disk);

    /** @var User $creator */
    $creator = User::factory()->create(['status' => 'aktif']);
    $creator->assignRole('Bag. Umum');

    /** @var User $viewer */
    $viewer = User::factory()->create(['status' => 'aktif']);
    $viewer->assignRole('Viewer');

    /** @var User $outsider */
    $outsider = User::factory()->create(['status' => 'aktif']);

    $ongoingMeeting = Meeting::create([
        'title' => 'Rapat Rahasia Internal',
        'date' => now()->toDateString(),
        'start_time' => '09:00:00',
        'end_time' => '11:00:00',
        'duration' => 7200,
        'location' => 'Ruang Rapat',
        'type' => 'Rapat Pimpinan',
        'status' => 'berlangsung',
        'source' => 'manual',
        'created_by' => $creator->id,
        'current_stage' => 2,
    ]);

    $docPath = "documents/{$ongoingMeeting->id}/rahasia.pdf";
    Storage::disk($disk)->put($docPath, 'secret');

    $document = MeetingDocument::create([
        'meeting_id' => $ongoingMeeting->id,
        'file_path' => $docPath,
        'file_name' => 'rahasia.pdf',
        'file_size' => 6,
        'mime_type' => 'application/pdf',
        'category' => 'Lainnya',
        'uploaded_by' => $creator->id,
    ]);

    $approvedMeeting = Meeting::create([
        'title' => 'Rapat Publik Selesai',
        'date' => now()->toDateString(),
        'start_time' => '13:00:00',
        'end_time' => '14:00:00',
        'duration' => 3600,
        'location' => 'Aula',
        'type' => 'Rapat Koordinasi',
        'status' => 'selesai',
        'source' => 'manual',
        'created_by' => $creator->id,
        'current_stage' => 7,
    ]);

    MeetingMinute::create([
        'meeting_id' => $approvedMeeting->id,
        'status' => MeetingMinuteStatus::DISETUJUI->value,
        'content' => ['sections' => [['title' => 'Hasil', 'content' => 'Notulen disahkan.']]],
    ]);

    // Uninvited user without Viewer/operator roles is blocked from ongoing meeting views & documents
    $this->actingAs($outsider)->get(route('meetings.show', $ongoingMeeting))->assertForbidden();
    $this->actingAs($outsider)->get(route('meetings.recording', $ongoingMeeting))->assertForbidden();
    $this->actingAs($outsider)->get(route('meetings.approval', $ongoingMeeting))->assertForbidden();
    $this->actingAs($outsider)->get(route('meetings.documents.download', [$ongoingMeeting, $document]))->assertForbidden();

    // Viewer can view ongoing and finished meetings read-only (like Pimpinan without mutating actions)
    $this->actingAs($viewer)->get(route('meetings.show', $ongoingMeeting))->assertOk();
    $this->actingAs($viewer)->get(route('meetings.documents.download', [$ongoingMeeting, $document]))->assertOk();
    $this->actingAs($viewer)->post(route('meetings.approval.store', $ongoingMeeting), ['decision' => 'approved'])->assertForbidden();

    // Index & Reports search work cleanly on SQLite and expose meetings to Viewer read-only
    $this->actingAs($viewer)
        ->get(route('meetings.index', ['search' => 'Rapat']))
        ->assertOk()
        ->assertSee('Rapat Rahasia Internal')
        ->assertSee('Rapat Publik Selesai');

    $this->actingAs($viewer)
        ->get(route('reports.index', ['search' => 'Rapat']))
        ->assertOk()
        ->assertSee('Rapat Rahasia Internal')
        ->assertSee('Rapat Publik Selesai');

    $this->actingAs($creator)
        ->get(route('reports.index', ['search' => 'Rahasia']))
        ->assertOk()
        ->assertSee('Rapat Rahasia Internal');
});

test('irvan-cloud:sync artisan command resolves SyncMeetingsAction cleanly', function () {
    /** @var TestCase $this */
    config(['services.absensi.url' => 'https://absensi.example.test']);

    Http::fake([
        'absensi.example.test/api/event*' => Http::response(['data' => ['page_data' => []]], 200),
    ]);

    $this->artisan('irvan-cloud:sync')->assertExitCode(0);
});

test('trust proxies resolves forwarded client ip behind production reverse proxy', function () {
    /** @var TestCase $this */
    $proxyResponse = $this->withServerVariables(['REMOTE_ADDR' => '172.18.0.5'])
        ->withHeaders(['X-Forwarded-For' => '198.51.100.9'])
        ->get(route('login'));
    $proxyResponse->assertOk();
    expect(request()->ip())->toBe('198.51.100.9');
});

test('deactivated users are blocked from passkey login and api access', function () {
    /** @var TestCase $this */
    /** @var User $inactiveUser */
    $inactiveUser = User::factory()->create(['status' => 'nonaktif']);
    /** @var User $activeUser */
    $activeUser = User::factory()->create(['status' => 'aktif']);

    $inactivePasskey = new Passkey;
    $inactivePasskey->setRelation('user', $inactiveUser);

    $activePasskey = new Passkey;
    $activePasskey->setRelation('user', $activeUser);

    expect(Passkeys::allowsLogin(request(), $inactivePasskey))->toBeFalse()
        ->and(Passkeys::allowsLogin(request(), $activePasskey))->toBeTrue();

    $this->actingAs($inactiveUser)
        ->getJson('/api/meetings')
        ->assertForbidden();
});

test('administrator cannot escalate rbac permissions or delete core roles and horizon denies pimpinan', function () {
    /** @var TestCase $this */
    /** @var User $admin */
    $admin = User::factory()->create(['status' => 'aktif']);
    $admin->assignRole('Administrator');

    /** @var User $pimpinan */
    $pimpinan = User::factory()->create(['status' => 'aktif']);
    $pimpinan->assignRole('Pimpinan');

    $superAdminRole = Role::query()->where('name', '=', 'Super Admin')->firstOrFail();
    $viewerRole = Role::query()->where('name', '=', 'Viewer')->firstOrFail();

    /** @var User $superAdmin */
    $superAdmin = User::factory()->create(['status' => 'aktif']);
    $superAdmin->assignRole('Super Admin');

    expect(Gate::forUser($pimpinan)->allows('viewHorizon'))->toBeFalse()
        ->and(Gate::forUser($admin)->allows('viewHorizon'))->toBeTrue()
        ->and(Gate::forUser($superAdmin)->allows('viewHorizon'))->toBeTrue();

    $this->actingAs($admin)
        ->put(route('configuration.role-permissions.update', $superAdminRole), [
            'permissions' => ['meeting.read'],
        ])
        ->assertForbidden();

    $this->actingAs($admin)
        ->put(route('configuration.role-permissions.update', $viewerRole), [
            'permissions' => ['meeting.read', 'role_permission.update'],
        ])
        ->assertForbidden();

    $this->actingAs($admin)
        ->put(route('configuration.user-permissions.update', $admin), [
            'permissions' => ['user_permission.update'],
        ])
        ->assertForbidden();

    $this->actingAs($admin)
        ->put(route('configuration.user-permissions.update', $superAdmin), [
            'permissions' => ['meeting.read'],
        ])
        ->assertForbidden();

    $this->actingAs($admin)
        ->delete(route('configuration.roles.destroy', $viewerRole))
        ->assertForbidden();

    $this->actingAs($admin)
        ->get(route('configuration.role-permissions.index', ['role_id' => 'not-a-uuid']))
        ->assertOk();

    $this->actingAs($admin)
        ->get(route('configuration.user-permissions.index', ['user_id' => 'not-a-uuid']))
        ->assertOk();
});

test('attendance scan blocks guest_name bypass, omits pii when unauthenticated, enforces optional scanner key, and signed web qr works', function () {
    /** @var TestCase $this */
    /** @var User $creator */
    $creator = User::factory()->create(['status' => 'aktif']);
    $creator->assignRole('Bag. Umum');

    /** @var User $pimpinan */
    $pimpinan = User::factory()->create(['status' => 'aktif', 'email' => 'pimpinan.qr@umsu.ac.id']);
    $pimpinan->assignRole('Pimpinan');

    /** @var User $staff */
    $staff = User::factory()->create(['status' => 'aktif', 'email' => 'staf.qr@umsu.ac.id', 'department' => 'BAAK']);
    $staff->assignRole('Viewer');

    $meeting = Meeting::create([
        'title' => 'Rapat QR Keamanan',
        'date' => now()->toDateString(),
        'start_time' => '09:00:00',
        'end_time' => '11:00:00',
        'duration' => 7200,
        'location' => 'Aula',
        'type' => 'Rapat Koordinasi',
        'status' => 'berlangsung',
        'source' => 'manual',
        'created_by' => $creator->id,
        'current_stage' => 4,
    ]);

    // Email + non-empty guest_name cannot bypass Pimpinan protection
    $this->postJson("/api/meetings/{$meeting->id}/attendance/scan", [
        'email' => $pimpinan->email,
        'guest_name' => 'Samaran',
    ])->assertForbidden();

    // Unauthenticated API scan omits PII fields (email, user_id, department)
    $scanResponse = $this->postJson("/api/meetings/{$meeting->id}/attendance/scan", [
        'email' => strtoupper($staff->email),
    ])->assertOk();

    expect($scanResponse->json('data'))->not->toHaveKeys(['email', 'user_id', 'department']);

    // Optional SCANNER_API_KEY requires matching header when set
    config(['services.scanner.api_key' => 'secret-scanner-123']);

    $this->postJson("/api/meetings/{$meeting->id}/attendance/scan", [
        'user_id' => $staff->id,
    ])->assertUnauthorized();

    $this->withHeaders(['X-Scanner-Key' => 'secret-scanner-123'])
        ->postJson("/api/meetings/{$meeting->id}/attendance/scan", [
            'user_id' => $staff->id,
        ])->assertOk();

    config(['services.scanner.api_key' => null]);

    // Unsigned web GET scan is rejected; signed URL succeeds without leaking participants
    $this->actingAs($staff)
        ->get(route('meetings.attendance.scan', $meeting))
        ->assertForbidden();

    $signedUrl = URL::signedRoute('meetings.attendance.scan', ['meeting' => $meeting->id]);
    $this->actingAs($staff)
        ->get($signedUrl)
        ->assertOk();
});

test('uninvited custom role cannot mutate meetings via idor, creator can view own meeting, and approved minutes cannot be reopened or mutated', function () {
    /** @var TestCase $this */
    /** @var User $customCreator */
    $customCreator = User::factory()->create(['status' => 'aktif']);
    $customCreator->givePermissionTo(['meeting.create', 'meeting.read', 'minute.update']);

    /** @var User $otherCustom */
    $otherCustom = User::factory()->create(['status' => 'aktif']);
    $otherCustom->givePermissionTo(['minute.update', 'attendance.update', 'transcript.update', 'recording.create']);

    /** @var User $pimpinan */
    $pimpinan = User::factory()->create(['status' => 'aktif']);
    $pimpinan->assignRole('Pimpinan');

    $meeting = Meeting::create([
        'title' => 'Rapat Custom Role',
        'date' => now()->toDateString(),
        'start_time' => '09:00:00',
        'end_time' => '11:00:00',
        'duration' => 7200,
        'location' => 'Ruang Custom',
        'type' => 'Rapat Internal',
        'status' => 'berlangsung',
        'source' => 'manual',
        'created_by' => $customCreator->id,
        'current_stage' => 5,
    ]);

    MeetingMinute::create([
        'meeting_id' => $meeting->id,
        'status' => MeetingMinuteStatus::REVIEW->value,
        'content' => ['sections' => [['title' => 'Isi', 'content' => 'Awal']]],
    ]);

    // Creator can view their own meeting without being in seeded roles or participants
    $this->actingAs($customCreator)
        ->get(route('meetings.show', $meeting))
        ->assertOk();

    // Uninvited other custom role gets 403 IDOR block on stage mutation routes
    $this->actingAs($otherCustom)->put(route('meetings.review.update', $meeting), ['content' => ['sections' => []]])->assertForbidden();
    $this->actingAs($otherCustom)->post(route('meetings.review.send', $meeting))->assertForbidden();
    $this->actingAs($otherCustom)->post(route('meetings.correction.finish', $meeting))->assertForbidden();
    $this->actingAs($otherCustom)->post(route('meetings.attendance.finish', $meeting))->assertForbidden();
    $this->actingAs($otherCustom)->postJson(route('meetings.recording.stopSession', $meeting))->assertForbidden();

    // Viewer cannot invoke auto-sync
    /** @var User $viewer */
    $viewer = User::factory()->create(['status' => 'aktif']);
    $viewer->assignRole('Viewer');
    $this->actingAs($viewer)->postJson(route('meetings.auto-sync'))->assertForbidden();

    // Move to approval -> approve -> cannot reject or mutate afterwards
    $this->actingAs($customCreator)->post(route('meetings.review.send', $meeting))->assertRedirect();

    Storage::fake(config('filesystems.default'));
    $this->actingAs($pimpinan)
        ->post(route('meetings.approval.store', $meeting), [
            'decision' => 'approved',
            'notes' => 'Sah',
        ])
        ->assertRedirect(route('dashboard'));

    $this->actingAs($pimpinan)
        ->post(route('meetings.approval.store', $meeting), [
            'decision' => 'rejected',
            'notes' => 'Reopen',
        ])
        ->assertForbidden();

    $this->actingAs($customCreator)
        ->put(route('meetings.review.update', $meeting), ['content' => ['sections' => []]])
        ->assertStatus(422);
});
