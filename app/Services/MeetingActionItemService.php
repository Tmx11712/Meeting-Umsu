<?php

namespace App\Services;

use App\Enums\MeetingActionItemStatus;
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
            $existingItems = $minute->actionItems()->get()->keyBy('id');
            $keptIds = [];

            foreach ($actionItems as $item) {
                $description = trim((string) ($item['description'] ?? ''));
                if ($description === '') {
                    continue;
                }

                $deadline = ! empty($item['deadline'])
                    ? Carbon::parse($item['deadline'])->setTimezone(config('app.timezone'))->format('Y-m-d')
                    : null;

                $pic = trim((string) ($item['pic'] ?? '-'));
                $itemId = $item['id'] ?? null;
                $existing = $itemId ? $existingItems->get($itemId) : null;

                $status = $item['status'] ?? ($existing?->status ?? MeetingActionItemStatus::OPEN->value);
                if (! MeetingActionItemStatus::tryFrom((string) $status)) {
                    $status = $existing?->status ?? MeetingActionItemStatus::OPEN->value;
                }

                if ($existing) {
                    $existing->fill([
                        'description' => $description,
                        'pic' => $pic,
                        'deadline' => $deadline,
                        'status' => $status,
                    ])->save();
                    $keptIds[] = $existing->id;
                } else {
                    $created = $minute->actionItems()->create([
                        'meeting_id' => $meeting->id,
                        'description' => $description,
                        'pic' => $pic,
                        'deadline' => $deadline,
                        'status' => $status,
                    ]);
                    $keptIds[] = $created->id;
                }
            }

            if (empty($keptIds)) {
                $minute->actionItems()->delete();
            } else {
                $minute->actionItems()->whereNotIn('id', $keptIds)->delete();
            }
        });
    }
}
