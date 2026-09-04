<?php

use App\Models\Meeting;
use App\Models\Role;
use App\Models\User;
use Tests\TestCase;

test('can create a manual meeting via api without auth using default super admin as creator', function () {
    /** @var TestCase $this */
    $adminRole = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole($adminRole);

    $payload = [
        'title' => 'Rapat Koordinasi Evaluasi Semester Ganjil',
        'description' => 'Rapat pembahasan kurikulum dan evaluasi',
        'date' => '2026-09-10',
        'start_time' => '09:00',
        'end_time' => '11:00',
        'location' => 'Ruang Rapat VIP Gedung Rektorat Lt. 3',
        'type' => 'offline',
        'category' => 'Akademik',
        'agenda' => [
            'Pembahasan kurikulum baru',
            'Evaluasi dosen pengampu',
        ],
    ];

    $response = $this->postJson('/api/meetings', $payload);

    $response->assertStatus(201)
        ->assertJsonPath('statusCode', 201)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.title', 'Rapat Koordinasi Evaluasi Semester Ganjil')
        ->assertJsonPath('data.name', 'Rapat Koordinasi Evaluasi Semester Ganjil')
        ->assertJsonPath('data.source', 'manual')
        ->assertJsonPath('data.status', 'terjadwal')
        ->assertJsonPath('data.current_stage', 1)
        ->assertJsonPath('data.created_by.id', $superAdmin->id);

    $this->assertDatabaseHas('meetings', [
        'title' => 'Rapat Koordinasi Evaluasi Semester Ganjil',
        'source' => 'manual',
        'status' => 'terjadwal',
        'current_stage' => 1,
        'created_by' => $superAdmin->id,
    ]);
});

test('can create meeting using exact Irvan Cloud format with name, event_date and null times', function () {
    /** @var TestCase $this */
    $adminRole = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'Viewer', 'guard_name' => 'web']);
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole($adminRole);

    $irvanCloudPayload = [
        'name' => 'Serah Terima Aplikasi UMSU Press',
        'description' => 'Serah Terima Aplikasi UMSU Press',
        'type' => 'offline',
        'location' => 'Perpustakaan Kampus Utama',
        'event_date' => '2026-05-25',
        'start_time' => null,
        'end_time' => null,
        'uuid' => 'ffacdef0-5ab8-4ba0-9cae-e9e73afeda13',
        'participants' => [
            [
                'email' => 'august.ivan20@gmail.com',
                'fullname' => 'August Ivan',
                'scanned_at' => '2026-05-25T09:53:32.000Z',
            ],
            [
                'email' => 'arizkymuhammad46@gmail.com',
                'fullname' => 'M. Arizki',
            ],
        ],
    ];

    $response = $this->postJson('/api/meetings', $irvanCloudPayload);

    $response->assertStatus(201)
        ->assertJsonPath('statusCode', 201)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.name', 'Serah Terima Aplikasi UMSU Press')
        ->assertJsonPath('data.uuid', 'ffacdef0-5ab8-4ba0-9cae-e9e73afeda13')
        ->assertJsonPath('data.event_date', '2026-05-25')
        ->assertJsonPath('data.location', 'Perpustakaan Kampus Utama')
        ->assertJsonPath('data.start_time', '08:00')
        ->assertJsonPath('data.end_time', '10:00');

    $this->assertDatabaseHas('meetings', [
        'title' => 'Serah Terima Aplikasi UMSU Press',
        'date' => '2026-05-25',
        'location' => 'Perpustakaan Kampus Utama',
        'external_id' => 'ffacdef0-5ab8-4ba0-9cae-e9e73afeda13',
    ]);

    $this->assertDatabaseHas('users', [
        'email' => 'august.ivan20@gmail.com',
    ]);
});

test('validates required fields when creating a meeting via api', function () {
    /** @var TestCase $this */
    $response = $this->postJson('/api/meetings', []);

    // Since defaults apply to time & location, title & date are strictly required
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['title', 'date']);
});

test('can list meetings via api', function () {
    /** @var TestCase $this */
    $user = User::factory()->create();
    Meeting::create([
        'title' => 'Rapat Listing 1',
        'location' => 'Ruang 1',
        'type' => 'offline',
        'date' => '2026-09-10',
        'start_time' => '09:00',
        'end_time' => '10:00',
        'created_by' => $user->id,
        'source' => 'manual',
        'status' => 'terjadwal',
        'current_stage' => 1,
    ]);

    $response = $this->getJson('/api/meetings');

    $response->assertStatus(200)
        ->assertJsonPath('statusCode', 200)
        ->assertJsonStructure([
            'statusCode',
            'success',
            'data' => [
                '*' => ['id', 'uuid', 'name', 'title', 'event_date', 'date', 'start_time', 'end_time', 'status', 'source'],
            ],
        ]);
});

test('can show a meeting detail via api', function () {
    /** @var TestCase $this */
    $user = User::factory()->create();
    $meeting = Meeting::create([
        'title' => 'Rapat Khusus Dekanat',
        'location' => 'Ruang Rapat Dekanat',
        'type' => 'offline',
        'date' => '2026-09-12',
        'start_time' => '13:00',
        'end_time' => '14:30',
        'created_by' => $user->id,
        'source' => 'manual',
        'status' => 'terjadwal',
        'current_stage' => 1,
    ]);

    $response = $this->getJson("/api/meetings/{$meeting->id}");

    $response->assertStatus(200)
        ->assertJsonPath('statusCode', 200)
        ->assertJsonPath('data.id', $meeting->id)
        ->assertJsonPath('data.name', 'Rapat Khusus Dekanat');
});

test('works with v1 prefix as well', function () {
    /** @var TestCase $this */
    $user = User::factory()->create();
    $meeting = Meeting::create([
        'title' => 'Rapat Prefix v1',
        'location' => 'Ruang Rapat v1',
        'type' => 'offline',
        'date' => '2026-09-12',
        'start_time' => '13:00',
        'end_time' => '14:30',
        'created_by' => $user->id,
        'source' => 'manual',
        'status' => 'terjadwal',
        'current_stage' => 1,
    ]);

    $response = $this->getJson("/api/v1/meetings/{$meeting->id}");

    $response->assertStatus(200)
        ->assertJsonPath('statusCode', 200)
        ->assertJsonPath('data.name', 'Rapat Prefix v1');
});

test('updates existing meeting instead of creating duplicate if uuid matches', function () {
    /** @var TestCase $this */
    $user = User::factory()->create();
    $existing = Meeting::create([
        'title' => 'Rapat Lama',
        'location' => 'Ruang 1',
        'type' => 'offline',
        'date' => '2026-09-01',
        'start_time' => '08:00',
        'end_time' => '10:00',
        'external_id' => 'my-unique-uuid-123',
        'created_by' => $user->id,
        'source' => 'irvan_cloud',
        'status' => 'terjadwal',
        'current_stage' => 1,
    ]);

    $payload = [
        'name' => 'Rapat Diperbarui',
        'uuid' => 'my-unique-uuid-123',
        'event_date' => '2026-09-05',
    ];

    $response = $this->postJson('/api/meetings', $payload);

    $response->assertStatus(201);

    // Ensure count of meetings with this external_id is still exactly 1
    $this->assertSame(1, Meeting::query()->where('external_id', '=', 'my-unique-uuid-123', 'and')->count('*'));

    $this->assertDatabaseHas('meetings', [
        'id' => $existing->id,
        'title' => 'Rapat Diperbarui',
        'external_id' => 'my-unique-uuid-123',
        'date' => '2026-09-05',
    ]);
});
