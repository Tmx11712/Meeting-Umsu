<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingRecording;
use Illuminate\Http\Request;

class TranscriptionController extends Controller
{
    public function progress(Meeting $meeting)
    {
        $recording = $meeting->recordings()->latest()->first();
        $transcripts = $meeting->transcripts()->orderBy('sequence_order')->get();
        
        return response()->json([
            'status' => $recording ? $recording->status : 'none',
            'transcripts' => $transcripts
        ]);
    }
}
