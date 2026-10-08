<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingTranscriptionChunk extends Model
{
    use HasFactory;

    protected $fillable = [
        'recording_id',
        'chunk_index',
        'start_seconds',
        'end_seconds',
        'normal_end_seconds',
        'file_path',
        'status',
        'attempts',
        'error_message',
        'completed_at',
    ];

    protected $casts = [
        'start_seconds' => 'float',
        'end_seconds' => 'float',
        'normal_end_seconds' => 'float',
        'chunk_index' => 'integer',
        'attempts' => 'integer',
        'completed_at' => 'datetime',
    ];

    public function recording()
    {
        return $this->belongsTo(MeetingRecording::class, 'recording_id');
    }

    public function transcripts()
    {
        return $this->hasMany(MeetingTranscript::class, 'chunk_id');
    }
}
