<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $meeting_id
 * @property string $file_path
 * @property int $file_size
 * @property int $duration_seconds
 * @property string $source
 * @property string $status
 * @property string $recorded_by
 * @property string|null $openai_model_used
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property string|null $label
 * @property-read \App\Models\Meeting|null $meeting
 * @property-read \App\Models\User $recordedBy
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MeetingTranscript> $transcripts
 * @property-read int|null $transcripts_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording whereDurationSeconds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording whereFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording whereFileSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording whereLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording whereMeetingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording whereOpenaiModelUsed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording whereRecordedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording whereSource($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingRecording whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class MeetingRecording extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'meeting_id',
        'file_path',
        'label',
        'file_size',
        'duration_seconds',
        'source',
        'status',
        'recorded_by',
        'openai_model_used',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public function transcripts()
    {
        return $this->hasMany(MeetingTranscript::class, 'recording_id');
    }
}
