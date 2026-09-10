<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    protected static function booted()
    {
        static::saved(function ($model) {
            cache()->forget('dashboard_stats');
        });

        static::deleted(function ($model) {
            cache()->forget('dashboard_stats');
        });
    }

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function minute()
    {
        return $this->belongsTo(MeetingMinute::class, 'minute_id');
    }
}
