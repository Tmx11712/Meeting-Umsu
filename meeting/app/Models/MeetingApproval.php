<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $meeting_id
 * @property string $minute_id
 * @property string $approved_by
 * @property string $decision
 * @property string|null $notes
 * @property \Carbon\CarbonImmutable|null $decided_at
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\User $approvedBy
 * @property-read \App\Models\Meeting|null $meeting
 * @property-read \App\Models\MeetingMinute $minute
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingApproval newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingApproval newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingApproval query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingApproval whereApprovedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingApproval whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingApproval whereDecidedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingApproval whereDecision($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingApproval whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingApproval whereMeetingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingApproval whereMinuteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingApproval whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingApproval whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class MeetingApproval extends Model
{
    /**
     * [EDUKASI ARSITEKTUR: ELOQUENT MODEL & FOREIGN KEYS]
     * Kelas ini mengelola persetujuan notulensi rapat (Approval).
     * Field seperti 'meeting_id', 'minute_id', dan 'approved_by' adalah Foreign Keys (Kunci Asing) 
     * yang menghubungkan tabel ini dengan tabel lain di database.
     * Penggunaan model ini memastikan konsistensi data saat pimpinan menyetujui atau menolak notulensi.
     */
    use HasFactory, HasUuids;

    protected $fillable = [
        'meeting_id',
        'minute_id',
        'approved_by',
        'decision',
        'notes',
        'decided_at',
    ];

    protected $casts = [
        'decided_at' => 'datetime',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function minute()
    {
        return $this->belongsTo(MeetingMinute::class, 'minute_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
