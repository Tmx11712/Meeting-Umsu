<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $menus = [
            [
                'name' => 'Dashboard',
                'route' => 'dashboard',
                'icon' => 'LayoutDashboard',
                'order' => 1,
                'status' => true
            ],
            [
                'name' => 'Jadwal Rapat',
                'route' => 'meetings.index',
                'icon' => 'CalendarDays',
                'order' => 2,
                'status' => true
            ],
            [
                'name' => 'Koreksi Transkrip',
                'route' => 'transcripts.index',
                'icon' => 'FileText',
                'order' => 3,
                'status' => true
            ],
            [
                'name' => 'Absensi',
                'route' => 'attendances.index',
                'icon' => 'Users',
                'order' => 4,
                'status' => true
            ],
            [
                'name' => 'Notulen',
                'route' => 'minutes.index',
                'icon' => 'BookOpen',
                'order' => 5,
                'status' => true
            ],
            [
                'name' => 'Laporan',
                'route' => 'reports.index',
                'icon' => 'PieChart',
                'order' => 6,
                'status' => true
            ],
            [
                'name' => 'Configuration',
                'route' => 'configuration.index',
                'icon' => 'Settings',
                'order' => 7,
                'status' => true
            ],
        ];

        foreach ($menus as $menuData) {
            Menu::firstOrCreate(['name' => $menuData['name']], $menuData);
        }
    }
}
