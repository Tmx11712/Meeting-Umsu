<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Contracts\User as SocialiteUserContract;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse;

use function Pest\Laravel\assertAuthenticated;
use function Pest\Laravel\assertGuest;
use function Pest\Laravel\get;

it('redirects to google oauth', function () {
    $redirectMock = Mockery::mock(RedirectResponse::class);
    Socialite::shouldReceive('driver->stateless->redirect')->once()->andReturn($redirectMock);

    get('/auth/google');
});

it('creates a new user with Viewer role and personal team on first google login', function () {
    Role::firstOrCreate(['name' => 'Viewer', 'guard_name' => 'web']);

    $abstractUser = Mockery::mock(SocialiteUserContract::class);
    $abstractUser->shouldReceive('getId')->andReturn('google-12345');
    $abstractUser->shouldReceive('getName')->andReturn('User Baru');
    $abstractUser->shouldReceive('getEmail')->andReturn('userbaru@gmail.com');

    Socialite::shouldReceive('driver->stateless->user')->once()->andReturn($abstractUser);

    $response = get('/auth/google/callback');

    $response->assertRedirect('/dashboard');
    assertAuthenticated();

    $user = User::query()->where('email', '=', 'userbaru@gmail.com')->firstOrFail();
    expect($user->google_id)->toBe('google-12345')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($user->current_team_id)->not->toBeNull()
        ->and($user->hasRole('Viewer'))->toBeTrue();
});

it('links google_id to existing user and preserves their role', function () {
    $role = Role::firstOrCreate(['name' => 'Bag. Umum', 'guard_name' => 'web']);
    /** @var User $existing */
    $existing = User::factory()->create([
        'email' => 'pegawai@gmail.com',
        'status' => 'aktif',
    ]);
    $existing->assignRole($role);

    $abstractUser = Mockery::mock(SocialiteUserContract::class);
    $abstractUser->shouldReceive('getId')->andReturn('google-99999');
    $abstractUser->shouldReceive('getName')->andReturn('Pegawai');
    $abstractUser->shouldReceive('getEmail')->andReturn('pegawai@gmail.com');

    Socialite::shouldReceive('driver->stateless->user')->once()->andReturn($abstractUser);

    $response = get('/auth/google/callback');

    $response->assertRedirect('/dashboard');
    assertAuthenticated();
    expect(Auth::id())->toBe($existing->id);

    $existing->refresh();
    expect($existing->google_id)->toBe('google-99999')
        ->and($existing->hasRole('Bag. Umum'))->toBeTrue();
});

it('rejects google login for nonaktif user', function () {
    User::factory()->create([
        'email' => 'suspended@gmail.com',
        'status' => 'nonaktif',
    ]);

    $abstractUser = Mockery::mock(SocialiteUserContract::class);
    $abstractUser->shouldReceive('getId')->andReturn('google-blocked');
    $abstractUser->shouldReceive('getName')->andReturn('Suspended User');
    $abstractUser->shouldReceive('getEmail')->andReturn('suspended@gmail.com');

    Socialite::shouldReceive('driver->stateless->user')->once()->andReturn($abstractUser);

    $response = get('/auth/google/callback');

    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors('email');
    assertGuest();
});
