<?php

namespace App\Enums;

/**
 * [EDUKASI ARSITEKTUR: PHP ENUM]
 * Mulai PHP 8.1, kita bisa menggunakan "Backed Enum".
 * Daripada menggunakan string biasa (seperti 'draft' atau 'review') secara hardcode yang rawan typo,
 * lebih aman menggunakan konstanta Enum ini: `MeetingMinuteStatus::DRAFT->value`.
 * Ini memastikan konsistensi data status di seluruh aplikasi.
 */
enum MeetingMinuteStatus: string
{
    case DRAFT = 'draft';
    case REVIEW = 'review';
    case SIAP_DIKIRIM = 'siap_dikirim';
    case MENUNGGU_PERSETUJUAN = 'menunggu_persetujuan';
    case DISETUJUI = 'disetujui';
    case DITOLAK = 'ditolak';
}
