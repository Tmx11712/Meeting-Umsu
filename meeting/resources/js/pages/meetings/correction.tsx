import { Head, router, Link } from '@inertiajs/react';
import { AlertCircle, ChevronDown, ChevronRight, FileAudio2, Loader2, Play, CheckCircle2, XCircle, Upload, Mic, Clock } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { MeetingStepper } from '@/components/meeting-stepper';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { usePermissions } from '@/hooks/use-permissions';
import { useMeetingWebSocket } from '@/hooks/use-meeting-websocket';
import { Meeting } from '@/types/meeting';

export default function MeetingCorrection({ meeting, ...props }: { meeting: Meeting, [key: string]: any }) {
    const { canEdit, hasRole } = usePermissions();
    const canCorrect = canEdit('transcript');
    const isPimpinan = hasRole('Pimpinan');
    const recordings = meeting.recordings || [];

    useMeetingWebSocket(meeting?.id);

    const handleCorrection = (transcriptId: string, originalText: string, correctedText: string) => {
        if (originalText === correctedText) {
return;
}
        
        router.post(`/meetings/${meeting.id}/correction`, {
            transcript_id: transcriptId,
            original_text: originalText,
            corrected_text: correctedText
        }, { preserveScroll: true, preserveState: true });
    };

    const handleFinish = () => {
        router.post(`/meetings/${meeting.id}/correction/finish`);
    };

    const totalTranscripts = recordings.reduce((sum: number, rec: any) => sum + (rec.transcripts?.length || 0), 0);

    return (
        <div className="flex flex-col gap-4 py-2 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title="Koreksi Transkrip" />
            
            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400 mb-2">
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
                <Button variant="outline" asChild className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 shadow-sm h-11">
                    <Link href="/meetings">
                        Kembali ke Jadwal
                    </Link>
                </Button>
            </div>

            {/* Stepper */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-4 rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-sm">
                <MeetingStepper meeting={meeting} activeStage={4} />
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

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-slate-800/60 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Rekaman</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{recordings.length}</p>
                </div>
                <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-slate-800/60 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
                        {recordings.every((r: any) => r.status === 'completed') ? (
                            <><CheckCircle2 className="w-4 h-4" /> Semua Selesai</>
                        ) : (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Sebagian Diproses</>
                        )}
                    </p>
                </div>
            </div>

            {/* Recording Accordions */}
            {recordings.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <FileAudio2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">
                            Belum ada rekaman untuk dikoreksi. Pastikan audio sudah direkam atau diupload.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {recordings.map((recording: any, idx: number) => (
                        <RecordingAccordion
                            key={recording.id}
                            recording={recording}
                            index={idx}
                            meetingId={meeting.id}
                            canCorrect={canCorrect}
                            onCorrection={handleCorrection}
                            defaultOpen={idx === 0}
                        />
                    ))}
                </div>
            )}

            {/* Footer Action */}
            {canCorrect && (
                <Card>
                    <CardFooter className="flex justify-end pt-4 pb-4">
                        <Button 
                            onClick={handleFinish} 
                            disabled={totalTranscripts === 0}
                            className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-xl h-11 px-8 font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            Selesai & Lanjut ke Absensi
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}

// ─── Recording Accordion Component ──────────────────────────────

function RecordingAccordion({ recording, index, meetingId, canCorrect, onCorrection, defaultOpen }: any) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const audioRef = useRef<HTMLAudioElement>(null);
    const transcripts = recording.transcripts || [];

    const statusConfig: Record<string, { color: string; label: string; icon: any }> = {
        completed: { color: 'emerald', label: 'Transkrip Selesai', icon: CheckCircle2 },
        transcribing: { color: 'amber', label: 'Sedang Diproses AI', icon: Loader2 },
        uploaded: { color: 'sky', label: 'Belum Ditranskrip', icon: Upload },
        failed: { color: 'rose', label: 'Gagal Transkripsi', icon: XCircle },
        recording: { color: 'blue', label: 'Sedang Merekam', icon: Mic },
    };

    const status = statusConfig[recording.status] || statusConfig.uploaded;
    const StatusIcon = status.icon;

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const formatFileSize = (bytes: number) => {
        if (!bytes) return '';
        return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    };

    const seekTo = useCallback((seconds: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = seconds;
            audioRef.current.play().catch(() => {});
        }
    }, []);

    const recordingLabel = recording.label || `Rekaman #${index + 1}`;
    const audioStreamUrl = `/meetings/${meetingId}/recording/${recording.id}/stream`;

    return (
        <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
            isOpen 
                ? 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800/50 shadow-md ring-1 ring-blue-100 dark:ring-blue-900/50' 
                : 'bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800/50'
        }`}>
            {/* Accordion Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-4 p-5 text-left cursor-pointer group transition-colors"
            >
                {/* Index Badge */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm shadow-sm transition-colors ${
                    isOpen 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                }`}>
                    {index + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <FileAudio2 className="w-4 h-4 text-blue-500 shrink-0" />
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{recordingLabel}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span>{recording.source === 'upload' ? 'Upload Manual' : 'Rekaman Sistem'}</span>
                        {recording.file_size ? <span>• {formatFileSize(recording.file_size)}</span> : null}
                        {recording.duration_seconds ? <span>• {formatDuration(recording.duration_seconds)}</span> : null}
                        <span>• {transcripts.length} segmen</span>
                    </div>
                </div>

                {/* Status Badge */}
                <Badge 
                    variant="outline" 
                    className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border-${status.color}-200 bg-${status.color}-50 text-${status.color}-700 dark:bg-${status.color}-900/30 dark:text-${status.color}-400 dark:border-${status.color}-800/50`}
                    style={{
                        backgroundColor: status.color === 'emerald' ? 'rgb(236 253 245)' :
                                        status.color === 'amber' ? 'rgb(255 251 235)' :
                                        status.color === 'sky' ? 'rgb(240 249 255)' :
                                        status.color === 'rose' ? 'rgb(255 241 242)' :
                                        'rgb(239 246 255)',
                        color: status.color === 'emerald' ? 'rgb(21 128 61)' :
                               status.color === 'amber' ? 'rgb(180 83 9)' :
                               status.color === 'sky' ? 'rgb(3 105 161)' :
                               status.color === 'rose' ? 'rgb(190 18 60)' :
                               'rgb(29 78 216)',
                        borderColor: status.color === 'emerald' ? 'rgb(187 247 208)' :
                                     status.color === 'amber' ? 'rgb(253 230 138)' :
                                     status.color === 'sky' ? 'rgb(186 230 253)' :
                                     status.color === 'rose' ? 'rgb(254 205 211)' :
                                     'rgb(191 219 254)',
                    }}
                >
                    <StatusIcon className={`w-3 h-3 mr-1.5 ${recording.status === 'transcribing' ? 'animate-spin' : ''}`} />
                    {status.label}
                </Badge>

                {/* Chevron */}
                <div className={`transition-transform duration-300 text-slate-400 ${isOpen ? 'rotate-0' : '-rotate-90'}`}>
                    <ChevronDown className="w-5 h-5" />
                </div>
            </button>

            {/* Accordion Content */}
            {isOpen && (
                <div className="border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 fade-in duration-300">
                    {/* Audio Player */}
                    {(recording.status === 'completed' || recording.status === 'uploaded' || recording.status === 'transcribing') && (
                        <div className="px-5 pt-4 pb-2">
                            <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                                        <Play className="w-4 h-4" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Putar Audio</p>
                                </div>
                                <audio
                                    ref={audioRef}
                                    src={audioStreamUrl}
                                    controls
                                    preload="metadata"
                                    className="w-full h-10 rounded-lg"
                                    style={{ filter: 'contrast(1.1)' }}
                                />
                                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                    💡 Klik timestamp pada transkrip di bawah untuk langsung melompat ke bagian audio tersebut.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Transcript List */}
                    <div className="px-5 pb-5 pt-2">
                        {recording.status === 'transcribing' ? (
                            <div className="flex flex-col items-center justify-center py-10 text-amber-600 dark:text-amber-400">
                                <Loader2 className="w-8 h-8 animate-spin mb-3" />
                                <p className="font-bold text-sm">Sedang diproses oleh AI...</p>
                                <p className="text-xs text-slate-500 mt-1">Proses ini membutuhkan beberapa saat tergantung durasi audio.</p>
                            </div>
                        ) : recording.status === 'failed' ? (
                            <div className="flex flex-col items-center justify-center py-10 text-rose-600 dark:text-rose-400">
                                <XCircle className="w-8 h-8 mb-3" />
                                <p className="font-bold text-sm">Transkripsi gagal</p>
                                <p className="text-xs text-slate-500 mt-1">Silakan coba generate ulang dari halaman Humas Rekam.</p>
                            </div>
                        ) : transcripts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <FileAudio2 className="w-8 h-8 mb-3 text-slate-300" />
                                <p className="font-medium text-sm">Belum ada transkrip untuk rekaman ini.</p>
                                <p className="text-xs text-slate-400 mt-1">Generate transkrip AI terlebih dahulu dari halaman Humas Rekam.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Hasil Transkrip ({transcripts.length} segmen)
                                    </p>
                                </div>
                                {transcripts.map((t: any) => {
                                    const latestCorrection = t.corrections?.length > 0 ? t.corrections[t.corrections.length - 1] : null;
                                    const text = latestCorrection ? latestCorrection.corrected_text : t.text;
                                    
                                    return (
                                        <TranscriptItem 
                                            key={t.id} 
                                            transcript={t} 
                                            initialText={text} 
                                            canCorrect={canCorrect}
                                            hasCorrection={!!latestCorrection}
                                            onSave={(newText: string) => onCorrection(t.id, text, newText)}
                                            onSeek={() => seekTo(t.timestamp_seconds)}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Transcript Item Component ──────────────────────────────────

function TranscriptItem({ transcript, initialText, onSave, onSeek, canCorrect, hasCorrection }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(initialText);

    const handleSave = () => {
        onSave(text);
        setIsEditing(false);
    };

    const formatTimestamp = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`flex gap-3 p-3.5 rounded-xl group transition-all duration-200 ${
            isEditing 
                ? 'bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 shadow-sm' 
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
        }`}>
            {/* Timestamp (clickable for seek) */}
            <button
                onClick={onSeek}
                className="w-14 shrink-0 text-xs font-mono font-bold text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 pt-1 cursor-pointer transition-colors flex items-center gap-1 group/ts"
                title="Klik untuk lompat ke bagian audio ini"
            >
                <Clock className="w-3 h-3 opacity-0 group-hover/ts:opacity-100 transition-opacity" />
                {formatTimestamp(transcript.timestamp_seconds)}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea 
                            className="w-full bg-white dark:bg-slate-900 rounded-lg border border-blue-200 dark:border-blue-800 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
                            rows={3}
                            value={text}
                            onChange={e => setText(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="rounded-lg h-8 text-xs" onClick={() => {
 setText(initialText); setIsEditing(false); 
}}>Batal</Button>
                            <Button size="sm" className="rounded-lg h-8 text-xs bg-blue-600 hover:bg-blue-700" onClick={handleSave}>Simpan Koreksi</Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-2">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300 flex-1">{text}</p>
                        {hasCorrection && (
                            <Badge variant="outline" className="shrink-0 text-[9px] rounded-full px-2 py-0.5 bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50 font-bold">
                                Dikoreksi
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Button */}
            {!isEditing && canCorrect && (
                <div className="shrink-0 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-lg h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 font-bold"
                        onClick={() => setIsEditing(true)}
                    >
                        Koreksi
                    </Button>
                </div>
            )}
        </div>
    );
}
