<?php

namespace App\Rules;

use App\Models\Team;
use App\Models\TeamInvitation;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class UniqueTeamInvitation implements ValidationRule
{
    public function __construct(protected Team $team)
    {
        //
    }

    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $email = strtolower($value);

        $isMember = $this->team->members()
            ->whereRaw('LOWER(email) = ?', [$email], 'and')
            ->exists();

        if ($isMember) {
            $fail(__('This user is already a member of the team.'));

            return;
        }

        $hasPendingInvitation = TeamInvitation::query()->where('team_id', '=', $this->team->id)
            ->whereRaw('LOWER(email) = ?', [$email], 'and')
            ->whereNull('accepted_at', 'and', false)
            ->where(function ($query) {
                $query->whereNull('expires_at', 'and', false)
                    ->orWhere('expires_at', '>', now());
            })
            ->exists();

        if ($hasPendingInvitation) {
            $fail(__('An invitation has already been sent to this email address.'));
        }
    }
}
