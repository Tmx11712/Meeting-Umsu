<?php

namespace App\Actions\Users;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * [EDUKASI ARSITEKTUR: UPSERT USER DARI SUMBER EKSTERNAL]
 * Action ini bertugas mencari atau membuat akun User berdasarkan data dari Irvan Cloud.
 *
 * Logika "Upsert" yang digunakan:
 * 1. Cari user di database lokal berdasarkan email dari data Irvan Cloud.
 * 2. Jika sudah ada → kembalikan user yang sudah ada (tidak buat baru, tidak duplikat).
 * 3. Jika belum ada → buat akun baru secara otomatis dengan password acak.
 *
 * Pola ini sering dipakai untuk integrasi antar sistem (SSO/Single Sign-On sederhana).
 */
class UpsertUserFromExternalAction
{
    /**
     * Get or create a user based on external participant data.
     */
    public function execute(array $participantData): ?User
    {
        if (empty($participantData['email'])) {
            return null;
        }

        $user = User::query()->where('email', '=', $participantData['email'])->first();

        if (! $user) {
            $fullname = $participantData['fullname'] ?? explode('@', $participantData['email'])[0];
            $user = User::create([
                'name' => $fullname,
                'email' => $participantData['email'],
                'password' => Hash::make('password123'), // Default password
                'nip' => $participantData['nip'] ?? null,
                'department' => 'Umum', // Default fallback
                'position' => 'Staff',
                'phone' => null,
                'is_active' => true,
            ]);
            // Assign Viewer role
            $user->assignRole('Viewer');
        } elseif (! empty($participantData['nip']) && empty($user->nip)) {
            $user->fill(['nip' => $participantData['nip']])->save();
        }

        return $user;
    }
}
