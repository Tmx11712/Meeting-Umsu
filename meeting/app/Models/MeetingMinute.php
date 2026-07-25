<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingMinute extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'meeting_id',
        'content',
        'ai_topics_count',
        'ai_decisions_count',
        'ai_summary_generated_at',
        'version',
        'status',
        'reviewed_by',
        'reviewed_at',
        'review_notes',
    ];

    protected $casts = [
        'content' => 'array',
        'ai_summary_generated_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function actionItems()
    {
        return $this->hasMany(MeetingActionItem::class, 'minute_id');
    }
}
