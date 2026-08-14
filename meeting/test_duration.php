<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$m = App\Models\Meeting::latest()->first();
echo json_encode([
    'id' => $m->id,
    'duration' => $m->duration,
    'start' => $m->start_time,
    'end' => $m->end_time,
    'duration_formatted' => $m->duration_formatted,
    'recordings' => $m->recordings()->pluck('duration_seconds')
]);
