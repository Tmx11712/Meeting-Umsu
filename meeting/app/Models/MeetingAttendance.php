<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $meeting_id
 * @property string|null $user_id
 * @property string $status
 * @property \Carbon\CarbonImmutable|null $check_in_time
 * @property string|null $method
 * @property string|null $recorded_by
 * @property string|null $notes
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property \Carbon\CarbonImmutable|null $check_out_time
 * @property string|null $guest_name
 * @property string|null $guest_email
 * @property string|null $guest_institution
 * @property-read \App\Models\Meeting|null $meeting
 * @property-read \App\Models\User|null $recordedBy
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance whereCheckInTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance whereCheckOutTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance whereGuestEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance whereGuestInstitution($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance whereGuestName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance whereMeetingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance whereMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance whereRecordedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAttendance whereUserId($value)
 * @mixin \Eloquent
 */
class MeetingAttendance extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'meeting_id',
        'user_id',
        'guest_name',
        'guest_email',
        'guest_institution',
        'status',
        'check_in_time',
        'check_out_time',
        'method',
        'recorded_by',
        'notes',
    ];

    protected $casts = [
        'check_in_time' => 'datetime',
        'check_out_time' => 'datetime',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
