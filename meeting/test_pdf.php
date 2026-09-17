<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $meeting = \App\Models\Meeting::latest()->first();
    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.notulen', ['meeting' => $meeting, 'isDraft' => false]);
    $pdf->output();
    echo "OK\n";
} catch (\Throwable $e) {
    echo $e->getMessage() . " at " . $e->getFile() . ":" . $e->getLine() . "\n";
}
