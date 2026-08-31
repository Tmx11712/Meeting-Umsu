<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $title
 * @property string|null $description
 * @property string $date
 * @property string $start_time
 * @property string $end_time
 * @property int $duration
 * @property string $location
 * @property string $type
 * @property string|null $notes
 * @property string $status
 * @property string $created_by
 * @property int $current_stage
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property CarbonImmutable|null $deleted_at
 * @property string $source
 * @property string|null $external_id
 * @property CarbonImmutable|null $recording_started_at
 * @property string $category
 * @property-read Collection<int, MeetingActionItem> $actionItems
 * @property-read int|null $action_items_count
 * @property-read MeetingApproval|null $approval
 * @property-read Collection<int, MeetingAttendance> $attendances
 * @property-read int|null $attendances_count
 * @property-read User $createdBy
 * @property-read Collection<int, MeetingDocument> $documents
 * @property-read int|null $documents_count
 * @property-read mixed $agenda
 * @property-read mixed $attendance_rate
 * @property-read mixed $duration_formatted
 * @property-read Collection<int, MeetingMinute> $minutes
 * @property-read int|null $minutes_count
 * @property-read Collection<int, MeetingParticipant> $participants
 * @property-read int|null $participants_count
 * @property-read Collection<int, MeetingRecording> $recordings
 * @property-read int|null $recordings_count
 * @property-read Collection<int, MeetingTranscript> $transcripts
 * @property-read int|null $transcripts_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereCurrentStage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereEndTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereExternalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereRecordingStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereSource($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Meeting withoutTrashed()
 * @mixin \Eloquent
 */
class Meeting extends Model
{
    /**
     * [EDUKASI ARSITEKTUR: ELOQUENT ORM & RELATIONSHIPS]
     * Kelas Model ini adalah representasi dari tabel `meetings` di database.
     * Fungsi-fungsi di bawah seperti `participants()`, `recordings()`, dll adalah definisi Relasi (Relationships).
     * Dengan mendefinisikan relasi ini, kita bisa mengambil data peserta rapat dengan sangat mudah:
     * `$meeting->participants` (tanpa perlu menulis query SQL JOIN manual secara panjang lebar).
     */
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'date',
        'start_time',
        'end_time',
        'duration',
        'location',
        'type',
        'category',
        'notes',
        'status',
        'source',
        'external_id',
        'created_by',
        'current_stage',
        'recording_started_at',
    ];

    protected $casts = [
        'recording_started_at' => 'datetime',
    ];

    protected $appends = [
        'agenda',
    ];

    public function getAgendaAttribute()
    {
        if ($this->notes) {
            $decoded = json_decode($this->notes, true);
            if (is_array($decoded) && isset($decoded['agenda'])) {
                return $decoded['agenda'];
            }
        }

        return [];
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function participants()
    {
        return $this->hasMany(MeetingParticipant::class);
    }

    public function recordings()
    {
        return $this->hasMany(MeetingRecording::class);
    }

    public function transcripts()
    {
        return $this->hasMany(MeetingTranscript::class);
    }

    public function attendances()
    {
        return $this->hasMany(MeetingAttendance::class);
    }

    public function minutes()
    {
        return $this->hasMany(MeetingMinute::class);
    }

    public function actionItems()
    {
        return $this->hasMany(MeetingActionItem::class);
    }

    public function documents()
    {
        return $this->hasMany(MeetingDocument::class);
    }

    public function approval()
    {
        return $this->hasOne(MeetingApproval::class);
    }

    public function getAttendanceRateAttribute()
    {
        $total = $this->attendances->count();
        if ($total === 0) {
            return 0;
        }

        $present = $this->attendances->whereIn('status', ['hadir', 'terlambat'])->count();

        return round(($present / $total) * 100);
    }

    public function getDurationFormattedAttribute()
    {
        $seconds = $this->duration;

        if (! $seconds && $this->start_time && $this->end_time) {
            $seconds = max(0, strtotime($this->end_time) - strtotime($this->start_time));
        }

        if (! $seconds) {
            return '00:00:00';
        }

        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds / 60) % 60);
        $seconds = $seconds % 60;

        return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
    }
}
