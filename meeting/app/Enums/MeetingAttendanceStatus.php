<?php

namespace App\Enums;

enum MeetingAttendanceStatus: string
{
    case HADIR = 'hadir';
    case TERLAMBAT = 'terlambat';
    case TIDAK_HADIR = 'tidak_hadir';
}
