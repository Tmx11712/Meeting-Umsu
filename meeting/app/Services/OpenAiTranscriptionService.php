<?php

namespace App\Services;

use App\Models\Meeting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAiTranscriptionService
{
    /**
     * Transcribe an audio chunk using OpenAI Whisper API.
     */
    public function transcribeChunk(string $filePath): string
    {
        $apiKey = config('services.openai.key') ?? env('OPENAI_API_KEY');
        if (empty($apiKey)) {
            throw new \Exception('API key OpenAI belum dikonfigurasi di server.');
        }

        $response = Http::withToken($apiKey)
            ->timeout(120)
            ->attach('file', file_get_contents($filePath), basename($filePath))
            ->post('https://api.openai.com/v1/audio/transcriptions', [
                'model' => env('OPENAI_TRANSCRIBE_MODEL', 'whisper-1'),
                'language' => 'id',
            ]);

        if ($response->failed()) {
            Log::error('OpenAI Whisper Error: ' . $response->body());
            throw new \Exception('Gagal melakukan transkripsi: ' . $response->json('error.message', 'Unknown error'));
        }

        return $response->json('text', '');
    }

    /**
     * Generate summary using GPT based on corrected transcript.
     */
    public function generateSummary(Meeting $meeting, string $correctedTranscript): array
    {
        $apiKey = config('services.openai.key') ?? env('OPENAI_API_KEY');
        if (empty($apiKey)) {
            throw new \Exception('API key OpenAI belum dikonfigurasi di server.');
        }

        $systemPrompt = <<<PROMPT
Anda adalah asisten notulis rapat yang ahli. Tugas Anda adalah merangkum transkrip rapat menjadi notulen berstruktur JSON.
Aturan ketat:
1. Heading/Topik ditentukan secara dinamis dari isi transkrip, bukan dipaksakan pada struktur baku.
2. Gunakan paragraf naratif yang profesional untuk pembahasan, BUKAN bullet points.
3. Kaitkan pernyataan ke nama seseorang HANYA JIKA disebut secara eksplisit dalam transkrip. JANGAN PERNAH mengarang nama.
4. Gunakan tabel markdown (dalam string JSON) hanya untuk data tabular jika ada.
5. Gunakan list markdown hanya untuk poin-poin yang memang merupakan urutan/daftar penting.
6. Hasilkan keputusan rapat sebagai array string.
7. Hasilkan daftar tindak lanjut (action items) secara akurat dari pembahasan, mencakup deskripsi, PIC (jika ada), dan deadline (jika ada).

Format Output JSON:
{
    "pembukaan": "Teks naratif pembukaan...",
    "pembahasan": [
        {
            "topik": "Judul Topik 1",
            "narasi": "Paragraf naratif penjelasan...",
            "tabel": "Tabel markdown opsional",
            "list": "List markdown opsional"
        }
    ],
    "keputusan": ["Keputusan 1", "Keputusan 2"],
    "tindak_lanjut": [
        {
            "description": "Lakukan X",
            "pic": "Nama/PIC",
            "deadline": "2026-10-12 atau string deskriptif"
        }
    ],
    "topik_count": 1,
    "keputusan_count": 2
}
PROMPT;

        $response = Http::withToken($apiKey)
            ->timeout(180)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => env('OPENAI_SUMMARY_MODEL', 'gpt-4o-mini'),
                'response_format' => ['type' => 'json_object'],
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => "Berikut adalah transkrip rapat yang harus dirangkum:\n\n" . $correctedTranscript]
                ],
                'temperature' => 0.5,
            ]);

        if ($response->failed()) {
            Log::error('OpenAI GPT Error: ' . $response->body());
            throw new \Exception('Gagal membuat ringkasan AI: ' . $response->json('error.message', 'Unknown error'));
        }

        $result = $response->json('choices.0.message.content');
        return json_decode($result, true) ?? [];
    }
}
