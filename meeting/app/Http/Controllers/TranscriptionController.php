<?php

namespace App\Http\Controllers;

use App\Models\Meeting;

/**
 * [EDUKASI ARSITEKTUR: POLLING ENDPOINT]
 * Controller ini menyediakan endpoint ringan untuk dipakai oleh frontend (React)
 * yang ingin mengetahui progress transkripsi secara real-time.
 *
 * Frontend akan memanggil endpoint ini setiap beberapa detik (polling) untuk mengecek
 * apakah status transkripsi sudah berubah (misalnya dari 'processing' menjadi 'completed').
 * Ini adalah teknik sederhana sebelum WebSocket tersedia. Di aplikasi kita, WebSocket sudah
 * tersedia melalui Laravel Reverb, sehingga polling ini lebih bersifat sebagai fallback.
 */
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
