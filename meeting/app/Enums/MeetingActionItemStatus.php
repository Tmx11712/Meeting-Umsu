<?php

namespace App\Enums;

enum MeetingActionItemStatus: string
{
    case OPEN = 'open';
    case IN_PROGRESS = 'in_progress';
    case DONE = 'done';
}
