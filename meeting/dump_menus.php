<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

foreach(\App\Models\Menu::with('roles')->get() as $m) {
    echo $m->name . ' - ' . $m->route . ' : ' . $m->roles->pluck('name')->join(', ') . "\n";
}
