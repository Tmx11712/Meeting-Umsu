<?php

use App\Enums\TeamRole;
use App\Models\Meeting;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

test('guests are redirected to the login page', function () {
    /** @var TestCase $this */
    /** @var User $user */
    $user = User::factory()->create();
    $team = $user->currentTeam;

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    /** @var TestCase $this */
    /** @var User $user */
    $user = User::factory()->create();
    $team = $user->currentTeam;

    $response = $this
        ->actingAs($user)
        ->get(route('dashboard'));

    $response->assertOk();
});

test('dashboard includes pending invitations for the authenticated user', function () {
    /** @var TestCase $this */
    /** @var User $owner */
    $owner = User::factory()->create(['name' => 'Taylor Otwell']);
    /** @var User $invitedUser */
    $invitedUser = User::factory()->create(['email' => 'invited@example.com']);
    $team = Team::factory()->create(['name' => 'Laravel Team']);

    $team->members()->attach($owner, ['role' => TeamRole::Owner->value]);

    $invitation = TeamInvitation::factory()->create([
        'team_id' => $team->id,
        'email' => 'invited@example.com',
        'invited_by' => $owner->id,
    ]);

    $response = $this
        ->actingAs($invitedUser)
        ->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->has('pendingInvitations', 1)
        ->where('pendingInvitations.0.code', $invitation->code)
        ->where('pendingInvitations.0.inviterName', 'Taylor Otwell')
        ->where('pendingInvitations.0.team.name', 'Laravel Team')
        ->where('pendingInvitations.0.team.slug', $team->slug)
        ->missing('pendingInvitations.0.teamName'),
    );
});

test('dashboard does not include accepted invitations', function () {
    /** @var TestCase $this */
    /** @var User $owner */
    $owner = User::factory()->create();
    /** @var User $invitedUser */
    $invitedUser = User::factory()->create(['email' => 'invited@example.com']);
    $team = Team::factory()->create();

    $team->members()->attach($owner, ['role' => TeamRole::Owner->value]);

    TeamInvitation::factory()->accepted()->create([
        'team_id' => $team->id,
        'email' => 'invited@example.com',
        'invited_by' => $owner->id,
    ]);

    $response = $this
        ->actingAs($invitedUser)
        ->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->has('pendingInvitations', 0),
    );
});

test('dashboard excludes expired invitations without deleting them', function () {
    /** @var TestCase $this */
    /** @var User $owner */
    $owner = User::factory()->create();
    /** @var User $invitedUser */
    $invitedUser = User::factory()->create(['email' => 'invited@example.com']);
    $team = Team::factory()->create();

    $team->members()->attach($owner, ['role' => TeamRole::Owner->value]);

    $invitation = TeamInvitation::factory()->expired()->create([
        'team_id' => $team->id,
        'email' => 'invited@example.com',
        'invited_by' => $owner->id,
    ]);

    $response = $this
        ->actingAs($invitedUser)
        ->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->has('pendingInvitations', 0),
    );

    $this->assertDatabaseHas('team_invitations', [
        'id' => $invitation->id,
    ]);
});

test('dashboard does not include or delete other users invitations', function () {
    /** @var TestCase $this */
    /** @var User $owner */
    $owner = User::factory()->create();
    /** @var User $invitedUser */
    $invitedUser = User::factory()->create(['email' => 'invited@example.com']);
    $team = Team::factory()->create();

    $team->members()->attach($owner, ['role' => TeamRole::Owner->value]);

    $invitation = TeamInvitation::factory()->expired()->create([
        'team_id' => $team->id,
        'email' => 'someone@example.com',
        'invited_by' => $owner->id,
    ]);

    $response = $this
        ->actingAs($invitedUser)
        ->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->has('pendingInvitations', 0),
    );

    $this->assertDatabaseHas('team_invitations', [
        'id' => $invitation->id,
    ]);
});

test('dashboard caches todayMeetings and upcomingMeetings as plain arrays so second load does not lose meetings', function () {
    /** @var TestCase $this */
    /** @var User $user */
    $user = User::factory()->create();

    Meeting::create([
        'title' => 'Rapat Testing Hari Ini',
        'date' => now()->toDateString(),
        'start_time' => '12:00:00',
        'end_time' => '14:00:00',
        'duration' => 7200,
        'location' => 'Ruang VIP',
        'type' => 'Rapat Koordinasi',
        'status' => 'berlangsung',
        'source' => 'manual',
        'created_by' => $user->id,
        'current_stage' => 2,
    ]);

    // First load (populates cache)
    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('todayMeetings', 1)
            ->where('todayMeetings.0.title', 'Rapat Testing Hari Ini'),
        );

    // Verify cached value contains no PHP objects (safe with serializable_classes = false)
    $cached = cache()->get('dashboard_today_meetings_v2');
    expect($cached)->toBeArray()
        ->and($cached[0])->toBeArray();
});
