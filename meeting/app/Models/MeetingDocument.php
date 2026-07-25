<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingDocument extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'meeting_id',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
        'category',
        'uploaded_by',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
