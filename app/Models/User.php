<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Concerns\HasTeams;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password', 'username', 'initials', 'status', 'department', 'current_team_id'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /**
     * [EDUKASI ARSITEKTUR: ELOQUENT TRAITS]
     * Traits (seperti `HasRoles`, `HasUuids`) adalah cara PHP mendaur ulang fungsi yang sering digunakan
     * di banyak tempat tanpa harus melakukan "Pewarisan/Inheritance" berlapis.
     * Kode `HasTeams::teams insteadof HasRoles` adalah cara Laravel mengatasi "konflik" jika ada dua trait
     * yang kebetulan memiliki nama fungsi yang persis sama.
     *
     * @use HasFactory<UserFactory>
     */
    use HasFactory, HasRoles, HasTeams, HasUuids, \Illuminate\Database\Eloquent\SoftDeletes, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable {
        HasTeams::teams insteadof HasRoles;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
