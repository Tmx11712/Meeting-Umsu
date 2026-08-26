import { Head, usePage, router, Link } from '@inertiajs/react';
// @ts-ignore
import ysFixWebmDuration from 'fix-webm-duration';
import axios from 'axios';
import { Square, UploadCloud, Info, Send, Megaphone, Monitor, AlertCircle, Loader2, Bot, Database, Trash2, Pause, Play, Mic, ArrowLeft, QrCode, Download } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useMeetingWebSocket } from '@/hooks/use-meeting-websocket';
import { usePermissions } from '@/hooks/use-permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { QRCodeCanvas } from 'qrcode.react';
import { showSuccess, showError, confirmDelete } from '@/lib/sweetalert';
import type { Meeting } from '@/types/meeting';

export default function MeetingRecording({ meeting }: { meeting: Meeting }) {
    useMeetingWebSocket(meeting?.id);
    const page = usePage();
    const { canEdit } = usePermissions();
    const canRecord = canEdit('recording');
    const canTranscribe = canEdit('transcript');

    // Server-synced state
    const serverStartedAt = meeting?.recording_started_at ? new Date(meeting.recording_started_at).getTime() : null;
    const isServerRecording = serverStartedAt !== null;

    // Fallback polling now handled globally by useMeetingWebSocket hook
    const [activeTab, setActiveTab] = useState<'upload' | 'record' | 'record_mic'>('record');
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [isQrOpen, setIsQrOpen] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState<number | null>(null);

    const handleDownloadQR = () => {
        const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
        if (!canvas) return;
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_Absensi_${meeting?.title?.replace(/\s+/g, '_') || 'Meeting'}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerTranscription = (recordingId: number) => {
        setIsTranscribing(recordingId);
        router.post(`/meetings/${meeting.id}/recording/transcribe`, {
            recording_id: recordingId
        }, {
            onSuccess: () => {
                showSuccess('Diproses', 'Audio sedang ditranskripsi oleh AI.');
                setIsTranscribing(null);
            },
            onError: () => {
                showError('Error', 'Gagal memulai transkripsi.');
                setIsTranscribing(null);
            }
        });
    };

    const finishRecording = () => {
        router.post(`/meetings/${meeting.id}/finish-recording`);
    };

    const deleteRecording = async (recordingId: number) => {
        const isConfirmed = await confirmDelete(
            'Hapus Rekaman Audio?',
            'File audio yang sudah dihapus tidak dapat dikembalikan.'
        );
        
        if (isConfirmed) {
            router.delete(`/meetings/${meeting.id}/recording/${recordingId}`, {
                onSuccess: () => {
                    showSuccess('Dihapus', 'Rekaman berhasil dihapus.');
                },
                onError: () => {
                    showError('Error', 'Gagal menghapus rekaman.');
                }
            });
        }
    };

    // Timer Logic synced with server
    useEffect(() => {
        let interval: NodeJS.Timeout;
        const isLocalRecorder = mediaRecorderRef.current !== null;

        if (recordedBlob) {
            return () => {};
        }

        if (isServerRecording && serverStartedAt && !isRecording && !isLocalRecorder) {
            // For viewers who are not recording, use server time
            setRecordingDuration(Math.floor((Date.now() - serverStartedAt) / 1000));
            interval = setInterval(() => {
                setRecordingDuration(Math.floor((Date.now() - serverStartedAt) / 1000));
            }, 1000);
        } else if (isRecording && !isPaused) {
            // For the active recorder, just increment locally
            interval = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);
        } else if (!isRecording && !isServerRecording) {
            // We intentionally don't reset to 0 here so viewers can see the final duration
            // while waiting for the host to upload the file.
        }

        return () => clearInterval(interval);
    }, [isRecording, isPaused, isServerRecording, serverStartedAt, recordedBlob]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Reset UI to 00:00:00 when a new recording is successfully saved (e.g. via Websocket sync)
    useEffect(() => {
        if (!isRecording && !isServerRecording) {
            setRecordingDuration(0);
        }
    }, [meeting.recordings?.length]);

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleFileUpload = async (e: any) => {
        const file = e.target.files[0];

        if (!file) {
return;
}

        setUploading(true);
        setUploadProgress(0);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('source', 'upload');

        try {
            const response = await axios.post(`/meetings/${meeting.id}/recording`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                }
            });
            
            await showSuccess('Sukses', 'Audio berhasil diunggah.');
            window.location.reload();
        } catch (error: any) {
            showError('Gagal', error.response?.data?.message || error.message || 'Terjadi kesalahan saat mengunggah.');
        } finally {
            setUploading(false);

            if (fileInputRef.current) {
fileInputRef.current.value = '';
}
        }
    };

    const startRecordingSession = async (mode: 'system' | 'mic' = 'system') => {
        try {
            setErrorMsg('');
            setRecordingDuration(0);
            chunksRef.current = [];
            setRecordedBlob(null);
            setIsPaused(false);

            let stream: MediaStream;
            
            if (mode === 'system') {
                stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                });
                
                if (stream.getAudioTracks().length === 0) {
                    stream.getTracks().forEach(track => track.stop());
                    setErrorMsg('Anda tidak membagikan Audio Sistem. Harap ulangi dan centang "Share system audio".');
                    return;
                }
                
                // Berhenti rekam otomatis jika user menekan "Stop sharing" pada browser UI
                if (stream.getVideoTracks().length > 0) {
                    stream.getVideoTracks()[0].onended = () => {
                        stopRecordingSession();
                    };
                }
            } else {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });
                
                if (stream.getAudioTracks().length === 0) {
                    stream.getTracks().forEach(track => track.stop());
                    setErrorMsg('Mikrofon tidak terdeteksi atau izin ditolak.');
                    return;
                }
            }

            streamRef.current = stream;
            setIsRecording(true);

            // Extract ONLY the audio tracks to ensure the file size is very small
            const audioTracks = stream.getAudioTracks();
            const audioOnlyStream = new MediaStream(audioTracks);

            const mediaRecorder = new MediaRecorder(audioOnlyStream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const fullBlob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
                
                // Inject duration metadata into the WebM blob so the audio player knows its length
                setRecordingDuration(currentDuration => {
                    ysFixWebmDuration(fullBlob, currentDuration * 1000, (fixedBlob: Blob) => {
                        setRecordedBlob(fixedBlob);
                    });
                    return currentDuration;
                });
            };

            mediaRecorder.start(1000);

            // Tembakkan sinyal ke backend bahwa rekaman dimulai
            await axios.post(`/meetings/${meeting.id}/recording/start-session`);

        } catch (err: any) {
            console.error(err);
            if (err.name === 'NotAllowedError') {
                setErrorMsg(`Izin akses ditolak. Harap izinkan browser untuk mengakses ${mode === 'system' ? 'layar/audio' : 'mikrofon'}.`);
            } else {
                setErrorMsg(`Gagal memulai rekaman: ${err.message}`);
            }
        }
    };

    const togglePauseRecording = () => {
        if (!mediaRecorderRef.current) {
return;
}
        
        if (mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
        } else if (mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
        }
    };

    const stopRecordingSession = async () => {
        setIsRecording(false);
        setIsPaused(false);
        
        if (mediaRecorderRef.current && (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')) {
            mediaRecorderRef.current.stop();
        }
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        // Tembakkan sinyal ke backend bahwa rekaman dihentikan
        try {
            await axios.post(`/meetings/${meeting.id}/recording/stop-session`);
        } catch (err) {
            console.error('Gagal menghentikan rekaman di server', err);
        }
    };

    const sendRecordingToBackend = async () => {
        if (!recordedBlob) {
            showError('Perhatian', 'Belum ada rekaman audio yang siap dikirim.');

            return;
        }

        setUploading(true);
        setUploadProgress(0);
        const formData = new FormData();
        formData.append('file', recordedBlob, `rekaman-${Date.now()}.webm`);
        formData.append('source', 'system_record');
        formData.append('duration_seconds', recordingDuration.toString());

        try {
            const response = await axios.post(`/meetings/${meeting.id}/recording`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                }
            });
            
            await showSuccess('Berhasil', 'Rekaman berhasil disimpan dan dikirim ke server.');
            window.location.reload();
        } catch (error: any) {
            showError('Gagal', error.response?.data?.message || error.message || 'Terjadi kesalahan saat menyimpan rekaman.');
        } finally {
            setUploading(false);
            setRecordedBlob(null);
            setRecordingDuration(0);
            mediaRecorderRef.current = null;
        }
    };

    const hasRecordings = meeting?.recordings && meeting.recordings.length > 0;

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title="Operator Rekaman" />

            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link href={`/meetings/${meeting.id}`} className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-slate-700 transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Detail Rapat
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[22px] font-semibold text-slate-900 leading-tight">Operator rekaman</h1>
                        <p className="text-[13px] text-slate-500 mt-1">Tekan Play untuk mulai merekam rapat</p>
                    </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isServerRecording ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`}></div>
                    <span className={`text-[12px] font-bold ${isServerRecording ? 'text-rose-600' : 'text-slate-500'}`}>
                        {isServerRecording ? 'LIVE: Sedang Merekam' : 'Menunggu'}
                    </span>
                </div>
                </div>
            </div>

            {/* Meeting Info Card (Top Section) */}
            <div className="w-full">
                <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                            <Megaphone className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-[14px] font-bold text-slate-900">{meeting?.title || 'Review Strategi'}</h2>
                            <p className="text-[12px] text-slate-500 mt-0.5">{meeting?.location || 'Ruang Rapat'} - {meeting?.date}</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsQrOpen(true)} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 whitespace-nowrap">
                        <QrCode className="mr-2 h-4 w-4" /> Tampilkan QR Absensi
                    </Button>
                </div>
            </div>

            {/* Main Content Layout - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
                
                {/* KOLOM KIRI (Upload & Rekam) - Visible to everyone so Pimpinan can record */}
                <div className={`${hasRecordings ? 'lg:col-span-5' : 'lg:col-span-12'} flex flex-col gap-6 transition-all duration-500`}>
                    {/* Recording Controls */}
                    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm">
                        <div className="flex p-1 gap-1 border-b border-slate-100">
                            <button 
                                onClick={() => setActiveTab('upload')}
                                className={`flex-1 text-[12px] font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${activeTab === 'upload' ? 'bg-blue-50/50 text-blue-600 border border-blue-100/50' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <UploadCloud className={`w-4 h-4 ${activeTab === 'upload' ? 'text-blue-500' : 'text-slate-400'}`} /> Unggah berkas
                            </button>
                            <button 
                                onClick={() => setActiveTab('record')}
                                className={`flex-1 text-[12px] font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${activeTab === 'record' ? 'bg-blue-50/50 text-blue-600 border border-blue-100/50' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Monitor className={`w-4 h-4 ${activeTab === 'record' ? 'text-blue-500' : 'text-slate-400'}`} /> Rekam (Sistem)
                            </button>
                            <button 
                                onClick={() => setActiveTab('record_mic')}
                                className={`flex-1 text-[12px] font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${activeTab === 'record_mic' ? 'bg-blue-50/50 text-blue-600 border border-blue-100/50' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Mic className={`w-4 h-4 ${activeTab === 'record_mic' ? 'text-blue-500' : 'text-slate-400'}`} /> Rekam (Mikrofon)
                            </button>
                        </div>
                        
                        <div className="p-4">
                            {activeTab === 'record' || activeTab === 'record_mic' ? (
                                <>
                                    <div className="flex items-center gap-3 mb-4">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => startRecordingSession(activeTab === 'record' ? 'system' : 'mic')}
                                            disabled={isRecording || !canRecord}
                                            className={`font-semibold h-9 px-3 text-[12px] flex items-center gap-2 ${isRecording ? 'bg-slate-50 text-slate-400 border-slate-200' : 'text-slate-700'}`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full border-[1.5px] ${isRecording ? 'border-slate-400' : 'border-rose-500'}`}></div> 
                                            Mulai rekam
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            onClick={togglePauseRecording}
                                            disabled={!isRecording || !canRecord}
                                            className={`font-semibold h-9 px-3 text-[12px] flex items-center gap-2 ${!isRecording || !canRecord ? 'bg-slate-50 text-slate-400 border-slate-200' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'}`}
                                        >
                                            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                                            {isPaused ? 'Lanjut' : 'Jeda'}
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            onClick={stopRecordingSession}
                                            disabled={(!isRecording && !isServerRecording) || !canRecord}
                                            className={`font-semibold h-9 px-3 text-[12px] flex items-center gap-2 ${(!isRecording && !isServerRecording) || !canRecord ? 'bg-slate-50 text-slate-400 border-slate-200' : 'text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'}`}
                                        >
                                            <Square className="w-3.5 h-3.5" /> Berhenti
                                        </Button>
                                    </div>
                                    {errorMsg && (
                                        <span className="text-[11px] text-rose-500 flex items-center mb-2">
                                            <AlertCircle className="w-3 h-3 mr-1" /> {errorMsg}
                                        </span>
                                    )}
                                    <p className="text-[11px] text-slate-500 flex items-start gap-2 leading-relaxed">
                                        <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                                        {activeTab === 'record' 
                                            ? 'Browser akan menampilkan dialog "Choose what to share" - pilih tab/jendela rapat (Zoom/Teams/dll) dan pastikan centang "Share system audio".' 
                                            : 'Pastikan untuk memberikan izin (Allow) pada browser untuk mengakses Mikrofon saat popup muncul.'}
                                    </p>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                                    <UploadCloud className="w-8 h-8 mb-2 opacity-50" />
                                    <p className="text-xs font-medium text-slate-600 mb-4">Unggah file audio secara manual</p>
                                    <input 
                                        type="file" 
                                        accept="audio/*" 
                                        className="hidden" 
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                    />
                                    <Button 
                                        onClick={() => canRecord && fileInputRef.current?.click()}
                                        disabled={uploading || !canRecord}
                                        className="bg-blue-600 hover:bg-blue-700 h-9 text-[12px] px-6"
                                    >
                                        {uploading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
                                        {uploading ? 'Mengunggah...' : 'Pilih File Audio'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timer & Send Action */}
                    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-12 flex flex-col items-center text-center relative overflow-hidden">
                        {uploading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center px-12">
                                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                                <p className="text-sm font-bold text-emerald-700 mb-3">Mengirim audio ke server... {uploadProgress}%</p>
                                <div className="w-full max-w-xs h-2.5 bg-emerald-100 rounded-full overflow-hidden shadow-inner">
                                    <div 
                                        className="h-full bg-emerald-500 transition-all duration-300 ease-out rounded-full"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {(!isRecording && !isServerRecording && recordingDuration > 0 && !recordedBlob && (activeTab === 'record' || activeTab === 'record_mic')) && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center px-12 animate-in fade-in duration-500">
                                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                                <p className="text-sm font-bold text-emerald-700 mb-2">Operator sedang mengunggah file rekaman...</p>
                                <p className="text-xs text-slate-500 mb-4">Selesai merekam ({formatDuration(recordingDuration)})</p>
                                <div className="w-full max-w-xs h-2.5 bg-emerald-100 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-emerald-500 w-full animate-pulse rounded-full"></div>
                                </div>
                            </div>
                        )}

                        
                        <div className="flex items-center gap-1.5 mb-6">
                            <div className={`w-0.75 h-0.75 rounded-full ${isServerRecording ? 'bg-rose-500/80 animate-pulse' : 'bg-slate-300'}`}></div>
                            <div className={`w-0.75 h-0.75 rounded-full ${isServerRecording ? 'bg-rose-500/80 animate-pulse' : 'bg-slate-300'}`} style={{animationDelay: '150ms'}}></div>
                            <div className={`w-0.75 h-0.75 rounded-full ${isServerRecording ? 'bg-rose-500/80 animate-pulse' : 'bg-slate-300'}`} style={{animationDelay: '300ms'}}></div>
                            <div className={`w-0.75 h-0.75 rounded-full ${isServerRecording ? 'bg-rose-500/80 animate-pulse' : 'bg-slate-300'}`} style={{animationDelay: '450ms'}}></div>
                            <div className={`w-0.75 h-0.75 rounded-full ${isServerRecording ? 'bg-rose-500/80 animate-pulse' : 'bg-slate-300'}`} style={{animationDelay: '600ms'}}></div>
                        </div>
                        
                        <div className={`font-mono text-5xl font-black tracking-widest mb-3 text-slate-900`}>
                            {formatDuration(recordingDuration)}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium mb-10">Waktu proses perekaman</p>
                        
                        <button 
                            onClick={sendRecordingToBackend}
                            disabled={isRecording || !recordedBlob || uploading}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all mb-6 shadow-sm ${(!recordedBlob || isRecording) ? 'bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed' : 'bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100 hover:scale-105 cursor-pointer'}`}
                            title={isRecording ? 'Harap hentikan perekaman terlebih dahulu' : !recordedBlob ? 'Belum ada rekaman tersimpan' : 'Kirim rekaman sekarang'}
                        >
                            <Send className="w-5 h-5 ml-0.5" />
                        </button>
                        
                        <h3 className="text-[14px] font-bold text-slate-900 mb-1">Kirim audio ke backend</h3>
                        <p className="text-[12px] text-slate-500">Pastikan proses rekaman telah dihentikan sebelum mengirim file</p>
                        
                        {recordedBlob && !isRecording && (
                            <div className="mt-4 px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full border border-emerald-100">
                                ✓ Audio {(recordedBlob.size / 1024 / 1024).toFixed(2)} MB siap dikirim
                            </div>
                        )}
                    </div>
                </div>

                {/* KOLOM KANAN (Hasil Audio & Transkripsi) */}
                {hasRecordings && (
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {/* Hasil Audio Tersimpan */}
                        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6">
                            <h3 className="text-[15px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Database className="w-4 h-4 text-slate-500" /> Hasil Audio Tersimpan
                            </h3>
                            
                            <div className="flex flex-col gap-4">
                                {meeting.recordings.map((rec: any, index: number) => (
                                    <div key={rec.id} className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/30">
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-700 text-[13px]">Rekaman #{index + 1}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rec.status === 'uploaded' ? 'bg-amber-100 text-amber-700' : rec.status === 'transcribing' ? 'bg-blue-100 text-blue-700 animate-pulse' : rec.status === 'failed' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                    {rec.status === 'uploaded' ? 'Menunggu Transkripsi' : rec.status === 'transcribing' ? 'Sedang Diproses AI...' : rec.status === 'failed' ? 'Gagal Transkripsi' : 'Selesai Transkripsi'}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mb-3">
                                                {new Date(rec.created_at).toLocaleString('id-ID')} • {(rec.file_size / 1024 / 1024).toFixed(2)} MB
                                                {rec.duration_seconds ? ` • ${formatDuration(rec.duration_seconds)}` : ''}
                                            </p>
                                            
                                            <audio controls src={`/meetings/${meeting.id}/recording/${rec.id}/stream`} className="h-9 w-full max-w-sm rounded-lg border border-slate-200/60" />
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                            {rec.status !== 'transcribing' && (
                                                <>
                                                    {canRecord && (
                                                        <Button 
                                                            variant="outline"
                                                            onClick={() => deleteRecording(rec.id)}
                                                            className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 text-xs h-9 px-3 shadow-sm flex-none"
                                                            disabled={isTranscribing === rec.id}
                                                            title="Hapus Rekaman"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {canTranscribe && (
                                                        <Button 
                                                            onClick={() => triggerTranscription(rec.id)}
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-xs h-9 flex-1 sm:flex-none shadow-sm"
                                                            disabled={!canTranscribe || isTranscribing === rec.id}
                                                        >
                                                            {isTranscribing === rec.id ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Bot className="w-3.5 h-3.5 mr-2" />}
                                                            {isTranscribing === rec.id ? 'Memproses...' : (rec.status === 'completed' ? 'Ulangi Transkripsi AI' : 'Mulai Transkripsi AI')}
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Selesai Rekaman Action */}
                        {canTranscribe && (
                            <div className="flex justify-end">
                                <Button 
                                    onClick={finishRecording}
                                    className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-sm h-11 px-6 text-sm"
                                >
                                    Selesai & Lanjut Koreksi
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* QR Absensi Modal */}
            <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">QR Code Absensi</DialogTitle>
                        <DialogDescription className="text-center">
                            Scan QR Code ini menggunakan aplikasi UMSU Employee untuk mencatat kehadiran pada rapat.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-6 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <QRCodeCanvas
                                id="qr-code-canvas"
                                value={`http://192.168.100.98:8000/attend/${meeting.id}`}
                                size={250}
                                level="H"
                                includeMargin={false}
                            />
                        </div>
                        <div className="text-center space-y-1">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{meeting.title}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {meeting.date} • {meeting.start_time?.substring(0, 5)} - {meeting.end_time?.substring(0, 5)}
                            </p>
                        </div>
                        <Button onClick={handleDownloadQR} className="mt-2" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download QR Code
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
