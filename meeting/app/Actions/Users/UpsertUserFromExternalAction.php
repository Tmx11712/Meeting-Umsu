<?php

namespace App\Actions\Users;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
