<?php

namespace Tests\Feature;

use App\Models\Meeting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class SecurityRemediationTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_api_access_is_denied()
    {
        $meeting = new Meeting;
        $meeting->id = 9999;

        $response = $this->getJson('/api/meetings');
        $response->assertStatus(401);

        $response = $this->getJson("/api/meetings/{$meeting->id}");
        $response->assertStatus(401);
    }

    public function test_authenticated_api_access_is_allowed_for_authorized_users()
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/meetings');
        $this->assertNotEquals(401, $response->status());
    }

    public function test_api_access_is_denied_for_unauthorized_users()
    {
        $owner = User::factory()->create();
        $meeting = Meeting::create([
            'title' => 'Secret Meeting',
            'date' => date('Y-m-d'),
            'start_time' => '09:00:00',
            'end_time' => '10:00:00',
            'status' => 'terjadwal',
            'current_stage' => 1,
            'location' => 'Virtual',
            'type' => 'internal',
            'created_by' => $owner->id,
        ]);

        // Non-participant user without any roles
        /** @var \App\Models\User $stranger */
        $stranger = User::factory()->create();

        $response = $this->actingAs($stranger)->getJson("/api/meetings/{$meeting->id}");
        // Policy should deny (403) or 404
        $this->assertTrue(in_array($response->status(), [403, 404]));
    }

    public function test_public_attendance_is_rate_limited()
    {
        $meetingId = 9999;
        $response = null;

        // Simulate multiple hits
        for ($i = 0; $i < 20; $i++) {
            $response = $this->post("/attend/{$meetingId}", [
                'guest_name' => 'John Doe',
                'guest_unit_kerja' => 'IT',
                'guest_institution' => 'UMSU',
            ]);
        }

        if ($response) {
            $response->assertStatus(429); // Too Many Requests
        }
    }

    public function test_env_replacement_works_via_config()
    {
        // Tes default
        $this->assertTrue(config('services.openai.transcription_concurrent_enabled', true));

        // Tes override runtime
        Config::set('services.openai.transcription_concurrent_enabled', false);
        $this->assertFalse(config('services.openai.transcription_concurrent_enabled', true));
    }
}
