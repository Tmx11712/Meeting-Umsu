<?php

use App\Models\Meeting;
use App\Models\User;

test('can record attendance for a registered user via scan api', function () {
    $creator = User::factory()->create();
    $participant = User::factory()->create(['name' => 'Dr. Budi', 'email' => 'budi@umsu.ac.id']);

    $meeting = Meeting::create([
        'title' => 'Rapat Senat Akademik',
        'date' => now()->toDateString(),
        'start_time' => '08:00',
        'end_time' => '12:00',
        'location' => 'Gedung Rektorat',
        'type' => 'offline',
        'created_by' => $creator->id,
    ]);

    $response = $this->postJson("/api/meetings/{$meeting->id}/attendance/scan", [
        'email' => 'budi@umsu.ac.id',
    ]);

    $response->assertOk()
        ->assertJsonPath('statusCode', 200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.name', 'Dr. Budi')
        ->assertJsonPath('data.is_guest', false);

    $this->assertDatabaseHas('meeting_attendances', [
        'meeting_id' => $meeting->id,
        'user_id' => $participant->id,
    ]);

    $this->assertDatabaseHas('meeting_participants', [
        'meeting_id' => $meeting->id,
        'user_id' => $participant->id,
    ]);
});

test('can record attendance for an external guest via scan api', function () {
    $creator = User::factory()->create();

    $meeting = Meeting::create([
        'title' => 'Sosialisasi Kerja Sama',
        'date' => now()->toDateString(),
        'start_time' => '09:00',
        'end_time' => '11:00',
        'location' => 'Auditorium',
        'type' => 'offline',
        'created_by' => $creator->id,
    ]);

    $response = $this->postJson("/api/meetings/{$meeting->id}/attendance/scan", [
        'guest_name' => 'Ahmad Tamu',
        'guest_institution' => 'Mitra Industri',
        'notes' => 'Hadir mewakili direksi',
    ]);

    $response->assertOk()
        ->assertJsonPath('statusCode', 200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.name', 'Ahmad Tamu')
        ->assertJsonPath('data.guest_institution', 'Mitra Industri')
        ->assertJsonPath('data.is_guest', true);

    $this->assertDatabaseHas('meeting_attendances', [
        'meeting_id' => $meeting->id,
        'guest_name' => 'Ahmad Tamu',
        'guest_institution' => 'Mitra Industri',
    ]);
});

test('can retrieve attendance recap and list via api', function () {
    $creator = User::factory()->create();
    $participant = User::factory()->create(['name' => 'Dosen Satu']);

    $meeting = Meeting::create([
        'title' => 'Rapat Fakultas',
        'date' => now()->toDateString(),
        'start_time' => '10:00',
        'end_time' => '12:00',
        'location' => 'Ruang 101',
        'type' => 'offline',
        'created_by' => $creator->id,
    ]);

    $this->postJson("/api/meetings/{$meeting->id}/attendance/scan", [
        'user_id' => $participant->id,
    ])->assertOk();

    $response = $this->getJson("/api/meetings/{$meeting->id}/attendance");

    $response->assertOk()
        ->assertJsonPath('statusCode', 200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('summary.total_participants', 1)
        ->assertJsonPath('data.0.name', 'Dosen Satu');
});
