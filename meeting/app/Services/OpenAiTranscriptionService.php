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
     * Dapatkan durasi audio menggunakan FFprobe
     */
    public function getAudioDuration(string $localFilePath): float
    {
        $process = new Process([
            'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1', $localFilePath,
        ]);
        $process->run();

        if (! $process->isSuccessful()) {
            Log::warning('Gagal mendapatkan durasi via ffprobe: '.$process->getErrorOutput());

            return 0.0;
        }

        return (float) trim($process->getOutput());
    }

    /**
     * Split an audio file into chunks for concurrent processing with overlap.
     * Output is saved in a temporary local directory.
     * Returns an array of chunk metadata.
     */
    public function splitAudioToChunks(string $localFilePath, int $segmentDuration = 900, int $overlapSeconds = 15): array
    {
        $duration = $this->getAudioDuration($localFilePath);
        if ($duration <= 0) {
            throw new \Exception('Gagal menentukan durasi audio atau audio kosong.');
        }

        $tempDir = sys_get_temp_dir().'/whisper_chunks_'.uniqid();
        if (! is_dir($tempDir) && ! mkdir($tempDir, 0755, true)) {
            throw new \Exception('Gagal membuat direktori temporary untuk chunk di /tmp.');
        }

        $chunks = [];
        $chunkIndex = 0;

        while ($chunkIndex * $segmentDuration < $duration) {
            $start = $chunkIndex * $segmentDuration;
            // End time includes overlap, unless it exceeds total duration
            $end = min($start + $segmentDuration + $overlapSeconds, $duration);
            $chunkDurationTime = $end - $start;

            $chunkFileName = 'chunk_'.sprintf('%03d', $chunkIndex).'.mp3';
            $outPath = $tempDir.'/'.$chunkFileName;

            $process = new Process([
                'ffmpeg', '-y', '-i', $localFilePath,
                '-ss', (string) $start, '-t', (string) $chunkDurationTime,
                '-c:a', 'libmp3lame', '-b:a', '32k', '-ac', '1', '-ar', '16000',
                $outPath,
            ]);
            $process->setTimeout(300);
            $process->run();

            if (! $process->isSuccessful()) {
                throw new \Exception("FFMPEG splitting failed at chunk {$chunkIndex}: ".$process->getErrorOutput());
            }

            $chunks[] = [
                'index' => $chunkIndex,
                'start_seconds' => (float) $start,
                'end_seconds' => (float) $end,
                'normal_end_seconds' => (float) min($start + $segmentDuration, $duration),
                'local_path' => $outPath,
                'file_name' => $chunkFileName,
            ];

            $chunkIndex++;
        }

        return [
            'temp_dir' => $tempDir,
            'chunks' => $chunks,
        ];
    }

    /**
     * Transcribe a single audio chunk using OpenAI Whisper API.
     * Returns an array of segments with correct timestamps offset and overlap deduplication.
     * Menerima absolute path di lokal (/tmp container).
     */
    public function transcribeSingleChunk(string $localChunkPath, float $offsetSeconds, float $normalEndSeconds, bool $isLastChunk): array
    {
        $apiKey = config('services.openai.key');
        if (empty($apiKey)) {
            throw new \Exception('API key OpenAI belum dikonfigurasi di server.');
        }

        $response = Http::withToken($apiKey)
            ->timeout(300) // 5 minutes max per chunk
            ->attach('file', file_get_contents($localChunkPath), basename($localChunkPath))
            ->post('https://api.openai.com/v1/audio/transcriptions', [
                'model' => config('services.openai.transcribe_model'),
                'response_format' => 'verbose_json',
                'timestamp_granularities' => ['segment'],
            ]);

        if ($response->failed()) {
            Log::error('OpenAI Whisper Error on chunk: '.$response->body());
            $response->throw();
        }

        $data = $response->json();
        $chunkDuration = $data['duration'] ?? 0;
        $segments = $data['segments'] ?? [];

        if (empty($segments)) {
            $segments = [
                ['start' => 0, 'end' => $chunkDuration, 'text' => $data['text'] ?? ''],
            ];
        }

        $allSegments = [];
        foreach ($segments as $s) {
            $absoluteStart = ($s['start'] ?? 0) + $offsetSeconds;
            $absoluteEnd = ($s['end'] ?? 0) + $offsetSeconds;

            // Deduplikasi area overlap:
            // Jika BUKAN chunk terakhir, buang segment yang TEPAT melebih normal_end_seconds
            // Kita beri toleransi kecil (misal 0.5s) agar kalimat pas di batas tidak terhapus.
            // Lebih aman: gunakan absoluteStart. Jika kalimat dimulai setelah normal boundary, buang.
            // Biarkan chunk selanjutnya yang menanganinya.
            if (! $isLastChunk) {
                if ($absoluteStart >= $normalEndSeconds) {
                    continue; // Skip segment ini, biarkan diambil oleh chunk berikutnya
                }
            }

            $allSegments[] = [
                'start' => $absoluteStart,
                'end' => $absoluteEnd,
                'text' => trim($s['text'] ?? ''),
            ];
        }

        return $allSegments;
    }

    /**
     * Legacy method for TranscribeAudioJob (File < 20 minutes)
     */
    public function transcribeChunk(string $localFilePath): array
    {
        return $this->transcribeSingleChunk($localFilePath, 0, 999999, true);
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
JANGAN PERNAH mengarang atau menambahkan nama peserta yang tidak ada di 'Daftar Hadir Asli' di bawah. Field "peserta_rapat" WAJIB menyalin SELURUH NAMA yang ada di 'Daftar Hadir Asli' tanpa terkecuali. Jangan hilangkan nama siapapun meskipun mereka tidak terdengar berbicara di dalam transkrip. Jika seseorang berbicara di transkrip tapi tidak ada di Daftar Hadir Asli, sebutkan perannya secara umum di narasi (mis. "salah satu peserta" atau jabatan jika disebutkan) tanpa menambahkan namanya ke field "peserta_rapat". Jika ada tamu/pihak eksternal yang seharusnya tercatat, itu adalah tanggung jawab sistem untuk memasukkannya ke Daftar Hadir Asli sebelum proses ini — jangan menebak dari transkrip.

ATURAN ANTI-HALUSINASI:
- Setiap detail faktual (angka, tanggal, keputusan, deadline, siapa mengatakan apa) HARUS bisa ditelusuri langsung ke kalimat di transkrip. Jika tidak ada di transkrip, JANGAN tuliskan — lebih baik kosong daripada mengarang.
- Tanggal rapat ini adalah: {$meetingDate}. Jika ada penyebutan relatif seperti "besok", "minggu depan", atau "lusa" di transkrip, hitung tanggal aktualnya berdasarkan tanggal rapat ini dan tuliskan dengan format YYYY-MM-DD.
- Jika ada dokumen pendukung, Anda HANYA boleh menggunakannya sebagai konteks untuk melengkapi istilah yang tidak jelas di transkrip, BUKAN sebagai sumber poin keputusan atau diskusi yang tidak pernah diucapkan.

Aturan Tambahan:
1. "latar_belakang" berisi teks naratif penjelasan latar belakang rapat. Jika ada sesi pembukaan, gabungkan di sini atau taruh di "pembukaan".
2. "pembahasan" berisi array objek dari topik-topik yang dibahas. Setiap elemen pembahasan harus memiliki "topik", "narasi", dan opsional "list" atau "tabel" (gunakan tag HTML seperti <ul> atau <table> jika ada).
3. "keputusan" tetap wajib diisi (berisi array teks ringkas keputusan-keputusan yang diambil).
4. Gunakan paragraf naratif yang profesional, dalam Bahasa Indonesia formal.
5. Hasilkan daftar tindak lanjut secara akurat sesuai dengan keputusan di transkrip.
6. Kelompokkan "peserta_rapat" berdasarkan nama departemen/bagian/instansi jika informasi tersebut tersedia di Daftar Hadir Asli. Ingat: MASUKKAN SEMUA NAMA, jangan ada yang tertinggal.

Daftar Hadir Asli: {$pesertaText}
Dokumen Pendukung: {$dokumenText}

Format Output JSON HARUS SEPERTI INI:
{
    "peserta_rapat": ["Grup/Departemen 1: Nama 1, Nama 2", "Instansi 2: Nama 3"],
    "latar_belakang": "Teks naratif penjelasan latar belakang...",
    "pembukaan": "Teks naratif pembukaan rapat...",
    "pembahasan": [
        {
            "topik": "NAMA TOPIK 1",
            "narasi": "Paragraf penjelasan...",
            "list": "<ul><li>List opsional</li></ul>",
            "tabel": "<table><tr><td>Tabel opsional</td></tr></table>"
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
