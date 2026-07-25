import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, UploadCloud, Square, Loader2, RefreshCw, CheckCircle2, PauseCircle, Calendar, Clock, MapPin, Users, Info } from 'lucide-react';
import { MeetingStepper } from '@/components/meeting-stepper';
import { useState, useRef, useEffect } from 'react';

export default function MeetingRecording({ meeting, openAiConfigured }: any) {
    const { auth } = usePage().props as any;
    const roles = auth?.roles || [];
    const dept = auth?.user?.department?.toLowerCase() || '';
    const isHumas = dept.includes('humas') || roles.includes('Bag. Humas') || roles.includes('Humas');
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
        <div className="flex flex-col gap-6 p-8 max-w-[1400px] mx-auto w-full">
            <Head title="Operator Rekam" />
            
            {/* Header & Breadcrumb */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Operator Rekam</h1>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                        <span>Dashboard</span>
                        <span>›</span>
                        <Link href="/meetings" className="hover:text-slate-900">Jadwal Rapat</Link>
                        <span>›</span>
                        <span className="text-slate-900">Operator Rekam</span>
                    </div>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/meetings">
                        Kembali ke Jadwal
                    </Link>
                </Button>
            </div>

            {/* Stepper */}
            <div className="bg-white px-2">
                <MeetingStepper meeting={meeting} activeStage={3} />
            </div>

            {/* Top Cards Row */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Informasi Rapat */}
                <Card className="rounded-xl border-slate-200 shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center text-slate-900">
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md mr-2">
                                <Calendar className="w-4 h-4" />
                            </div>
                            Informasi Rapat
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Judul Rapat</p>
                            <p className="font-semibold text-slate-900 text-base">{meeting.title}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Tanggal</p>
                                <p className="text-sm font-medium flex items-center text-slate-700">
                                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                    {meeting.date}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Waktu</p>
                                <p className="text-sm font-medium flex items-center text-slate-700">
                                    <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                    {meeting.start_time?.substring(0,5)} - {meeting.end_time?.substring(0,5)} WIB
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Ruangan / Lokasi</p>
                                <p className="text-sm font-medium flex items-center text-slate-700">
                                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                    {meeting.location}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Peserta Terdaftar</p>
                                <p className="text-sm font-medium flex items-center text-slate-700">
                                    <Users className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                    {meeting.participants?.length || 0} Peserta
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Meeting */}
                <Card className="rounded-xl border-slate-200 shadow-sm">
                    <CardHeader className="pb-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold text-slate-900">Status Meeting</CardTitle>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 uppercase font-bold text-xs tracking-wider px-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" /> LIVE
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-green-50/50 border border-green-100 rounded-lg p-3 flex items-center justify-center text-green-700 font-medium">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                            Rapat Sedang Berlangsung
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Durasi Rapat</p>
                            <p className="text-3xl font-bold text-slate-900 font-mono tracking-tight">{formatDuration(recordingDuration)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-2">Operator Rekam</p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center text-xs uppercase">
                                    {auth?.user?.name?.substring(0, 2) || 'OP'}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{auth?.user?.name || 'Operator'}</p>
                                    <Badge variant="secondary" className="text-[10px] h-4 bg-blue-50 text-blue-600 hover:bg-blue-50">{auth?.user?.department || 'Operator'}</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Koneksi API */}
                <Card className="rounded-xl border-slate-200 shadow-sm">
                    <CardHeader className="pb-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold text-slate-900">Koneksi OpenAI API</CardTitle>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 font-medium">Terkoneksi</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Status Koneksi</p>
                            <p className="text-sm font-medium text-green-600 flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                Terhubung
                            </p>
                        </div>
                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-xs text-slate-500 mb-1">Model Transkripsi</p>
                            <p className="font-semibold text-slate-900 flex items-center">
                                gpt-4o-mini
                                <Badge variant="secondary" className="ml-2 text-[10px] h-4 bg-green-50 text-green-600 hover:bg-green-50 border-0">Aktif</Badge>
                            </p>
                        </div>
                        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            Sistem telah terhubung ke OpenAI untuk melakukan transkripsi otomatis dan pembuatan notulen berbasis AI.
                        </div>
                        <Button variant="outline" className="w-full text-slate-600">
                            <RefreshCw className="w-4 h-4 mr-2" /> Uji Koneksi
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Areas */}
            <div className="grid md:grid-cols-[1fr_1fr_1.2fr] gap-6 flex-1 min-h-[400px]">
                
                {/* Upload Rekaman */}
                <Card className="rounded-xl border-slate-200 shadow-sm flex flex-col h-full">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-slate-900">Upload Rekaman</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 pb-6 justify-between gap-4">
                        <div className="border-2 border-dashed border-blue-200 rounded-xl bg-slate-50/50 flex-1 flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-12 h-12 bg-white border border-slate-100 rounded-full shadow-sm flex items-center justify-center mb-4 text-blue-600">
                                <UploadCloud className="w-6 h-6" />
                            </div>
                            {isHumas ? (
                                <>
                                    <p className="text-sm font-medium text-slate-700 mb-4">Drag & drop file rekaman di sini<br/><span className="text-slate-400 font-normal">atau</span></p>
                                    
                                    <input 
                                        type="file" 
                                        accept="audio/*" 
                                        className="hidden" 
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                    />
                                    <Button 
                                        onClick={() => fileInputRef.current?.click()} 
                                        disabled={uploading}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        {uploading ? 'Mengupload...' : 'Pilih File'}
                                    </Button>
                                    
                                    <p className="text-[11px] text-slate-400 mt-6">
                                        Format yang didukung: .mp3, .wav, .m4a<br/>
                                        Maksimal ukuran file: 200 MB
                                    </p>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm font-medium text-slate-700 mb-2">Akses Terbatas</p>
                                    <p className="text-xs text-slate-500">Hanya Bagian Humas yang dapat mengunggah rekaman.</p>
                                </div>
                            )}
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
                            <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Pastikan kualitas audio jelas agar hasil transkripsi lebih akurat.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Rekam Dari Sistem */}
                <Card className="rounded-xl border-slate-200 shadow-sm flex flex-col h-full">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-slate-900 flex items-center justify-between">
                            Rekam dari Sistem <Info className="w-3.5 h-3.5 text-slate-400" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 items-center justify-center p-8">
                        <h2 className="text-5xl font-mono font-bold text-slate-900 tracking-tighter mb-2">
                            {formatDuration(recordingDuration)}
                        </h2>
                        <p className="text-sm text-slate-500 mb-8">Waktu perekaman berjalan</p>
                        
                        {/* Fake Visualizer */}
                        <div className="flex items-center justify-center h-16 w-full gap-1 mb-10 overflow-hidden">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div key={i} className={`w-1 rounded-full bg-blue-500 ${Math.random() > 0.5 ? 'h-full' : 'h-1/2'} ${Math.random() > 0.8 ? 'h-1/4' : ''}`} style={{ opacity: isRecording ? 1 : 0.2, animation: isRecording ? `pulse ${0.5 + Math.random()}s infinite` : 'none' }}></div>
                            ))}
                        </div>

                        {isHumas ? (
                            <div className="flex w-full gap-3">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 border-slate-200 hover:bg-slate-50"
                                    onClick={stopRecordingSession}
                                    disabled={!isRecording}
                                >
                                    <Square className="w-4 h-4 mr-2 text-red-500" fill="currentColor" /> Stop Recording
                                </Button>
                                <Button 
                                    className={`flex-1 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                                    onClick={toggleRecording}
                                >
                                    {isRecording ? (
                                        <><PauseCircle className="w-4 h-4 mr-2" /> Pause Recording</>
                                    ) : (
                                        <><Mic className="w-4 h-4 mr-2" /> Start Recording</>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-slate-100 rounded-lg w-full">
                                <p className="text-sm font-medium text-slate-700 mb-1">Akses Terbatas</p>
                                <p className="text-xs text-slate-500">Hanya Bagian Humas yang dapat merekam dari sistem.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Progress Transkripsi & Live Transcript */}
                <div className="flex flex-col gap-6">
                    {uploading && (
                        <Card className="rounded-xl border-slate-200 shadow-sm">
                            <CardHeader className="pb-2 pt-4">
                                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center justify-between">
                                    Progress Transkripsi <Info className="w-3.5 h-3.5 text-slate-400" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <p className="text-xs text-slate-500 mb-3">Proses upload dan transkripsi otomatis sedang berjalan...</p>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-2 bg-slate-100 rounded-full flex-1 overflow-hidden">
                                        <div className="h-full bg-blue-600 w-full rounded-full animate-pulse"></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">Proses...</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="rounded-xl border-slate-200 shadow-sm flex-1 flex flex-col min-h-[200px]">
                        <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between border-b border-slate-50">
                            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                                Live Transcript <Info className="w-3.5 h-3.5 text-slate-400" />
                            </CardTitle>
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-[10px] px-1.5 h-5 flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse" /> Live
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-4 flex-1 overflow-y-auto bg-slate-50/30">
                            <div className="space-y-4 text-xs font-mono">
                                {meeting.transcripts && meeting.transcripts.length > 0 ? meeting.transcripts.map((t: any) => (
                                    <div key={t.id} className="flex gap-3 text-slate-700">
                                        <span className="text-slate-400 shrink-0 w-12">{formatDuration(t.timestamp_seconds || 0)}</span>
                                        <span>{t.text}</span>
                                    </div>
                                )) : null}
                                
                                {liveText.map((text, idx) => (
                                    <div key={idx} className="flex gap-3 text-slate-700 animate-in fade-in">
                                        <span className="text-slate-400 shrink-0 w-12">LIVE</span>
                                        <span>{text}</span>
                                    </div>
                                ))}

                                {(!meeting.transcripts || meeting.transcripts.length === 0) && liveText.length === 0 && (
                                    <div className="text-slate-400 text-center py-8 italic font-sans">
                                        Belum ada transkrip. Mulai merekam untuk melihat transkrip secara langsung.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* Bottom Actions */}
            {isHumas && (
                <div className="mt-4 flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 text-yellow-800">
                        <div className="p-1.5 bg-yellow-100 rounded-full">
                            <Mic className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-medium">Pastikan semua rekaman sudah selesai sebelum mengirimnya ke tahap koreksi.</p>
                    </div>
                    <Button 
                        className="bg-blue-600 hover:bg-blue-700 px-6"
                        onClick={() => {
                            router.post(`/meetings/${meeting.id}/finish-recording`, {}, {
                                onSuccess: () => {
                                    router.visit('/dashboard');
                                }
                            });
                        }}
                    >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Selesai Rekaman & Lanjut Koreksi
                    </Button>
                </div>
            )}
            
        </div>
    );
}
