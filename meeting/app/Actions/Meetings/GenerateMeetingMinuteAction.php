<?php

namespace App\Actions\Meetings;

use App\Models\Meeting;
use App\Models\MeetingActionItem;
use App\Models\MeetingMinute;
use App\Services\OpenAiTranscriptionService;

/**
 * [EDUKASI ARSITEKTUR]
 * Ini adalah contoh dari pola arsitektur "Action Class" (Single Responsibility Principle).
 * Pola ini menggantikan "Fat Controller" atau "God Service". 
 * 1 Class = 1 Tugas Mutlak. Sangat mudah dites dan bisa dipanggil dari mana saja (Controller, Cron Job, Terminal).
 */
class GenerateMeetingMinuteAction
{
    public function __construct(
        protected OpenAiTranscriptionService $aiService,
    ) {}

    /**
     * Generate AI summary for a meeting: build context, call AI, persist results.
     */
    public function execute(Meeting $meeting): MeetingMinute
    {
        // 1. Mengumpulkan data mentah
        $transcriptText = $this->buildTranscriptText($meeting);

        if (empty(trim($transcriptText))) {
            throw new \Exception('Transkrip kosong. Harap rekam atau upload audio.');
        }

        $pesertaText = $this->buildAttendeesList($meeting);
        $dokumenText = $this->extractDocumentText($meeting);

        $summaryJson = $this->aiService->generateSummary($meeting, $transcriptText, $pesertaText, $dokumenText);

        $minute = $this->persistMinute($meeting, $summaryJson);
        $this->persistActionItems($meeting, $minute, $summaryJson);

        return $minute;
    }

    /**
     * Build the full transcript text, preferring corrected versions.
     */
    protected function buildTranscriptText(Meeting $meeting): string
    {
        $transcripts = $meeting->transcripts()->with('corrections')->orderBy('sequence_order')->get();
        $parts = [];

        foreach ($transcripts as $t) {
            $parts[] = $t->corrections->count() > 0
                ? $t->corrections->last()->corrected_text
                : $t->text;
        }

        return implode(' ', $parts);
    }

    /**
     * Build a comma-separated list of attendees who were present.
     */
    protected function buildAttendeesList(Meeting $meeting): string
    {
        $attendees = $meeting->attendances()
            ->whereIn('status', ['hadir', 'terlambat'])
            ->with('user')
            ->get();

        $names = $attendees->map(fn ($att) => $att->user?->name ?? 'Peserta Tidak Dikenal')->toArray();

        return empty($names) ? 'Tidak ada data absensi.' : implode(', ', $names);
    }

    /**
     * Extract text content from attached PDF/TXT documents.
     */
    protected function extractDocumentText(Meeting $meeting): string
    {
        $documents = $meeting->documents;

        if (! $documents || $documents->isEmpty()) {
            return '';
        }

        $parts = [];

        foreach ($documents as $doc) {
            $filePath = storage_path('app/public/'.str_replace('public/', '', $doc->file_path));

            if (! file_exists($filePath)) {
                continue;
            }

            if ($doc->mime_type === 'application/pdf') {
                try {
                    $parser = new \Smalot\PdfParser\Parser();
                    $pdf = $parser->parseFile($filePath);
                    $parts[] = "\n--- Dokumen PDF: {$doc->file_name} ---\n".$pdf->getText();
                } catch (\Exception $e) {
                    // Skip if PDF parsing fails
                }
            } elseif ($doc->mime_type === 'text/plain') {
                $parts[] = "\n--- Dokumen TXT: {$doc->file_name} ---\n".file_get_contents($filePath);
            }
        }

        return implode('', $parts);
    }

    /**
     * Persist the AI-generated minute to the database.
     */
    protected function persistMinute(Meeting $meeting, array $summaryJson): MeetingMinute
    {
        return MeetingMinute::updateOrCreate(
            ['meeting_id' => $meeting->id],
            [
                'content' => collect($summaryJson)->except(['topik_count', 'keputusan_count'])->toArray(),
                'ai_topics_count' => $summaryJson['topik_count'] ?? 0,
                'ai_decisions_count' => $summaryJson['keputusan_count'] ?? 0,
                'ai_summary_generated_at' => now(),
                'status' => 'review',
            ]
        );
    }

    /**
     * Create action items from the AI output.
     */
    protected function persistActionItems(Meeting $meeting, MeetingMinute $minute, array $summaryJson): void
    {
        if (empty($summaryJson['tindak_lanjut'])) {
            return;
        }

        $minute->actionItems()->delete();

        foreach ($summaryJson['tindak_lanjut'] as $actionItem) {
            $deadlineStr = $actionItem['deadline'] ?? null;
            $deadlineTimestamp = $deadlineStr ? strtotime($deadlineStr) : false;

            MeetingActionItem::create([
                'meeting_id' => $meeting->id,
                'minute_id' => $minute->id,
                'description' => $actionItem['description'] ?? '-',
                'pic' => $actionItem['pic'] ?? '-',
                'deadline' => $deadlineTimestamp ? date('Y-m-d', $deadlineTimestamp) : null,
            ]);
        }
    }
}
