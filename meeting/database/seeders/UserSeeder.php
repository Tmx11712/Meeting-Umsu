<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Actions\Teams\CreateTeam;
use App\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Budi Wibowo',
                'email' => 'budi.wibowo@enotulen.com',
                'username' => 'budiwibowo',
                'department' => 'Pimpinan',
                'initials' => 'BW',
                'role' => 'Pimpinan'
            ],
            [
                'name' => 'Siti Rahayu',
                'email' => 'siti.rahayu@enotulen.com',
                'username' => 'sitirahayu',
                'department' => 'Keuangan',
                'initials' => 'SR',
                'role' => 'Viewer'
            ],
            [
                'name' => 'Andi Pratama',
                'email' => 'andi.pratama@enotulen.com',
                'username' => 'andipratama',
                'department' => 'Marketing',
                'initials' => 'AP',
                'role' => 'Viewer'
            ],
            [
                'name' => 'Rina Kartika',
                'email' => 'rina.kartika@enotulen.com',
                'username' => 'rinakartika',
                'department' => 'Product',
                'initials' => 'RK',
                'role' => 'Viewer'
            ],
            [
                'name' => 'Dimas Aditama',
                'email' => 'dimas.aditama@enotulen.com',
                'username' => 'dimasaditama',
                'department' => 'Operasional',
                'initials' => 'DA',
                'role' => 'Viewer'
            ],
            [
                'name' => 'Admin Utama',
                'email' => 'admin.utama@enotulen.com',
                'username' => 'adminutama',
                'department' => 'Super Admin',
                'initials' => 'AU',
                'role' => 'Super Admin'
            ],
            [
                'name' => 'Bag. Umum',
                'email' => 'bag.umum@enotulen.com',
                'username' => 'bagumum',
                'department' => 'Bag. Umum',
                'initials' => 'BU',
                'role' => 'Bag. Umum'
            ],
            [
                'name' => 'Bag. Humas',
                'email' => 'bag.humas@enotulen.com',
                'username' => 'baghumas',
                'department' => 'Bag. Humas',
                'initials' => 'BH',
                'role' => 'Bag. Humas'
            ],
            [
                'name' => 'Andini Putri',
                'email' => 'andini.putri@enotulen.com',
                'username' => 'andiniputri',
                'department' => 'IT Admin',
                'initials' => 'AP',
                'role' => 'Administrator'
            ],
        ];

        $createTeam = app(CreateTeam::class);

        foreach ($users as $userData) {
            $roleName = $userData['role'];
            unset($userData['role']);
            
            $userData['password'] = Hash::make('password123');
            $userData['status'] = 'aktif';
            $userData['email_verified_at'] = now();

            $user = User::firstOrCreate(['email' => $userData['email']], $userData);

            if (!$user->currentTeam) {
                $createTeam->handle($user, $user->name . "'s Team", isPersonal: true);
            }

            if (!$user->hasRole($roleName)) {
                $user->assignRole($roleName);
            }
        }
    }
}
