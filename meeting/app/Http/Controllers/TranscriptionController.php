<?php

namespace App\Http\Controllers;

use App\Models\Meeting;

class TranscriptionController extends Controller
{
    public function progress(Meeting $meeting)
    {
        $recording = $meeting->recordings()->latest()->first();
        $transcripts = $meeting->transcripts()->orderBy('sequence_order', 'asc')->get();

        return response()->json([
            'status' => $recording ? $recording->status : 'none',
            'transcripts' => $transcripts,
        ]);
    }
}
