<?php

namespace App\Enums;

/**
 * [EDUKASI ARSITEKTUR: ENUM STATUS REKAMAN]
 * Enum ini melacak siklus hidup (lifecycle) sebuah file rekaman dari awal hingga selesai diproses.
 *
 * Urutan status yang normal:
 * RECORDING → UPLOADED → PROCESSING → TRANSCRIBING → COMPLETED
 *                                                         ↓ (jika gagal)
 *                                                       FAILED
 *
 * Dengan Enum, seluruh kode yang merujuk ke status rekaman bisa menggunakan konstanta yang sama,
 * misalnya `MeetingRecordingStatus::TRANSCRIBING->value` alih-alih string `'transcribing'` yang rawan typo.
 */
enum MeetingRecordingStatus: string
{
    case RECORDING = 'recording';
    case UPLOADED = 'uploaded';
    case PROCESSING = 'processing';
    case TRANSCRIBING = 'transcribing';
    case COMPLETED = 'completed';
    case FAILED = 'failed';
}
