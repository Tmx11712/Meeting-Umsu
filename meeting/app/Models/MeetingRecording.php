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
        'label',
        'file_size',
        'duration_seconds',
        'source',
        'status',
        'recorded_by',
        'openai_model_used',
    ];

    protected static function booted()
    {
        static::deleting(function ($model) {
            $disk = config('filesystems.default');
            if ($model->file_path) {
                \Illuminate\Support\Facades\Storage::disk($disk)->delete($model->file_path);
            }
            // Hapus folder chunks milik recording ini jika ada
            \Illuminate\Support\Facades\Storage::disk($disk)->deleteDirectory("meetings/{$model->meeting_id}/recordings/{$model->id}");
        });
    }

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
