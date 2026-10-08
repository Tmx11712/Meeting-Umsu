<?php

namespace App\Enums;

/**
 * [EDUKASI ARSITEKTUR: ENUM (Konstanta Bertipe)]
 * Enum adalah fitur PHP 8.1 untuk mendefinisikan kumpulan nilai yang sudah pasti dan tidak berubah.
 *
 * Tanpa Enum, kita biasanya hardcode string seperti `'terjadwal'` atau `'selesai'` di banyak tempat
 * yang rawan typo dan susah di-refactor.
 *
 * Dengan Enum, kita cukup tulis `MeetingStatus::SELESAI` dan PHP akan otomatis cek kebenarannya.
 * Jika ada yang typo, PHP langsung error (tidak perlu tunggu runtime).
 */
enum MeetingStatus: string
{
    case TERJADWAL = 'terjadwal';
    case BERLANGSUNG = 'berlangsung';
    case SELESAI = 'selesai';
    case DIBATALKAN = 'dibatalkan';
}
