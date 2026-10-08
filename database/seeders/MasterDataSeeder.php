<?php

namespace Database\Seeders;

use App\Models\MeetingRoom;
use App\Models\MeetingType;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            'Rapat internal',
            'Rapat Resmi',
            'Rapat Rutin',
            'Rapat Koordinasi',
            'Rapat Persiapan',
        ];

        foreach ($types as $type) {
            MeetingType::firstOrCreate(['name' => $type]);
        }

        $rooms = [
            'Ruangan VIP lantai 2 gedung rektor',
            'Ruangan Rapat Lantai 3 Gedung Rektor',
            'ruangan Work of fame',
        ];

        foreach ($rooms as $room) {
            MeetingRoom::firstOrCreate(['name' => $room]);
        }
    }
}
