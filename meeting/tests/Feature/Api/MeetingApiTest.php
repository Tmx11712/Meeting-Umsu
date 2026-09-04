<?php

use App\Models\Meeting;
use App\Models\User;
use Tests\TestCase;

test('can retrieve meeting schedule via api', function () {
    /** @var TestCase $this */
    $user = User::factory()->create();

    $meeting = Meeting::create([
        'title' => 'Rapat Evaluasi Semester',
        'date' => '2026-09-10',
        'start_time' => '09:00',
        'end_time' => '11:00',
        'location' => 'Ruang Rapat',
        'type' => 'offline',
        'created_by' => $user->id,
    ]);

    // Test ambil daftar rapat
    $this->getJson('/api/meetings')
        ->assertOk()
        ->assertJsonPath('statusCode', 200)
        ->assertJsonPath('data.0.title', 'Rapat Evaluasi Semester');

    // Test ambil detail 1 rapat
    $this->getJson("/api/meetings/{$meeting->id}")
        ->assertOk()
        ->assertJsonPath('statusCode', 200)
        ->assertJsonPath('data.id', $meeting->id);
});
