<?php

namespace Tests\Feature;

use App\Models\Meeting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Tests\TestCase;

class EndToEndMeetingFlowTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true;

    public function test_entire_meeting_flow()
    {
        $this->seed();

        // Find users
        $humasUser = User::whereHas('roles', function ($q) {
            $q->where('name', 'Bag. Humas');
        })->first();
        $umumUser = User::whereHas('roles', function ($q) {
            $q->where('name', 'Bag. Umum');
        })->first();
        $pimpinanUser = User::whereHas('roles', function ($q) {
            $q->where('name', 'Pimpinan');
        })->first();

        $this->assertNotNull($humasUser, 'Missing Humas user');
        $this->assertNotNull($umumUser, 'Missing Umum user');
        $this->assertNotNull($pimpinanUser, 'Missing Pimpinan user');

        // Create a dummy meeting
        $meeting = Meeting::create([
            'title' => 'Test Rapat E2E '.time(),
            'description' => 'Rapat debug otomatis',
            'date' => date('Y-m-d'),
            'start_time' => '09:00:00',
            'end_time' => '11:00:00',
            'location' => 'Ruang Rapat Test',
            'type' => 'internal',
            'status' => 'belum_mulai',
            'source' => 'irvan_cloud',
            'external_id' => Str::uuid()->toString(),
            'current_stage' => 1,
            'created_by' => $umumUser->id,
        ]);

        $meeting->participants()->createMany([
            ['user_id' => $humasUser->id],
            ['user_id' => $umumUser->id],
            ['user_id' => $pimpinanUser->id],
        ]);

        $this->assertEquals(1, $meeting->current_stage);

        // 1. Humas Records
        $dummyFile = UploadedFile::fake()->create('dummy.mp3', 100, 'audio/mpeg');
        $response = $this->actingAs($humasUser)->post("/meetings/{$meeting->id}/recording", [
            'source' => 'upload',
            'file' => $dummyFile,
        ]);
        $response->assertStatus(200);

        $response = $this->actingAs($humasUser)->post("/meetings/{$meeting->id}/finish-recording");
        $response->assertRedirect();

        $meeting->refresh();
        $this->assertEquals(3, $meeting->current_stage);

        // 2. Umum Corrects
        $recording = $meeting->recordings()->first();
        $transcript = $meeting->transcripts()->create([
            'text' => 'Ini teks asli',
            'timestamp_seconds' => 10,
            'sequence_order' => 1,
            'recording_id' => $recording->id ?? null,
        ]);

        $response = $this->actingAs($umumUser)->post("/meetings/{$meeting->id}/correction", [
            'transcript_id' => $transcript->id,
            'original_text' => 'Ini teks asli',
            'corrected_text' => 'Ini teks yg sudah dikoreksi',
        ]);
        $response->assertRedirect(); // should be 302 back

        $response = $this->actingAs($umumUser)->post("/meetings/{$meeting->id}/correction/finish");
        $response->assertRedirect(); // should be 302 to attendance/review

        $meeting->refresh();
        $this->assertEquals(5, $meeting->current_stage);

        // 3. Umum sets Attendance
        $response = $this->actingAs($umumUser)->post("/meetings/{$meeting->id}/attendance/manual", [
            'user_id' => $humasUser->id,
            'status' => 'hadir',
        ]);
        $response->assertRedirect();

        $response = $this->actingAs($umumUser)->post("/meetings/{$meeting->id}/attendance/finish");
        $response->assertRedirect();

        $meeting->refresh();
        $this->assertEquals(5, $meeting->current_stage);

        // 4. Umum Reviews Minute
        $meeting->minutes()->create([
            'content' => ['summary' => 'Dummy Summary'],
            'status' => 'draft',
        ]);
        $response = $this->actingAs($umumUser)->post("/meetings/{$meeting->id}/review/send");
        $response->assertRedirect();

        $meeting->refresh();
        $this->assertEquals(6, $meeting->current_stage);

        // 5. Pimpinan Approves
        $response = $this->actingAs($pimpinanUser)->post("/meetings/{$meeting->id}/approval", [
            'decision' => 'approved',
            'notes' => 'Bagus sekali',
            'signature_data' => 'dummy_base64_sig',
        ]);
        $response->assertRedirect();

        $meeting->refresh();
        $this->assertEquals(7, $meeting->current_stage);

        // Pass
        $this->assertTrue(true);
    }
}
