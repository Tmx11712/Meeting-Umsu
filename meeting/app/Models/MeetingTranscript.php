<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
