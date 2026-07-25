<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
