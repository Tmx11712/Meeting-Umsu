<?php

namespace App\Services;

use App\Models\Meeting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;

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

        // Split audio into 20-minute segments (1200 seconds) at 32kbps MP3
        $segmentDuration = 1200;

        $tempDir = sys_get_temp_dir().'/whisper_chunks_'.uniqid();
        if (! mkdir($tempDir) && ! is_dir($tempDir)) {
            throw new \Exception('Gagal membuat direktori temporary untuk chunk.');
        }

        $chunkPattern = $tempDir.'/chunk_%03d.mp3';

        $process = new Process([
            'ffmpeg', '-y', '-i', $filePath,
            '-f', 'segment', '-segment_time', (string) $segmentDuration,
            '-c:a', 'libmp3lame', '-b:a', '32k', '-ac', '1', '-ar', '16000',
            $chunkPattern,
        ]);
        $process->setTimeout(600); // 10 minutes for FFmpeg processing
        $process->run();

        if (! $process->isSuccessful()) {
            throw new \Exception('FFMPEG splitting failed: '.$process->getErrorOutput());
        }

        $chunks = glob($tempDir.'/chunk_*.mp3');
        sort($chunks);

        $allSegments = [];
        $totalDuration = 0;

        foreach ($chunks as $index => $chunkPath) {
            $offset = $index * $segmentDuration;

            $response = Http::withToken($apiKey)
                ->timeout(300) // 5 minutes max per chunk
                ->attach('file', file_get_contents($chunkPath), basename($chunkPath))
                ->post('https://api.openai.com/v1/audio/transcriptions', [
                    'model' => config('services.openai.transcribe_model'),
                    'response_format' => 'verbose_json',
                    'timestamp_granularities' => ['segment'],
                ]);

            if ($response->failed()) {
                Log::error('OpenAI Whisper Error on chunk '.$index.': '.$response->body());
                $response->throw();
            }

            $data = $response->json();
            $chunkDuration = $data['duration'] ?? 0;
            $totalDuration += $chunkDuration;

            $segments = $data['segments'] ?? [];
            if (empty($segments)) {
                $segments = [
                    ['start' => 0, 'end' => $chunkDuration, 'text' => $data['text'] ?? ''],
                ];
            }

            foreach ($segments as $s) {
                $allSegments[] = [
                    'start' => ($s['start'] ?? 0) + $offset,
                    'end' => ($s['end'] ?? 0) + $offset,
                    'text' => trim($s['text'] ?? ''),
                ];
            }
        }

        // Cleanup
        foreach ($chunks as $chunkPath) {
            @unlink($chunkPath);
        }
        @rmdir($tempDir);

        return [
            'duration' => $totalDuration,
            'segments' => $allSegments,
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

        $meetingDate = $meeting->date ?? date('Y-m-d'); // fallback jika null

        $systemPrompt = <<<PROMPT
Anda adalah asisten notulis rapat yang ahli. Tugas Anda adalah merangkum transkrip rapat menjadi notulen berstruktur JSON yang sangat resmi.

ATURAN PALING KRITIS — TIDAK BOLEH DILANGGAR:
JANGAN PERNAH mengarang atau menambahkan nama peserta yang tidak ada di 'Daftar Hadir Asli' di bawah. Field "peserta_rapat" HANYA boleh berisi nama dari daftar tersebut. Jika seseorang berbicara di transkrip tapi tidak ada di Daftar Hadir Asli, sebutkan perannya secara umum di narasi (mis. "salah satu peserta" atau jabatan jika disebutkan) tanpa menambahkan namanya ke field "peserta_rapat". Jika ada tamu/pihak eksternal yang seharusnya tercatat, itu adalah tanggung jawab sistem untuk memasukkannya ke Daftar Hadir Asli sebelum proses ini — jangan menebak dari transkrip.

ATURAN ANTI-HALUSINASI:
- Setiap detail faktual (angka, tanggal, keputusan, deadline, siapa mengatakan apa) HARUS bisa ditelusuri langsung ke kalimat di transkrip. Jika tidak ada di transkrip, JANGAN tuliskan — lebih baik kosong daripada mengarang.
- Tanggal rapat ini adalah: {$meetingDate}. Jika ada penyebutan relatif seperti "besok", "minggu depan", atau "lusa" di transkrip, hitung tanggal aktualnya berdasarkan tanggal rapat ini dan tuliskan dengan format YYYY-MM-DD.
- Jika ada dokumen pendukung, Anda HANYA boleh menggunakannya sebagai konteks untuk melengkapi istilah yang tidak jelas di transkrip, BUKAN sebagai sumber poin keputusan atau diskusi yang tidak pernah diucapkan.

Aturan Tambahan:
1. "sections" berisi array objek bagian utama laporan. Judul setiap bagian (title) ditentukan secara dinamis berdasarkan substansi (misal: "LATAR BELAKANG", "VISI DAN ROADMAP", "USULAN STRUKTUR", "ARAHAN BPH", "PEMBAHASAN", dll).
2. "keputusan" tetap wajib diisi (berisi array teks ringkas keputusan-keputusan yang diambil) sebagai data statistik database, meskipun mungkin sudah tergabung dalam narasi di "sections".
3. Gunakan paragraf naratif yang profesional, dalam Bahasa Indonesia formal.
4. Hasilkan daftar tindak lanjut secara akurat sesuai dengan keputusan di transkrip.
5. Kelompokkan "peserta_rapat" berdasarkan nama departemen/bagian/instansi jika informasi tersebut tersedia di Daftar Hadir Asli.

Daftar Hadir Asli: {$pesertaText}
Dokumen Pendukung: {$dokumenText}

Format Output JSON HARUS SEPERTI INI:
{
    "peserta_rapat": ["Grup/Departemen 1: Nama 1, Nama 2", "Instansi 2: Nama 3"],
    "sections": [
        {
            "title": "LATAR BELAKANG",
            "content": "Teks naratif penjelasan latar belakang...",
            "list": "List markdown opsional jika ada enumerasi",
            "table": "Tabel markdown opsional jika ada data tabular"
        },
        {
            "title": "NAMA BAGIAN DINAMIS LAINNYA",
            "content": "Paragraf penjelasan...",
            "list": "",
            "table": ""
        }
    ],
    "keputusan": ["Keputusan 1", "Keputusan 2"],
    "tindak_lanjut": [
        {
            "description": "Uraian tugas...",
            "pic": "Nama/Jabatan (kosongkan jika tidak disebut)",
            "deadline": "YYYY-MM-DD (kosongkan jika tidak disebut)"
        }
    ]
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
