<?php

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

test('sends verification notification', function () {
    /** @var TestCase $this */
    Notification::fake();

    /** @var User $user */
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->post(route('verification.send'))
        ->assertRedirect(route('home'));

    Notification::assertSentTo($user, VerifyEmail::class);
});

test('does not send verification notification if email is verified', function () {
    /** @var TestCase $this */
    Notification::fake();

    /** @var User $user */
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('verification.send'))
        ->assertRedirect('/dashboard');

    Notification::assertNothingSent();
});
