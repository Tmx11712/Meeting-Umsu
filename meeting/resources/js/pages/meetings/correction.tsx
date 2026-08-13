import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Upload } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import type { Meeting } from '@/types/meeting';

export default function MeetingCorrection({ meeting }: { meeting: Meeting }) {
    const { canEdit } = usePermissions();
    const canCorrect = canEdit('transcript');

    // Combine all transcripts into a single initial text
    const recordings = meeting.recordings || [];
    const allTranscripts = recordings.flatMap((r: any) => r.transcripts || []);
    const firstTranscript = allTranscripts[0];
    
    // Find the latest correction on the first transcript if it exists
    const latestCorrection = firstTranscript?.corrections?.length > 0 
        ? firstTranscript.corrections[firstTranscript.corrections.length - 1] 
        : null;

    const originalCombinedText = allTranscripts.map((t: any) => t.text).join('\n\n');
    const initialText = latestCorrection ? latestCorrection.corrected_text : originalCombinedText;

    const [text, setText] = useState(initialText);
    const [isSaving, setIsSaving] = useState(false);

    // Save functionality
    const handleSaveTranscript = () => {
        if (!firstTranscript) return;
        setIsSaving(true);
        router.post(`/meetings/${meeting.id}/correction`, {
            transcript_id: firstTranscript.id,
            original_text: originalCombinedText,
            corrected_text: text
        }, { 
            preserveScroll: true, 
            preserveState: true,
            onFinish: () => setIsSaving(false)
        });
    };

    const handleFinish = () => {
        // Optionally save before finishing if changed
        if (text !== initialText && firstTranscript) {
            router.post(`/meetings/${meeting.id}/correction`, {
                transcript_id: firstTranscript.id,
                original_text: originalCombinedText,
                corrected_text: text
            }, {
                onSuccess: () => {
                    router.post(`/meetings/${meeting.id}/correction/finish`);
                }
            });
        } else {
            router.post(`/meetings/${meeting.id}/correction/finish`);
        }
    };

    const handleExportTxt = () => {
        const element = document.createElement("a");
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `transkrip_${meeting.title?.toLowerCase().replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleImportTxt = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setText(event.target.result as string);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex flex-col gap-6 py-4 w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title="Koreksi Transkrip" />
            
            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                        Koreksi Transkrip
                    </h1>
                    <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                        <span>Dashboard</span>
                        <span>›</span>
                        <Link href="/meetings" className="hover:text-blue-600 transition-colors">Jadwal Rapat</Link>
                        <span>›</span>
                        <span className="text-blue-900 dark:text-blue-300 font-bold">Koreksi Transkrip</span>
                    </div>
                </div>
                <Button variant="outline" asChild className="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm">
                    <Link href={`/meetings/${meeting.id}/recording`}>
                        Kembali ke Ruang Rekaman
                    </Link>
                </Button>
            </div>

            {!canCorrect && (
                <Alert className="bg-rose-50/80 dark:bg-rose-900/30 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800/50 rounded-2xl backdrop-blur-sm">
                    <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    <AlertTitle className="text-rose-800 dark:text-rose-300 font-bold text-base ml-2">Mode Hanya Baca</AlertTitle>
                    <AlertDescription className="text-rose-700 dark:text-rose-400/90 ml-2 mt-1 font-medium">
                        Anda tidak memiliki izin untuk mengoreksi notulen ini. Anda hanya dapat melihat data.
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Prototype UI */}
            <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-base font-bold text-slate-900">Transkrip mentah</h2>
                    
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg h-9 text-xs text-slate-600 border-slate-200 hover:bg-slate-50 font-medium"
                            onClick={handleExportTxt}
                        >
                            <Upload className="w-3.5 h-3.5 mr-2 rotate-180" />
                            Simpan sebagai .txt
                        </Button>
                        <div className="relative">
                            <input 
                                type="file" 
                                accept=".txt" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                onChange={handleImportTxt}
                            />
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-lg h-9 text-xs text-slate-600 border-slate-200 hover:bg-slate-50 font-medium pointer-events-none"
                            >
                                <Upload className="w-3.5 h-3.5 mr-2" />
                                Muat dari .txt
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 bg-slate-50/50">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        readOnly={!canCorrect}
                        placeholder="Belum ada transkrip. Kirim audio dari halaman Operator Rekaman, atau muat dari file .txt yang sudah disimpan sebelumnya."
                        className="w-full min-h-[400px] bg-white rounded-xl border border-slate-200 p-5 text-sm text-slate-600 font-mono leading-relaxed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 resize-y shadow-sm"
                    />
                </div>
            </Card>

            {/* Footer Action */}
            {canCorrect && (
                <div className="flex justify-end pt-2">
                    <Button 
                        onClick={handleSaveTranscript}
                        disabled={isSaving || text === initialText || !firstTranscript}
                        variant="outline"
                        className="mr-3 rounded-xl h-11 px-6 font-bold shadow-sm"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Simpan Perubahan
                    </Button>
                    <Button 
                        onClick={handleFinish} 
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        Selesai & Lanjut ke Absensi
                    </Button>
                </div>
            )}
        </div>
    );
}
