<?php

namespace App\Enums;

enum MeetingStatus: string
{
    case TERJADWAL = 'terjadwal';
    case BERLANGSUNG = 'berlangsung';
    case SELESAI = 'selesai';
    case DIBATALKAN = 'dibatalkan';
}
