<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * [EDUKASI ARSITEKTUR: DATABASE SEEDING]
     * Seeder adalah cara Laravel untuk memasukkan data awal (dummy/master data) ke dalam database secara otomatis.
     * Alih-alih melakukan INSERT manual via SQL (yang rentan lupa saat pindah server),
     * kita mendefinisikannya di sini. Saat kita jalankan `php artisan db:seed`, Laravel akan mengeksekusi
     * urutan seeder di bawah ini (Roles, lalu Menu, lalu User).
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            MenuSeeder::class,
            UserSeeder::class,
        ]);
    }
}
