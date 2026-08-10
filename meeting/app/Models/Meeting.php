<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Meeting extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'date',
        'start_time',
        'end_time',
        'duration',
        'location',
        'type',
        'notes',
        'status',
        'source',
        'external_id',
        'created_by',
        'current_stage',
        'recording_started_at',
    ];

    protected $casts = [
        'recording_started_at' => 'datetime',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function participants()
    {
        return $this->hasMany(MeetingParticipant::class);
    }

    public function recordings()
    {
        return $this->hasMany(MeetingRecording::class);
    }

    public function transcripts()
    {
        return $this->hasMany(MeetingTranscript::class);
    }

    public function attendances()
    {
        return $this->hasMany(MeetingAttendance::class);
    }

    public function minutes()
    {
        return $this->hasMany(MeetingMinute::class);
    }

    public function actionItems()
    {
        return $this->hasMany(MeetingActionItem::class);
    }

    public function documents()
    {
        return $this->hasMany(MeetingDocument::class);
    }

    public function approval()
    {
        return $this->hasOne(MeetingApproval::class);
    }

    public function getAttendanceRateAttribute()
    {
        $total = $this->attendances()->count();
        if ($total === 0) {
            return 0;
        }

        $present = $this->attendances()->whereIn('status', ['hadir', 'terlambat'])->count();

        return round(($present / $total) * 100);
    }

    public function getDurationFormattedAttribute()
    {
        $seconds = $this->duration;

        if (! $seconds && $this->start_time && $this->end_time) {
            $seconds = max(0, strtotime($this->end_time) - strtotime($this->start_time));
        }

        if (! $seconds) {
            return '00:00:00';
        }

        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds / 60) % 60);
        $seconds = $seconds % 60;

        return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
    }
}
