<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Menu;
use App\Models\Role;
use App\Models\Permission;

echo "Cleaning up old menus...\n";
Menu::truncate();

$menus = [
    [
        'name' => 'Dashboard',
        'icon' => 'home',
        'route' => 'dashboard',
        'order' => 1,
        'status' => true,
    ],
    [
        'name' => 'Jadwal Rapat',
        'icon' => 'calendar',
        'route' => 'meetings.index',
        'order' => 2,
        'status' => true,
    ],
    [
        'name' => 'Pengaturan',
        'icon' => 'settings',
        'route' => 'configuration.index',
        'order' => 99,
        'status' => true,
    ],
];

foreach ($menus as $m) {
    Menu::create($m);
}

echo "Assigning permissions to menus...\n";

// Assign permissions
$dashboardMenu = Menu::where('route', 'dashboard')->first();
$rapatMenu = Menu::where('route', 'meetings.index')->first();
$pengaturanMenu = Menu::where('route', 'configuration.index')->first();

use Illuminate\Support\Facades\DB;

$roles = Role::all();
foreach ($roles as $role) {
    // Everyone gets dashboard and rapat
    DB::table('role_has_menus')->updateOrInsert(['menu_id' => $dashboardMenu->id, 'role_id' => $role->id]);
    DB::table('role_has_menus')->updateOrInsert(['menu_id' => $rapatMenu->id, 'role_id' => $role->id]);
    
    // Only Admins get pengaturan
    if (in_array($role->name, ['Super Admin', 'Administrator'])) {
        DB::table('role_has_menus')->updateOrInsert(['menu_id' => $pengaturanMenu->id, 'role_id' => $role->id]);
    }
}

echo "Menus updated successfully! Sidebar is now clean.\n";
