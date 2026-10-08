<?php

namespace App\Actions\Fortify;

use App\Actions\Teams\CreateTeam;
use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

/**
 * [EDUKASI ARSITEKTUR: FORTIFY ACTION (Pembuatan User Baru)]
 * Class ini adalah "kontrak" yang dipanggil Fortify setiap kali ada registrasi user baru.
 *
 * Kita mengimplementasikan interface `CreatesNewUsers` agar kita bisa
 * mengkustomisasi logika registrasi (misalnya: wajib isi departemen, buat Team otomatis, dll)
 * tanpa harus mengubah kode inti Fortify.
 *
 * Ini adalah contoh penerapan "Open/Closed Principle" (Prinsip Terbuka/Tertutup):
 * kode Fortify TERTUTUP untuk diubah, namun TERBUKA untuk diekstensi melalui contract.
 */
class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    public function __construct(private CreateTeam $createTeam)
    {
        //
    }

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'username' => ['nullable', 'string', 'max:255', 'unique:users'],
            'password' => $this->passwordRules(),
        ])->validate();

        return DB::transaction(function () use ($input) {
            $words = explode(' ', $input['name']);
            $initials = '';
            foreach ($words as $word) {
                $initials .= strtoupper(substr($word, 0, 1));
                if (strlen($initials) >= 2) {
                    break;
                }
            }

            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'username' => $input['username'] ?? null,
                'initials' => $initials,
                'status' => 'aktif',
                'password' => $input['password'],
            ]);

            $this->createTeam->handle($user, $user->name."'s Team", isPersonal: true);

            // Assign default role if needed, or handled via seeder/admin.
            return $user;
        });
    }
}
