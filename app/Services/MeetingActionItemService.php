<?php

namespace App\Services;

use App\Models\Meeting;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * [EDUKASI ARSITEKTUR: SERVICE CLASS]
 * MeetingActionItemService bertugas mengelola satu aspek bisnis yang spesifik: Tindak Lanjut (Action Items).
 *
 * Logika yang disimpan di sini (sync action items) tidak cocok diletakkan di Model (terlalu kompleks)
 * atau di Controller (terlalu besar), maka lahirlah Service Class sebagai lapisan perantara yang tepat.
 *
 * Perhatikan penggunaan `DB::transaction()` di dalam method `updateForMeeting`.
 * Ini memastikan bahwa operasi HAPUS semua action item lama + INSERT action item baru
 * berjalan sebagai satu unit yang tidak bisa dipisah. Jika salah satu gagal, keduanya dibatalkan (rollback).
 * Ini mencegah kondisi di mana data lama sudah terhapus tapi data baru gagal disimpan.
 */
class MeetingActionItemService
{
    /**
     * Update action items for a specific meeting minute.
     */
    public function updateForMeeting(Meeting $meeting, array $actionItems): void
    {
        $minute = $meeting->minutes()->latest()->firstOrFail();

        DB::transaction(function () use ($meeting, $minute, $actionItems) {
            // Delete existing action items
            $minute->actionItems()->delete();

            // Insert the new action items
            foreach ($actionItems as $item) {
                if (empty(trim($item['description']))) {
                    continue; // Skip empty descriptions
                }

                $minute->actionItems()->create([
                    'meeting_id' => $meeting->id,
                    'description' => trim($item['description']),
                    'pic' => trim($item['pic'] ?? '-'),
                    'deadline' => ! empty($item['deadline']) ? Carbon::parse($item['deadline'])->format('Y-m-d') : null,
                    'status' => 'pending',
                ]);
            }
        });
    }
}
