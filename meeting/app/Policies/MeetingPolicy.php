<?php

namespace App\Policies;

use App\Models\Meeting;
use App\Models\User;

class MeetingPolicy
{
    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): ?bool
    {
        // Super Admin selalu bisa melakukan apa saja
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('meeting.view');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Meeting $meeting): bool
    {
        return $user->can('meeting.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('meeting.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Meeting $meeting): bool
    {
        // Harus punya izin global DAN merupakan pembuat rapat tersebut
        return $user->can('meeting.update') && $user->id === $meeting->created_by;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Meeting $meeting): bool
    {
        return $user->can('meeting.delete') && $user->id === $meeting->created_by;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Meeting $meeting): bool
    {
        return $user->can('meeting.restore') && $user->id === $meeting->created_by;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Meeting $meeting): bool
    {
        return false;
    }
}
