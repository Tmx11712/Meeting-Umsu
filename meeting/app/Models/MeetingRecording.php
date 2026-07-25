<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingRecording extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'meeting_id',
        'file_path',
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
