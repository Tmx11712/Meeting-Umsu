<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $meeting_id
 * @property string $file_path
 * @property string $file_name
 * @property int $file_size
 * @property string $mime_type
 * @property string $category
 * @property string|null $uploaded_by
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Meeting|null $meeting
 * @property-read \App\Models\User|null $uploadedBy
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingDocument newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingDocument newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingDocument query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingDocument whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingDocument whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingDocument whereFileName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingDocument whereFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingDocument whereFileSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingDocument whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingDocument whereMeetingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingDocument whereMimeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingDocument whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingDocument whereUploadedBy($value)
 * @mixin \Eloquent
 */
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
