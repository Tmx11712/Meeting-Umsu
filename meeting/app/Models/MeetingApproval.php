<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingApproval extends Model
{
    /**
     * [EDUKASI ARSITEKTUR: ELOQUENT MODEL & FOREIGN KEYS]
     * Kelas ini mengelola persetujuan notulensi rapat (Approval).
     * Field seperti 'meeting_id', 'minute_id', dan 'approved_by' adalah Foreign Keys (Kunci Asing)
     * yang menghubungkan tabel ini dengan tabel lain di database.
     * Penggunaan model ini memastikan konsistensi data saat pimpinan menyetujui atau menolak notulensi.
     */
    use HasFactory, HasUuids;

    protected $fillable = [
        'meeting_id',
        'minute_id',
        'approved_by',
        'decision',
        'notes',
        'decided_at',
    ];

    protected $casts = [
        'decided_at' => 'datetime',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function minute()
    {
        return $this->belongsTo(MeetingMinute::class, 'minute_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
