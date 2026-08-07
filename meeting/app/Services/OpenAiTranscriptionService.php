<?php

namespace App\Services;

use App\Models\Meeting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * [EDUKASI ARSITEKTUR: SERVICE PATTERN]
 * Kenapa kelas ini disebut "Service" (dan bukan "Action")? 
 * Dalam arsitektur kita, "Service" dikhususkan untuk kelas yang murni bertugas berkomunikasi dengan PIHAK KETIGA (External API seperti OpenAI).
 * Sedangkan logika bisnis internal aplikasi (seperti pembuatan Notulen ke Database) diletakkan di "Action".
 * Pemisahan ini membuat kode kita sangat modular. Jika besok kita ganti OpenAI ke Claude, kita hanya ubah file Service ini.
 */
class OpenAiTranscriptionService
{
    /**
     * Transcribe an audio chunk using OpenAI Whisper API.
     * Returns an array of segments with timestamps, or a single segment fallback.
     * Each segment: ['start' => float, 'end' => float, 'text' => string]
     */
    public function transcribeChunk(string $filePath): array
    {
        $apiKey = config('services.openai.key');
        if (empty($apiKey)) {
            throw new \Exception('API key OpenAI belum dikonfigurasi di server.');
        }

        $response = Http::withToken($apiKey)
            ->timeout(120)
            ->attach('file', file_get_contents($filePath), basename($filePath))
            ->post('https://api.openai.com/v1/audio/transcriptions', [
                'model' => config('services.openai.transcribe_model'),
                'language' => 'id',
                'response_format' => 'verbose_json',
                'timestamp_granularities' => ['segment'],
            ]);

        if ($response->failed()) {
            Log::error('OpenAI Whisper Error: '.$response->body());
            throw new \Exception('Gagal melakukan transkripsi: '.$response->json('error.message', 'Unknown error'));
        }

        $data = $response->json();
        $segments = $data['segments'] ?? [];
        $duration = $data['duration'] ?? 0;

        // If segments are available, return them with timestamps
        if (! empty($segments)) {
            return [
                'duration' => $duration,
                'segments' => array_map(fn ($s) => [
                    'start' => $s['start'] ?? 0,
                    'end' => $s['end'] ?? 0,
                    'text' => trim($s['text'] ?? ''),
                ], $segments),
            ];
        }

        // Fallback: return whole text as single segment
        return [
            'duration' => $duration,
            'segments' => [
                ['start' => 0, 'end' => $duration, 'text' => $data['text'] ?? ''],
            ],
        ];
    }

    /**
     * Generate summary using GPT based on corrected transcript.
     */
    public function generateSummary(Meeting $meeting, string $correctedTranscript, string $pesertaText = '', string $dokumenText = ''): array
    {
        $apiKey = config('services.openai.key');
        if (empty($apiKey)) {
            throw new \Exception('API key OpenAI belum dikonfigurasi di server.');
        }

        $systemPrompt = <<<PROMPT
Anda adalah asisten notulis rapat yang ahli. Tugas Anda adalah merangkum transkrip rapat menjadi notulen berstruktur JSON yang sangat resmi.
Aturan ketat:
1. Heading/Topik ditentukan secara dinamis dari isi transkrip.
2. Gunakan paragraf naratif yang profesional untuk pembahasan.
3. JANGAN PERNAH mengarang nama peserta. Gunakan HANYA nama yang diberikan di 'Daftar Hadir Asli' untuk mengisi field "peserta_rapat". Jika tidak disebutkan, sertakan yang ada di Daftar Hadir Asli.
4. "latar_belakang" berisi teks naratif pembukaan/tujuan rapat secara formal. Jika ada dokumen pendukung, Anda BISA menggunakan isi dokumen tersebut untuk memperkaya konteks latar belakang dan pembahasan.
5. Hasilkan daftar tindak lanjut secara akurat.

Daftar Hadir Asli: {$pesertaText}
Dokumen Pendukung: {$dokumenText}

Format Output JSON HARUS SEPERTI INI:
{
    "latar_belakang": "Teks naratif latar belakang/pembukaan rapat...",
    "peserta_rapat": ["Nama 1", "Nama 2"],
    "pembahasan": [
        {
            "topik": "Judul Topik",
            "narasi": "Paragraf naratif penjelasan...",
            "tabel": "Tabel markdown opsional jika ada",
            "list": "List markdown opsional"
        }
    ],
    "keputusan": ["Keputusan 1", "Keputusan 2"],
    "tindak_lanjut": [
        {
            "description": "Lakukan X",
            "pic": "Nama/PIC",
            "deadline": "2026-10-12 atau string"
        }
    ],
    "topik_count": 1,
    "keputusan_count": 2
}
PROMPT;

        $response = Http::withToken($apiKey)
            ->timeout(180)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => config('services.openai.summary_model'),
                'response_format' => ['type' => 'json_object'],
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => "Berikut adalah transkrip rapat yang harus dirangkum:\n\n".$correctedTranscript],
                ],
                'temperature' => 0.5,
            ]);

        if ($response->failed()) {
            Log::error('OpenAI GPT Error: '.$response->body());
            throw new \Exception('Gagal membuat ringkasan AI: '.$response->json('error.message', 'Unknown error'));
        }

        $result = $response->json('choices.0.message.content');

        return json_decode($result, true) ?? [];
    }
}
