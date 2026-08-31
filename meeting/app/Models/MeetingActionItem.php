<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $meeting_id
 * @property string|null $minute_id
 * @property string $description
 * @property string $pic
 * @property \Carbon\CarbonImmutable|null $deadline
 * @property string $status
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Meeting|null $meeting
 * @property-read \App\Models\MeetingMinute|null $minute
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingActionItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingActionItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingActionItem query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingActionItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingActionItem whereDeadline($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingActionItem whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingActionItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingActionItem whereMeetingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingActionItem whereMinuteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingActionItem wherePic($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingActionItem whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingActionItem whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class MeetingActionItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'meeting_id',
        'minute_id',
        'description',
        'pic',
        'deadline',
        'status',
    ];

    protected $casts = [
        'deadline' => 'date',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function minute()
    {
        return $this->belongsTo(MeetingMinute::class, 'minute_id');
    }
}
