<?php

namespace App\Policies;

use App\Models\Meeting;
use App\Models\User;

/**
 * [EDUKASI ARSITEKTUR: POLICY (Otorisasi Level Model)]
 * Policy adalah cara Laravel yang "bersih" untuk memisahkan logika OTORISASI dari kode bisnis.
 *
 * Tanpa Policy, kita perlu menulis cek izin berulang di setiap method Controller:
 *   `if (!$user->can('meeting.view')) { abort(403); }`
 *
 * Dengan Policy, kita cukup panggil `$this->authorize('view', $meeting)` di Controller,
 * dan seluruh logika detailnya (siapa yang boleh, kondisinya apa) dipusatkan di sini.
 *
 * Perhatikan method `before()` yang memberikan bypass total untuk role 'Super Admin'.
 */
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
        if ($user->hasRole(['Super Admin', 'Administrator', 'Bag. Humas', 'Bag. Umum', 'Pimpinan'])) {
            return true;
        }

        // Jika tidak memiliki role global, harus merupakan participant dari meeting ini
        return $meeting->participants()->where('user_id', $user->id)->exists();
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
