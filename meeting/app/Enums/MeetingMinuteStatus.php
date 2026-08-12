<?php

namespace App\Enums;

enum MeetingMinuteStatus: string
{
    case DRAFT = 'draft';
    case REVIEW = 'review';
    case SIAP_DIKIRIM = 'siap_dikirim';
    case MENUNGGU_PERSETUJUAN = 'menunggu_persetujuan';
    case DISETUJUI = 'disetujui';
    case DITOLAK = 'ditolak';
}
