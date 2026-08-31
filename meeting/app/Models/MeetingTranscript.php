<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $meeting_id
 * @property string $recording_id
 * @property int $timestamp_seconds
 * @property string|null $speaker
 * @property string $text
 * @property bool $is_live
 * @property int $sequence_order
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MeetingTranscriptCorrection> $corrections
 * @property-read int|null $corrections_count
 * @property-read \App\Models\Meeting|null $meeting
 * @property-read \App\Models\MeetingRecording $recording
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscript newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscript newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscript query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscript whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscript whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscript whereIsLive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscript whereMeetingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscript whereRecordingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscript whereSequenceOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscript whereSpeaker($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscript whereText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscript whereTimestampSeconds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscript whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class MeetingTranscript extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'meeting_id',
        'recording_id',
        'timestamp_seconds',
        'speaker',
        'text',
        'is_live',
        'sequence_order',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function recording()
    {
        return $this->belongsTo(MeetingRecording::class, 'recording_id');
    }

    public function corrections()
    {
        return $this->hasMany(MeetingTranscriptCorrection::class, 'transcript_id');
    }
}
