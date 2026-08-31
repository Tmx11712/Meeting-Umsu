<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $meeting_id
 * @property array<array-key, mixed>|null $content
 * @property int $ai_topics_count
 * @property int $ai_decisions_count
 * @property \Carbon\CarbonImmutable|null $ai_summary_generated_at
 * @property string $version
 * @property string $status
 * @property string|null $reviewed_by
 * @property \Carbon\CarbonImmutable|null $reviewed_at
 * @property string|null $review_notes
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MeetingActionItem> $actionItems
 * @property-read int|null $action_items_count
 * @property-read \App\Models\Meeting|null $meeting
 * @property-read \App\Models\User|null $reviewedBy
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute whereAiDecisionsCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute whereAiSummaryGeneratedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute whereAiTopicsCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute whereMeetingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute whereReviewNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute whereReviewedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute whereReviewedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingMinute whereVersion($value)
 * @mixin \Eloquent
 */
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
