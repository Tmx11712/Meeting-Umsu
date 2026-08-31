<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $transcript_id
 * @property string $original_text
 * @property string $corrected_text
 * @property string $corrected_by
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\User $correctedBy
 * @property-read \App\Models\MeetingTranscript $transcript
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscriptCorrection newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscriptCorrection newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscriptCorrection query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscriptCorrection whereCorrectedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscriptCorrection whereCorrectedText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscriptCorrection whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscriptCorrection whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscriptCorrection whereOriginalText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscriptCorrection whereTranscriptId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingTranscriptCorrection whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class MeetingTranscriptCorrection extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'transcript_id',
        'original_text',
        'corrected_text',
        'corrected_by',
    ];

    public function transcript()
    {
        return $this->belongsTo(MeetingTranscript::class, 'transcript_id');
    }

    public function correctedBy()
    {
        return $this->belongsTo(User::class, 'corrected_by');
    }
}
