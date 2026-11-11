import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, Upload } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMeetingWebSocket } from '@/hooks/use-meeting-websocket';
import { usePermissions } from '@/hooks/use-permissions';
import type { Meeting } from '@/types/meeting';

export default function MeetingCorrection({ meeting }: { meeting: Meeting }) {
    const { canEdit } = usePermissions();
    const canCorrect = canEdit('transcript');
    useMeetingWebSocket(meeting?.id);

    /**
     * [EDUKASI ARSITEKTUR: DATA TRANSFORMATION (FRONTEND)]
     * Daripada memaksa Backend untuk memformat data yang spesifik untuk UI ini,
     * kita melakukan transformasi data di Frontend (menggabungkan semua teks transkrip dari array).
     * Ini membuat Backend API kita tetap "bersih", modular, dan bisa dipakai ulang oleh platform lain (misal aplikasi Mobile).
     */
    // Combine all transcripts into a single initial text
    const recordings = meeting.recordings || [];
    const firstRecording = recordings[0];
    const allTranscripts = recordings.flatMap((r: any) => r.transcripts || []);
    const firstTranscript = allTranscripts[0];

    // Find the latest correction on the first transcript if it exists
    const latestCorrection =
        firstTranscript?.corrections?.length > 0
            ? firstTranscript.corrections[
                  firstTranscript.corrections.length - 1
              ]
            : null;

    const originalCombinedText = allTranscripts
        .map((t: any) => t.text)
        .join('\n\n');
    const initialText = latestCorrection
        ? latestCorrection.corrected_text
        : originalCombinedText;

    const [text, setText] = useState(initialText);
    const [isSaving, setIsSaving] = useState(false);

    // Save functionality
    const handleSaveTranscript = () => {
        if (!firstTranscript) {
            return;
        }

        setIsSaving(true);
        router.post(
            `/meetings/${meeting.id}/correction`,
            {
                transcript_id: firstTranscript.id,
                original_text: originalCombinedText,
                corrected_text: text,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const handleFinish = () => {
        // Optionally save before finishing if changed
        if (text !== initialText && firstTranscript) {
            router.post(
                `/meetings/${meeting.id}/correction`,
                {
                    transcript_id: firstTranscript.id,
                    original_text: originalCombinedText,
                    corrected_text: text,
                },
                {
                    onSuccess: () => {
                        router.post(
                            `/meetings/${meeting.id}/correction/finish`,
                        );
                    },
                },
            );
        } else {
            router.post(`/meetings/${meeting.id}/correction/finish`);
        }
    };

    const handleExportTxt = () => {
        const element = document.createElement('a');
        const file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `transkrip_${meeting.title?.toLowerCase().replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleImportTxt = (e: any) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setText(event.target.result as string);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="mx-auto flex w-full max-w-5xl animate-in flex-col gap-6 py-4 duration-700 fade-in slide-in-from-bottom-4">
            <Head title="Koreksi Transkrip" />

            {/* Header & Breadcrumb */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Koreksi Transkrip
                    </h1>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span>Dashboard</span>
                        <span>›</span>
                        <Link
                            href="/meetings"
                            className="transition-colors hover:text-blue-600"
                        >
                            Jadwal Rapat
                        </Link>
                        <span>›</span>
                        <span className="font-bold text-blue-900 dark:text-blue-300">
                            Koreksi Transkrip
                        </span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    asChild
                    className="rounded-xl border-slate-200 shadow-sm dark:border-slate-700"
                >
                    <Link href={`/meetings/${meeting.id}/recording`}>
                        Kembali ke Ruang Rekaman
                    </Link>
                </Button>
            </div>

            {!canCorrect && (
                <Alert className="rounded-2xl border-rose-200 bg-rose-50/80 text-rose-900 backdrop-blur-sm dark:border-rose-800/50 dark:bg-rose-900/30 dark:text-rose-200">
                    <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    <AlertTitle className="ml-2 text-base font-bold text-rose-800 dark:text-rose-300">
                        Mode Hanya Baca
                    </AlertTitle>
                    <AlertDescription className="mt-1 ml-2 font-medium text-rose-700 dark:text-rose-400/90">
                        Anda tidak memiliki izin untuk mengoreksi notulen ini.
                        Anda hanya dapat melihat data.
                    </AlertDescription>
                </Alert>
            )}

            {/* Audio Player */}
            {firstRecording && firstRecording.file_path && (
                <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h2 className="mb-2 text-sm font-bold text-slate-800">
                        Rekaman Audio
                    </h2>
                    <audio
                        controls
                        className="h-10 w-full"
                        src={`/meetings/${meeting.id}/recording/${firstRecording.id}/stream`}
                    >
                        Browser Anda tidak mendukung elemen audio.
                    </audio>
                </Card>
            )}

            {/* Main Prototype UI */}
            <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
                    <h2 className="text-base font-bold text-slate-900">
                        Transkrip mentah
                    </h2>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 rounded-lg border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                            onClick={handleExportTxt}
                        >
                            <Upload className="mr-2 h-3.5 w-3.5 rotate-180" />
                            Simpan sebagai .txt
                        </Button>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".txt"
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                onChange={handleImportTxt}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                className="pointer-events-none h-9 rounded-lg border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                            >
                                <Upload className="mr-2 h-3.5 w-3.5" />
                                Muat dari .txt
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50/50 p-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        readOnly={!canCorrect}
                        placeholder="Belum ada transkrip. Kirim audio dari halaman Operator Rekaman, atau muat dari file .txt yang sudah disimpan sebelumnya."
                        className="min-h-100 w-full resize-y rounded-xl border border-slate-200 bg-white p-5 font-mono text-sm leading-relaxed text-slate-600 shadow-sm focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:outline-none"
                    />
                </div>
            </Card>

            {/* Footer Action */}
            {canCorrect && (
                <div className="flex justify-end pt-2">
                    <Button
                        onClick={handleFinish}
                        className="h-11 rounded-xl bg-blue-600 px-8 font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
                    >
                        Selesai & Lanjut ke Review
                    </Button>
                </div>
            )}
        </div>
    );
}
