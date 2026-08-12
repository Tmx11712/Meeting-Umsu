<?php

namespace App\Enums;

enum MeetingRecordingStatus: string
{
    case RECORDING = 'recording';
    case UPLOADED = 'uploaded';
    case PROCESSING = 'processing';
    case TRANSCRIBING = 'transcribing';
    case COMPLETED = 'completed';
    case FAILED = 'failed';
}
