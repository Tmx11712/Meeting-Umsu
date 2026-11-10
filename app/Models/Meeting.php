<?php

namespace App\Models;

use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        'ai_status',
    ];

    protected $casts = [
        'recording_started_at' => 'datetime',
    ];

    protected $appends = [
        'agenda',
    ];

    protected static function booted()
    {
        static::deleting(function ($model) {
            // Hard delete related records so they don't persist or reappear when restored by sync
            $model->actionItems()->delete();
            $model->approval()->delete();
            $model->attendances()->delete();

            // Delete documents physically
            $model->documents->each(function ($doc) {
                $doc->delete();
            });

            $model->minutes()->delete();
            $model->participants()->delete();

            // Delete recordings physically
            $model->recordings->each(function ($recording) {
                $recording->delete();
            });

            $model->transcripts()->delete();

            // Cleanup residual meeting directories in Storage
            $disk = config('filesystems.default');
            $slug = Str::slug($model->title) ?: 'rapat';
            Storage::disk($disk)->deleteDirectory("meetings/{$model->id}");
            Storage::disk($disk)->deleteDirectory("recordings/{$model->id}-{$slug}");
            Storage::disk($disk)->deleteDirectory("notulen/{$model->id}-{$slug}");
        });

        static::saved(function ($model) {
            cache()->forget('dashboard_stats');
            cache()->forget('dashboard_stats_v2');
            cache()->forget('dashboard_today_meetings');
            cache()->forget('dashboard_upcoming_meetings');
            cache()->forget('dashboard_today_meetings_v2');
            cache()->forget('dashboard_upcoming_meetings_v2');
        });

        static::deleted(function ($model) {
            cache()->forget('dashboard_stats');
            cache()->forget('dashboard_stats_v2');
            cache()->forget('dashboard_today_meetings');
            cache()->forget('dashboard_upcoming_meetings');
            cache()->forget('dashboard_today_meetings_v2');
            cache()->forget('dashboard_upcoming_meetings_v2');
        });
    }

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
        return $this->hasMany(MeetingTranscript::class)
            ->orderBy('timestamp_seconds', 'asc')
            ->orderBy('sequence_order', 'asc');
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
        $participantsCount = $this->participants->count();
        $guestsCount = $this->attendances->whereNull('user_id')->count();
        $totalTarget = $participantsCount > 0 ? ($participantsCount + $guestsCount) : $this->attendances->count();

        if ($totalTarget === 0) {
            return 0;
        }

        $present = $this->attendances->whereIn('status', ['hadir', 'terlambat'])->count();

        return min(100, (int) round(($present / $totalTarget) * 100));
    }

    public static function calculateDurationSeconds(string $startTime, string $endTime): int
    {
        $start = Carbon::parse($startTime);
        $end = Carbon::parse($endTime);

        if ($end->lessThan($start)) {
            $end->addDay();
        }

        return (int) $start->diffInSeconds($end);
    }

    /**
     * @param  Builder<self>  $query
     * @param  array{search?: string|null, status?: string|null, month?: string|null}  $filters
     * @return Builder<self>
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        if (! empty($filters['search'])) {
            $escaped = addcslashes((string) $filters['search'], '%_\\');
            $query->where('title', 'ilike', '%'.$escaped.'%');
        }

        if (! empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', '=', $filters['status']);
        }

        if (! empty($filters['month']) && $filters['month'] !== 'all') {
            if (str_contains((string) $filters['month'], '-')) {
                [$year, $month] = explode('-', (string) $filters['month'], 2);
                $query->whereYear('date', $year)->whereMonth('date', $month);
            } else {
                $query->whereMonth('date', $filters['month']);
            }
        }

        return $query;
    }

    public function resolveParticipantsCount(): self
    {
        $manualCount = 0;

        if ($this->relationLoaded('minutes') && $this->minutes && $this->minutes->isNotEmpty()) {
            $content = $this->minutes->first()->content;
            if (is_string($content)) {
                $content = json_decode($content, true);
            }
            if (is_array($content) && isset($content['peserta_rapat']) && is_array($content['peserta_rapat'])) {
                $manualCount = count($content['peserta_rapat']);
            }
        }

        $this->participants_count = max($this->participants_count ?? 0, $manualCount);
        $this->unsetRelation('minutes');

        return $this;
    }

    public function getDurationFormattedAttribute()
    {
        $seconds = (int) $this->duration;

        if ($seconds <= 0 && $this->start_time && $this->end_time) {
            $seconds = self::calculateDurationSeconds($this->start_time, $this->end_time);
        }

        if ($seconds <= 0) {
            return '00:00:00';
        }

        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds / 60) % 60);
        $seconds = $seconds % 60;

        return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
    }

    public function getPdfStoragePath(): string
    {
        $slug = Str::slug($this->title) ?: 'rapat';

        return "notulen/{$this->id}-{$slug}/Notulen_{$slug}.pdf";
    }

    public function storeApprovedPdf(): string
    {
        $this->load('minutes.actionItems', 'participants.user');

        $pdfOutput = Pdf::loadView('pdf.notulen', [
            'meeting' => $this,
            'isDraft' => false,
        ])->output();

        $disk = config('filesystems.default');
        $path = $this->getPdfStoragePath();
        Storage::disk($disk)->put($path, $pdfOutput);

        return $path;
    }

    public function purgeRawRecordingsAndTranscripts(): void
    {
        $this->loadMissing('recordings');

        $recordedDuration = (int) $this->recordings->sum('duration_seconds');
        if ($recordedDuration > 0 && $this->duration !== $recordedDuration) {
            $this->forceFill(['duration' => $recordedDuration])->saveQuietly();
        }

        if ($this->recordings->isNotEmpty()) {
            MeetingRecording::destroy($this->recordings->pluck('id')->all());
        }

        $this->transcripts()->delete();

        $disk = config('filesystems.default');
        $slug = Str::slug($this->title) ?: 'rapat';
        Storage::disk($disk)->deleteDirectory("recordings/{$this->id}");
        Storage::disk($disk)->deleteDirectory("recordings/{$this->id}-{$slug}");
        Storage::disk($disk)->deleteDirectory("meetings/{$this->id}/recordings");
    }
}
