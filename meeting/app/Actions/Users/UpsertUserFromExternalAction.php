<?php

namespace App\Actions\Users;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UpsertUserFromExternalAction
{
    /**
     * Get or create a user based on external participant data.
     *
     * @param array $participantData
     * @return User|null
     */
    public function execute(array $participantData): ?User
    {
        if (empty($participantData['email'])) {
            return null;
        }

        $user = User::where('email', $participantData['email'])->first();
        
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
        } else if (!empty($participantData['nip']) && empty($user->nip)) {
            $user->update(['nip' => $participantData['nip']]);
        }

        return $user;
    }
}
