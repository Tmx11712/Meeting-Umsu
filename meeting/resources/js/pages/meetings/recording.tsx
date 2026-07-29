import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, UploadCloud, Square, Loader2, RefreshCw, CheckCircle2, PauseCircle, Calendar, Clock, MapPin, Users, Info } from 'lucide-react';
import { MeetingStepper } from '@/components/meeting-stepper';
import { useState, useRef, useEffect } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

export default function MeetingRecording({ meeting, openAiConfigured }: any) {
    const { auth } = usePage().props as any;
    const { canEdit } = usePermissions();
    const canRecord = canEdit('recording');
    const [isRecording, setIsRecording] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [liveText, setLiveText] = useState<string[]>([]);
    const [recordingDuration, setRecordingDuration] = useState(0);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Live Recording Refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunkIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const sequenceRef = useRef(1);
    const recordingIdRef = useRef<number | null>(null);
    const isRecordingRef = useRef(false); 

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (chunkIntervalRef.current) clearTimeout(chunkIntervalRef.current);
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        };
    }, []);

    const handleFileUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('source', 'upload');

        try {
            const response = await fetch(`/meetings/${meeting.id}/recording`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            const data = await response.json();
            if (response.ok) {
                alert('Audio berhasil diupload dan sedang ditranskripsi.');
                window.location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan saat upload.');
        } finally {
            setUploading(false);
        }
    };

    const sendChunk = async (blob: Blob) => {
        if (blob.size === 0) return;
        
        const formData = new FormData();
        // Fallback file name
        formData.append('file', blob, `chunk-${sequenceRef.current}.webm`);
        formData.append('sequence_order', sequenceRef.current.toString());
        if (recordingIdRef.current) {
            formData.append('recording_id', recordingIdRef.current.toString());
        }

        try {
            const response = await fetch(`/meetings/${meeting.id}/recording/chunk`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            const data = await response.json();
            if (data.success) {
                if (!recordingIdRef.current && data.recording_id) {
                    recordingIdRef.current = data.recording_id;
                }
                if (data.text) {
                    setLiveText(prev => [...prev, data.text]);
                }
            }
        } catch (error) {
            console.error('Failed to send chunk', error);
        }
        
        sequenceRef.current += 1;
    };

    const recordNextChunk = () => {
        if (!streamRef.current || !isRecordingRef.current) return;

        try {
            const mediaRecorder = new MediaRecorder(streamRef.current);
            mediaRecorderRef.current = mediaRecorder;

            const chunks: Blob[] = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: mediaRecorder.mimeType || 'audio/webm' });
                sendChunk(blob);
            };

            mediaRecorder.start();

            // Stop and restart every 10 seconds to generate a chunk for live transcription
            chunkIntervalRef.current = setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                    if (isRecordingRef.current) {
                        recordNextChunk();
                    }
                }
            }, 10000);
        } catch (err) {
            console.error('MediaRecorder error', err);
            stopRecordingSession();
        }
    };

    const startRecordingSession = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            isRecordingRef.current = true;
            setIsRecording(true);
            setRecordingDuration(0);
            sequenceRef.current = 1;
            recordingIdRef.current = null;
            setLiveText([]);

            recordNextChunk();
        } catch (err) {
            console.error(err);
            alert('Tidak dapat mengakses mikrofon. Pastikan Anda telah memberikan izin dan mengakses via localhost/HTTPS.');
        }
    };

    const stopRecordingSession = () => {
        isRecordingRef.current = false;
        setIsRecording(false);
        
        if (chunkIntervalRef.current) {
            clearTimeout(chunkIntervalRef.current);
        }

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        
        // Let the last chunk finish uploading then refresh
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecordingSession();
        } else {
            startRecordingSession();
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title="Operator Rekam" />
            
            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 mb-2">
                        Operator Rekam
                    </h1>
                    <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                        <span>Dashboard</span>
                        <span>›</span>
                        <Link href="/meetings" className="hover:text-indigo-600 transition-colors">Jadwal Rapat</Link>
                        <span>›</span>
                        <span className="text-indigo-900 dark:text-indigo-300 font-bold">Operator Rekam</span>
                    </div>
                </div>
                <Button variant="outline" asChild className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 shadow-sm">
                    <Link href="/meetings">
                        Kembali ke Jadwal
                    </Link>
                </Button>
            </div>

            {/* Stepper */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-4 rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-sm">
                <MeetingStepper meeting={meeting} activeStage={3} />
            </div>

            {!canRecord && (
                <Alert variant="destructive" className="bg-rose-50/80 text-rose-900 border-rose-200 rounded-2xl backdrop-blur-sm">
                    <AlertCircle className="h-5 w-5 text-rose-600" />
                    <AlertTitle className="text-rose-800 font-bold text-base ml-2">Mode Hanya Baca</AlertTitle>
                    <AlertDescription className="text-rose-700 ml-2 mt-1 font-medium">
                        Anda tidak memiliki izin untuk mengelola rekaman rapat ini. Anda hanya dapat melihat status rekaman.
                    </AlertDescription>
                </Alert>
            )}

            {/* Top Cards Row */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Informasi Rapat */}
                <Card className="rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-4 bg-indigo-50/50 dark:bg-indigo-900/20 border-b border-indigo-100/50 dark:border-indigo-800/30">
                        <CardTitle className="text-base font-bold flex items-center text-indigo-900 dark:text-indigo-100">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 rounded-xl mr-3 shadow-sm">
                                <Calendar className="w-4 h-4" />
                            </div>
                            Informasi Rapat
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-5">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Judul Rapat</p>
                            <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{meeting.title}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Tanggal</p>
                                <p className="text-sm font-medium flex items-center text-slate-700 dark:text-slate-300">
                                    <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                                    {meeting.date}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Waktu</p>
                                <p className="text-sm font-medium flex items-center text-slate-700 dark:text-slate-300">
                                    <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                                    {meeting.start_time?.substring(0,5)} - {meeting.end_time?.substring(0,5)} WIB
                                </p>
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Ruangan</p>
                                <div className="text-sm font-medium flex items-center text-slate-700 dark:text-slate-300">
                                    <MapPin className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                                    <span className="truncate" title={meeting.location}>{meeting.location}</span>
                                </div>
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Peserta</p>
                                <div className="text-sm font-medium flex items-center text-slate-700 dark:text-slate-300">
                                    <Users className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                                    <span className="truncate">{meeting.participants?.length || 0} Peserta</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Meeting */}
                <Card className="rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-4 bg-emerald-50/50 dark:bg-emerald-900/20 border-b border-emerald-100/50 dark:border-emerald-800/30 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-bold text-emerald-900 dark:text-emerald-100">Status Rekaman</CardTitle>
                        <Badge variant="outline" className={`border-emerald-200 uppercase font-bold text-xs tracking-wider px-3 py-1 rounded-full ${isRecording ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                            {isRecording && <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />} 
                            {isRecording ? 'LIVE' : 'STANDBY'}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-5">
                        {isRecording ? (
                            <div className="bg-emerald-100/50 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 rounded-2xl p-4 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold shadow-sm">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3 animate-ping" />
                                Perekaman Sedang Berlangsung
                            </div>
                        ) : (
                            <div className="bg-slate-100/50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold shadow-sm">
                                Sistem Siap Merekam
                            </div>
                        )}
                        <div>
                            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Durasi Rapat</p>
                            <p className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">{formatDuration(recordingDuration)}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-sm uppercase shadow-sm">
                                {auth?.user?.name?.substring(0, 2) || 'OP'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{auth?.user?.name || 'Operator'}</p>
                                <p className="text-xs font-medium text-slate-500">{auth?.user?.department || 'Operator'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Koneksi API */}
                <Card className="rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-4 bg-sky-50/50 dark:bg-sky-900/20 border-b border-sky-100/50 dark:border-sky-800/30 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-bold text-sky-900 dark:text-sky-100">Koneksi Sistem AI</CardTitle>
                        <Badge variant="outline" className="bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/50 dark:text-sky-300 dark:border-sky-800 font-bold rounded-full px-3">Online</Badge>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Status API</p>
                                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    Terhubung (OpenAI)
                                </p>
                            </div>
                            <div className="p-3 bg-sky-50 dark:bg-sky-900/30 rounded-2xl">
                                <RefreshCw className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                            </div>
                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-800/50 pt-5">
                            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Model Transkripsi</p>
                            <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 mr-3 rounded-lg">gpt-4o-mini</Badge>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Siap memproses audio</span>
                            </div>
                        </div>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed px-1">
                            Sistem terhubung ke server AI untuk melakukan transkripsi otomatis dan pemrosesan natural language.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Areas */}
            <div className="grid md:grid-cols-[1fr_1fr_1.2fr] gap-6 flex-1 min-h-[400px]">
                
                {/* Upload Rekaman */}
                <Card className="rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col h-full overflow-hidden">
                    <CardHeader className="pb-2 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800/50">
                        <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Upload Manual</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 pb-6 pt-6 justify-between gap-4">
                        <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-800/50 rounded-[2rem] bg-indigo-50/30 dark:bg-indigo-900/10 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/20 transition-colors flex-1 flex flex-col items-center justify-center p-6 text-center cursor-pointer group" onClick={() => canRecord && fileInputRef.current?.click()}>
                            <div className="w-16 h-16 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full shadow-sm flex items-center justify-center mb-5 text-indigo-500 group-hover:scale-110 group-hover:text-indigo-600 transition-all duration-300">
                                <UploadCloud className="w-8 h-8" />
                            </div>
                            {canRecord ? (
                                <>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Klik untuk Upload File<br/><span className="text-slate-400 font-medium text-xs mt-1 block">Drag & drop didukung</span></p>
                                    
                                    <input 
                                        type="file" 
                                        accept="audio/*" 
                                        className="hidden" 
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                    />
                                    <Button 
                                        disabled={uploading}
                                        className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                    >
                                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        {uploading ? 'Mengupload...' : 'Pilih File Rekaman'}
                                    </Button>
                                    
                                    <p className="text-[11px] font-medium text-slate-400 mt-6 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                        Format: .mp3, .wav, .m4a (Max 200MB)
                                    </p>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm font-bold text-slate-700 mb-2">Akses Terbatas</p>
                                    <p className="text-xs text-slate-500">Hanya Bagian Humas yang dapat mengunggah rekaman.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Rekam Dari Sistem */}
                <Card className="rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col h-full overflow-hidden relative">
                    {/* Pulsing background effect when recording */}
                    {isRecording && (
                        <div className="absolute inset-0 bg-indigo-500/5 animate-pulse rounded-3xl pointer-events-none"></div>
                    )}
                    <CardHeader className="pb-2 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800/50 relative z-10">
                        <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                            Perekam Sistem
                            {isRecording && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span></span>}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 items-center justify-center p-8 relative z-10">
                        <h2 className={`text-6xl font-mono font-black tracking-tighter mb-2 transition-colors duration-500 ${isRecording ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {formatDuration(recordingDuration)}
                        </h2>
                        <p className="text-sm font-medium text-slate-500 mb-10 bg-slate-100/50 dark:bg-slate-800/50 px-4 py-1 rounded-full">Durasi Perekaman Aktif</p>
                        
                        {/* Fake Visualizer - Looks like a premium audio wave */}
                        <div className="flex items-center justify-center h-20 w-full gap-1.5 mb-12 overflow-hidden px-4">
                            {Array.from({ length: 32 }).map((_, i) => {
                                // Create a dynamic curve look
                                const heightBase = Math.sin(i / 5) * 40 + 50; 
                                const randH = isRecording ? heightBase + (Math.random() * 40 - 20) : 10;
                                return (
                                    <div 
                                        key={i} 
                                        className="w-1.5 rounded-full transition-all duration-150 ease-out" 
                                        style={{ 
                                            height: `${Math.max(4, randH)}%`,
                                            backgroundColor: isRecording ? `hsl(230, 80%, ${60 + (i%5)*5}%)` : 'currentColor',
                                            opacity: isRecording ? 1 : 0.1, 
                                        }}
                                    ></div>
                                );
                            })}
                        </div>

                        {canRecord ? (
                            <div className="flex w-full gap-4">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 border-rose-200 hover:bg-rose-50 text-rose-600 rounded-2xl h-14 font-bold text-base transition-all"
                                    onClick={stopRecordingSession}
                                    disabled={!isRecording}
                                >
                                    <Square className="w-5 h-5 mr-2" fill="currentColor" /> Stop
                                </Button>
                                <Button 
                                    className={`flex-1 rounded-2xl h-14 font-bold text-base shadow-md transition-all ${
                                        isRecording 
                                        ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                                        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white hover:shadow-lg hover:-translate-y-1'
                                    }`}
                                    onClick={toggleRecording}
                                >
                                    {isRecording ? (
                                        <><PauseCircle className="w-5 h-5 mr-2" /> Pause</>
                                    ) : (
                                        <><Mic className="w-5 h-5 mr-2" /> Start Record</>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-slate-100 rounded-2xl w-full">
                                <p className="text-sm font-bold text-slate-700 mb-1">Akses Terbatas</p>
                                <p className="text-xs font-medium text-slate-500">Hanya Bagian Humas yang dapat merekam.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Progress Transkripsi & Live Transcript */}
                <div className="flex flex-col gap-6">
                    {uploading && (
                        <Card className="rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="pb-3 pt-5 bg-blue-50/50 dark:bg-blue-900/20 border-b border-blue-100/50 dark:border-blue-800/30">
                                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                    Proses Transkripsi AI
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-5 pt-4">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-slate-700 dark:text-slate-300">Mengolah Audio...</span>
                                            <span className="text-blue-600 dark:text-blue-400">Processing</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-full rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[11px] font-medium text-slate-500 text-center">AI sedang mentranskripsi percakapan ke dalam teks.</p>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex-1 flex flex-col min-h-[250px] overflow-hidden">
                        <CardHeader className="pb-3 pt-5 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800/50 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                Live AI Transcript
                            </CardTitle>
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold text-[10px] px-2 h-5 flex items-center rounded-full">
                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isRecording ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`} /> 
                                {isRecording ? 'Stream Aktif' : 'Menunggu'}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/20">
                            <div className="p-5 space-y-4 text-sm font-mono">
                                {meeting.transcripts && meeting.transcripts.length > 0 ? meeting.transcripts.map((t: any) => (
                                    <div key={t.id} className="flex gap-4 text-slate-700 dark:text-slate-300 group">
                                        <span className="text-slate-400 shrink-0 w-14 font-semibold group-hover:text-indigo-400 transition-colors">{formatDuration(t.timestamp_seconds || 0)}</span>
                                        <span className="leading-relaxed">{t.text}</span>
                                    </div>
                                )) : null}
                                
                                {liveText.map((text, idx) => (
                                    <div key={idx} className="flex gap-4 text-indigo-900 dark:text-indigo-200 animate-in fade-in slide-in-from-bottom-2">
                                        <span className="text-indigo-400 shrink-0 w-14 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-1 rounded flex items-center justify-center text-xs">LIVE</span>
                                        <span className="leading-relaxed">{text}</span>
                                    </div>
                                ))}

                                {(!meeting.transcripts || meeting.transcripts.length === 0) && liveText.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-10 text-slate-400 opacity-60">
                                        <Mic className="w-10 h-10 mb-3 text-slate-300" />
                                        <p className="font-sans font-medium text-sm text-center px-4">Ruang transkrip kosong.<br/>Mulai merekam untuk melihat hasil AI secara real-time.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* Bottom Actions */}
            {canRecord && (
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 text-emerald-800 dark:text-emerald-400 mb-4 sm:mb-0">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-base font-bold">Langkah Perekaman Selesai?</p>
                            <p className="text-sm font-medium opacity-80">Pastikan semua sesi telah terekam sebelum lanjut ke tahap koreksi teks.</p>
                        </div>
                    </div>
                    <Button 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 px-8 font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                        onClick={() => {
                            router.post(`/meetings/${meeting.id}/finish-recording`, {}, {
                                onSuccess: () => {
                                    router.visit('/dashboard');
                                }
                            });
                        }}
                    >
                        Tutup Perekaman & Lanjut <CheckCircle2 className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            )}
            
        </div>
    );
}
