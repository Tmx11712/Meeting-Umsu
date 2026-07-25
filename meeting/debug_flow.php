<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Meeting;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use App\Services\IrvanCloudSyncService;
use Illuminate\Http\UploadedFile;

echo "=== STARTING E2E DEBUG FLOW ===\n";

// 1. Get our users
$humasUser = User::whereHas('roles', function($q) { $q->where('name', 'Bag. Humas'); })->first();
$umumUser = User::whereHas('roles', function($q) { $q->where('name', 'Bag. Umum'); })->first();
$pimpinanUser = User::whereHas('roles', function($q) { $q->where('name', 'Pimpinan'); })->first();

if (!$humasUser || !$umumUser || !$pimpinanUser) {
    die("Error: Missing required users. Did you run the seeders?\n");
}
echo "[OK] Found users: Humas({$humasUser->name}), Umum({$umumUser->name}), Pimpinan({$pimpinanUser->name})\n";

// 2. Sync meeting from Irvan Cloud
echo "\n--- 1. SYNC IRVAN CLOUD ---\n";
try {
    $service = new IrvanCloudSyncService();
    $result = $service->syncMeetings();
    echo "[OK] Sync Result: " . $result['message'] . "\n";
} catch (\Exception $e) {
    echo "[!] Sync Failed: " . $e->getMessage() . "\n";
}

$meeting = Meeting::where('source', 'irvan_cloud')->where('current_stage', 1)->first();
if (!$meeting) {
    die("Error: No fresh meeting found to test!\n");
}
echo "[OK] Target Meeting: {$meeting->title} (ID: {$meeting->id}) - Stage: {$meeting->current_stage}\n";

// Helper function to simulate HTTP POST request as a specific user
function simulatePostAs($user, $uri, $data = [], $files = []) {
    $app = app();
    
    // Disable CSRF for testing
    $app->instance(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class, new class { 
        public function handle($request, $next) { return $next($request); }
    });
    
    $request = Illuminate\Http\Request::create($uri, 'POST', $data, [], $files);
    $app->make('auth')->login($user);
    $response = $app->handle($request);
    return $response;
}

// 3. Humas records audio and finishes
echo "\n--- 2. HUMAS: REKAMAN ---\n";
echo "Attempting to upload recording as Humas...\n";
$dummyFile = UploadedFile::fake()->create('dummy.mp3', 100, 'audio/mpeg');
$resp = simulatePostAs($humasUser, "/meetings/{$meeting->id}/recording", [
    'source' => 'upload'
], ['file' => $dummyFile]);

echo "[HTTP {$resp->getStatusCode()}]\n";
if ($resp->getStatusCode() !== 200) { echo "Failed: " . $resp->getContent() . "\n"; die(); }

$meeting->refresh();
echo "[STATUS] Current Stage is now: {$meeting->current_stage} (Expected: 3)\n";
if ($meeting->current_stage !== 3) die("Validation failed at stage 3.\n");

// 4. Humas/Umum corrects transcript
echo "\n--- 3. UMUM/HUMAS: KOREKSI ---\n";
// Create a dummy transcript to correct
$transcript = clone $meeting->transcripts()->create([
    'text' => 'Ini teks asli',
    'timestamp_seconds' => 10,
    'sequence_order' => 1,
    'recording_id' => $meeting->recordings()->first()->id ?? null
]);
$resp = simulatePostAs($umumUser, "/meetings/{$meeting->id}/correction", [
    'transcript_id' => $transcript->id,
    'original_text' => 'Ini teks asli',
    'corrected_text' => 'Ini teks yg sudah dikoreksi'
]);
echo "[HTTP {$resp->getStatusCode()}] Correction save\n";

$resp = simulatePostAs($umumUser, "/meetings/{$meeting->id}/correction/finish");
echo "[HTTP {$resp->getStatusCode()}] Correction finish\n";
$meeting->refresh();
echo "[STATUS] Current Stage is now: {$meeting->current_stage} (Expected: 4)\n";
if ($meeting->current_stage !== 4) die("Validation failed at stage 4.\n");

// 5. Umum sets attendance
echo "\n--- 4. UMUM: ABSENSI ---\n";
$resp = simulatePostAs($umumUser, "/meetings/{$meeting->id}/attendance/manual", [
    'user_id' => $humasUser->id,
    'status' => 'hadir'
]);
echo "[HTTP {$resp->getStatusCode()}] Attendance manual\n";

$resp = simulatePostAs($umumUser, "/meetings/{$meeting->id}/attendance/finish");
echo "[HTTP {$resp->getStatusCode()}] Attendance finish\n";
$meeting->refresh();
echo "[STATUS] Current Stage is now: {$meeting->current_stage} (Expected: 5)\n";
if ($meeting->current_stage !== 5) die("Validation failed at stage 5.\n");

// 6. Umum reviews minute
echo "\n--- 5. UMUM: NOTULENSI ---\n";
// Create dummy minute since we skipped AI generation
$meeting->minutes()->create([
    'content' => ['summary' => 'Dummy'],
    'status' => 'draft'
]);
$resp = simulatePostAs($umumUser, "/meetings/{$meeting->id}/review/send");
echo "[HTTP {$resp->getStatusCode()}] Review finish\n";
$meeting->refresh();
echo "[STATUS] Current Stage is now: {$meeting->current_stage} (Expected: 6)\n";
if ($meeting->current_stage !== 6) die("Validation failed at stage 6.\n");

// 7. Pimpinan approves
echo "\n--- 6. PIMPINAN: PERSETUJUAN ---\n";
$resp = simulatePostAs($pimpinanUser, "/meetings/{$meeting->id}/approval", [
    'status' => 'disetujui',
    'feedback' => 'Bagus sekali',
    'signature_data' => 'dummy_signature_base64_data_here'
]);
echo "[HTTP {$resp->getStatusCode()}] Approval finish\n";
$meeting->refresh();
echo "[STATUS] Current Stage is now: {$meeting->current_stage} (Expected: 7)\n";
if ($meeting->current_stage !== 7) die("Validation failed at stage 7.\n");

echo "\n=== ALL TESTS PASSED SUCCESSFULLY! ===\n";
