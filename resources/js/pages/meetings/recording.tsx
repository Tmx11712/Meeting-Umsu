import { Head, usePage, router, Link } from '@inertiajs/react';
import ysFixWebmDuration from 'fix-webm-duration';
import {
    Square,
    UploadCloud,
    Info,
    Send,
    Megaphone,
    Monitor,
    AlertCircle,
    Loader2,
    Bot,
    Database,
    Trash2,
    Pause,
    Play,
    Mic,
    ArrowLeft,
    QrCode,
    Download,
} from 'lucide-react';
import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { useIsClient } from '@/hooks/use-is-client';
import { useMeetingWebSocket } from '@/hooks/use-meeting-websocket';
import { usePermissions } from '@/hooks/use-permissions';
import type { Meeting } from '@/types/meeting';

// Lazy-load QRCodeCanvas agar tidak crash saat SSR (Node.js tidak punya Canvas API)
const QRCodeCanvas = lazy(() =>
    import('qrcode.react').then((m) => ({ default: m.QRCodeCanvas })),
);

function getCsrfHeaders(): Record<string, string> {
    if (typeof document === 'undefined') {
        return {};
    }

    const xsrfMatch = document.cookie.match(
        new RegExp('(^| )XSRF-TOKEN=([^;]+)'),
    );
    const xsrfToken = xsrfMatch ? decodeURIComponent(xsrfMatch[2]) : '';
    const metaToken =
        (
            document.head.querySelector(
                'meta[name="csrf-token"]',
            ) as HTMLMetaElement
        )?.content || '';

    const headers: Record<string, string> = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    };

    if (xsrfToken) {
        headers['X-XSRF-TOKEN'] = xsrfToken;
    } else if (metaToken) {
        headers['X-CSRF-TOKEN'] = metaToken;
    }

    return headers;
}

function uploadRecordingForm(
    url: string,
    formData: FormData,
    onProgress: (percent: number) => void,
): Promise<void> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.withCredentials = true;

        const headers = getCsrfHeaders();

        for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value);
        }

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && event.total > 0) {
                onProgress(Math.round((event.loaded * 100) / event.total));
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();

                return;
            }

            let errorMessage = `Upload gagal (HTTP ${xhr.status}).`;

            try {
                const parsed = JSON.parse(xhr.responseText);

                if (parsed?.message) {
                    errorMessage = parsed.message;
                }
            } catch {
                // Pertahankan pesan fallback default bila body bukan JSON
            }

            reject(new Error(errorMessage));
        };

        xhr.onerror = () => {
            reject(
                new Error('Koneksi jaringan terputus saat mengunggah rekaman.'),
            );
        };

        xhr.send(formData);
    });
}

async function postSessionSignal(url: string): Promise<void> {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            ...getCsrfHeaders(),
            'Content-Type': 'application/json',
        },
        body: '{}',
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
}

export default function MeetingRecording({ meeting }: { meeting: Meeting }) {
    useMeetingWebSocket(meeting?.id);
    const page = usePage();
    const { canEdit } = usePermissions();
    const canRecord = canEdit('recording');
    const canTranscribe = canEdit('transcript');

    // Server-synced state
    const serverStartedAt = meeting?.recording_started_at
        ? new Date(meeting.recording_started_at).getTime()
        : null;
    const isServerRecording = serverStartedAt !== null;

    // Fallback polling now handled globally by useMeetingWebSocket hook
    const [activeTab, setActiveTab] = useState<
        'upload' | 'record' | 'record_mic'
    >('record');
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [isQrOpen, setIsQrOpen] = useState(false);
    const isClient = useIsClient();
    const [isTranscribing, setIsTranscribing] = useState<string | null>(null);

    const handleDownloadQR = () => {
        const canvas = document.getElementById(
            'qr-code-canvas',
        ) as HTMLCanvasElement;

        if (!canvas) {
            return;
        }

        const pngUrl = canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');
        const downloadLink = document.createElement('a');
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
    const recordingDurationRef = useRef(0);

    useEffect(() => {
        recordingDurationRef.current = recordingDuration;
    }, [recordingDuration]);

    const triggerTranscription = async (recordingId: string) => {
        setIsTranscribing(recordingId);
        const { showSuccess, showError } = await import('@/lib/sweetalert');
        router.post(
            `/meetings/${meeting.id}/recording/transcribe`,
            {
                recording_id: recordingId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Jangan panggil showSuccess di sini karena akan bertabrakan dengan flash message dari backend
                    setIsTranscribing(null);
                },
                onError: () => {
                    showError('Error', 'Gagal memulai transkripsi.');
                    setIsTranscribing(null);
                },
            },
        );
    };

    const finishRecording = () => {
        router.post(`/meetings/${meeting.id}/finish-recording`);
    };

    const deleteRecording = async (recordingId: string) => {
        const { showSuccess, showError, confirmDelete } =
            await import('@/lib/sweetalert');
        const isConfirmed = await confirmDelete(
            'Hapus Rekaman Audio?',
            'File audio yang sudah dihapus tidak dapat dikembalikan.',
        );

        if (isConfirmed) {
            router.delete(`/meetings/${meeting.id}/recording/${recordingId}`, {
                onSuccess: () => {
                    showSuccess('Dihapus', 'Rekaman berhasil dihapus.');
                },
                onError: () => {
                    showError('Error', 'Gagal menghapus rekaman.');
                },
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

        if (
            isServerRecording &&
            serverStartedAt &&
            !isRecording &&
            !isLocalRecorder
        ) {
            // For viewers who are not recording, use server time
            setRecordingDuration(
                Math.floor((Date.now() - serverStartedAt) / 1000),
            );
            interval = setInterval(() => {
                setRecordingDuration(
                    Math.floor((Date.now() - serverStartedAt) / 1000),
                );
            }, 1000);
        } else if (isRecording && !isPaused) {
            // For the active recorder, just increment locally
            interval = setInterval(() => {
                setRecordingDuration((prev) => prev + 1);
            }, 1000);
        } else if (!isRecording && !isServerRecording) {
            // We intentionally don't reset to 0 here so viewers can see the final duration
            // while waiting for the host to upload the file.
        }

        return () => clearInterval(interval);
    }, [
        isRecording,
        isPaused,
        isServerRecording,
        serverStartedAt,
        recordedBlob,
    ]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    // Cegah tab tertutup / reload tidak sengaja saat sedang merekam atau audio belum terkirim
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isRecording || recordedBlob || uploading) {
                e.preventDefault();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isRecording, recordedBlob, uploading]);

    // Reset UI to 00:00:00 only when a new recording is successfully saved
    const prevRecordingsLength = useRef(meeting.recordings?.length || 0);
    useEffect(() => {
        const currentLength = meeting.recordings?.length || 0;

        if (currentLength > prevRecordingsLength.current) {
            setRecordingDuration(0);
        }

        prevRecordingsLength.current = currentLength;
    }, [meeting.recordings?.length]);

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { showSuccess, showError } = await import('@/lib/sweetalert');
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('source', 'upload');

        try {
            await uploadRecordingForm(
                `/meetings/${meeting.id}/recording`,
                formData,
                setUploadProgress,
            );

            await showSuccess('Sukses', 'Audio berhasil diunggah.');
            window.location.reload();
        } catch (error: any) {
            showError(
                'Gagal',
                error.message || 'Terjadi kesalahan saat mengunggah.',
            );
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
                    audio: true,
                });

                if (stream.getAudioTracks().length === 0) {
                    stream.getTracks().forEach((track) => track.stop());
                    setErrorMsg(
                        'Anda tidak membagikan Audio Sistem. Harap ulangi dan centang "Share system audio".',
                    );

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
                        autoGainControl: true,
                    },
                });

                if (stream.getAudioTracks().length === 0) {
                    stream.getTracks().forEach((track) => track.stop());
                    setErrorMsg('Mikrofon tidak terdeteksi atau izin ditolak.');

                    return;
                }
            }

            streamRef.current = stream;
            setIsRecording(true);

            // Extract ONLY the audio tracks to ensure the file size is very small
            const audioTracks = stream.getAudioTracks();
            const audioOnlyStream = new MediaStream(audioTracks);

            const preferredMimeType = 'audio/webm;codecs=opus';
            const fallbackMimeType = 'audio/webm';

            let mimeType = '';

            if (MediaRecorder.isTypeSupported(preferredMimeType)) {
                mimeType = preferredMimeType;
            } else if (MediaRecorder.isTypeSupported(fallbackMimeType)) {
                mimeType = fallbackMimeType;
            }

            if (!mimeType) {
                throw new Error(
                    'Browser tidak mendukung format audio recording WebM yang diperlukan oleh sistem.',
                );
            }

            const mediaRecorder = new MediaRecorder(audioOnlyStream, {
                mimeType,
                audioBitsPerSecond: 48000,
            });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const fullBlob = new Blob(chunksRef.current, {
                    type: mimeType,
                });

                // Inject duration metadata into the WebM blob outside state updater
                ysFixWebmDuration(
                    fullBlob,
                    recordingDurationRef.current * 1000,
                    (fixedBlob: Blob) => {
                        setRecordedBlob(fixedBlob);
                    },
                );
            };

            mediaRecorder.start(1000);

            // Tembakkan sinyal ke backend bahwa rekaman dimulai
            await postSessionSignal(
                `/meetings/${meeting.id}/recording/start-session`,
            );
        } catch (err: any) {
            console.error(err);

            if (err.name === 'NotAllowedError') {
                setErrorMsg(
                    `Izin akses ditolak. Harap izinkan browser untuk mengakses ${mode === 'system' ? 'layar/audio' : 'mikrofon'}.`,
                );
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

        if (
            mediaRecorderRef.current &&
            (mediaRecorderRef.current.state === 'recording' ||
                mediaRecorderRef.current.state === 'paused')
        ) {
            mediaRecorderRef.current.stop();
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        // Tembakkan sinyal ke backend bahwa rekaman dihentikan
        try {
            await postSessionSignal(
                `/meetings/${meeting.id}/recording/stop-session`,
            );
        } catch (err) {
            console.error('Gagal menghentikan rekaman di server', err);
        }
    };

    const sendRecordingToBackend = async () => {
        const { showSuccess, showError } = await import('@/lib/sweetalert');

        if (!recordedBlob) {
            showError(
                'Perhatian',
                'Belum ada rekaman audio yang siap dikirim.',
            );

            return;
        }

        if (!recordedBlob.type.includes('webm')) {
            showError(
                'Gagal',
                'Format audio tidak kompatibel dengan sistem (bukan WebM).',
            );

            return;
        }

        setUploading(true);
        setUploadProgress(0);
        const formData = new FormData();
        formData.append('file', recordedBlob, `rekaman-${Date.now()}.webm`);
        formData.append('source', 'system_record');
        formData.append('duration_seconds', recordingDuration.toString());

        try {
            await uploadRecordingForm(
                `/meetings/${meeting.id}/recording`,
                formData,
                setUploadProgress,
            );

            // Hanya bersihkan blob lokal setelah upload benar-benar berhasil
            setRecordedBlob(null);
            setRecordingDuration(0);
            mediaRecorderRef.current = null;

            await showSuccess(
                'Berhasil',
                'Rekaman berhasil disimpan dan dikirim ke server.',
            );
            window.location.reload();
        } catch (error: any) {
            showError(
                'Gagal',
                error.message || 'Terjadi kesalahan saat menyimpan rekaman.',
            );
        } finally {
            setUploading(false);
        }
    };

    const hasRecordings = meeting?.recordings && meeting.recordings.length > 0;
    const isAnyRecordingTranscribing = meeting?.recordings?.some(
        (r: any) => r.status === 'transcribing' || r.status === 'processing',
    );

    return (
        <div className="mx-auto flex w-full max-w-7xl animate-in flex-col gap-6 py-8 duration-700 fade-in slide-in-from-bottom-4">
            <Head title="Operator Rekaman" />

            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link
                    href={`/meetings/${meeting.id}`}
                    className="flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-900 transition-colors hover:text-slate-700 dark:text-slate-200 dark:hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Detail Rapat
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[22px] leading-tight font-semibold text-slate-900 dark:text-white">
                            Operator rekaman
                        </h1>
                        <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                            Tekan Play untuk mulai merekam rapat
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className={`h-2 w-2 rounded-full ${isServerRecording ? 'animate-pulse bg-rose-500' : 'bg-slate-400'}`}
                        ></div>
                        <span
                            className={`text-[12px] font-bold ${isServerRecording ? 'text-rose-600' : 'text-slate-500'}`}
                        >
                            {isServerRecording
                                ? 'LIVE: Sedang Merekam'
                                : 'Menunggu'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Meeting Info Card (Top Section) */}
            <div className="w-full">
                <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:border-border dark:bg-card">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-500 dark:bg-rose-950/60 dark:text-rose-400">
                            <Megaphone className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-[14px] font-bold text-slate-900 dark:text-white">
                                {meeting?.title || 'Review Strategi'}
                            </h2>
                            <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
                                {meeting?.location || 'Ruang Rapat'} -{' '}
                                {meeting?.date}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsQrOpen(true)}
                        variant="outline"
                        className="border-blue-300 whitespace-nowrap text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
                    >
                        <QrCode className="mr-2 h-4 w-4" /> Tampilkan QR Absensi
                    </Button>
                </div>
            </div>

            {/* Main Content Layout - Side by Side */}
            <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-12">
                {/* KOLOM KIRI (Upload & Rekam) - Visible to everyone so Pimpinan can record */}
                <div
                    className={`${hasRecordings ? 'lg:col-span-5' : 'lg:col-span-12'} flex flex-col gap-6 transition-all duration-500`}
                >
                    {/* Recording Controls */}
                    <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm dark:border-border dark:bg-card">
                        <div className="flex gap-1 border-b border-slate-100 p-1 dark:border-border">
                            <button
                                onClick={() => setActiveTab('upload')}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-[12px] font-semibold transition-colors ${activeTab === 'upload' ? 'border border-blue-100/50 bg-blue-50/50 text-blue-600 dark:border-blue-800/50 dark:bg-blue-950/60 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                            >
                                <UploadCloud
                                    className={`h-4 w-4 ${activeTab === 'upload' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400'}`}
                                />{' '}
                                Unggah berkas
                            </button>
                            <button
                                onClick={() => setActiveTab('record')}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-[12px] font-semibold transition-colors ${activeTab === 'record' ? 'border border-blue-100/50 bg-blue-50/50 text-blue-600 dark:border-blue-800/50 dark:bg-blue-950/60 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                            >
                                <Monitor
                                    className={`h-4 w-4 ${activeTab === 'record' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400'}`}
                                />{' '}
                                Rekam (Sistem)
                            </button>
                            <button
                                onClick={() => setActiveTab('record_mic')}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-[12px] font-semibold transition-colors ${activeTab === 'record_mic' ? 'border border-blue-100/50 bg-blue-50/50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Mic
                                    className={`h-4 w-4 ${activeTab === 'record_mic' ? 'text-blue-500' : 'text-slate-400'}`}
                                />{' '}
                                Rekam (Mikrofon)
                            </button>
                        </div>

                        <div className="p-4">
                            {activeTab === 'record' ||
                            activeTab === 'record_mic' ? (
                                <>
                                    <div className="mb-4 flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                startRecordingSession(
                                                    activeTab === 'record'
                                                        ? 'system'
                                                        : 'mic',
                                                )
                                            }
                                            disabled={isRecording || !canRecord}
                                            className={`flex h-9 items-center gap-2 px-3 text-[12px] font-semibold ${isRecording ? 'border-slate-200 bg-slate-50 text-slate-400' : 'text-slate-700'}`}
                                        >
                                            <div
                                                className={`h-1.5 w-1.5 rounded-full border-[1.5px] ${isRecording ? 'border-slate-400' : 'border-rose-500'}`}
                                            ></div>
                                            Mulai rekam
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={togglePauseRecording}
                                            disabled={
                                                !isRecording || !canRecord
                                            }
                                            className={`flex h-9 items-center gap-2 px-3 text-[12px] font-semibold ${!isRecording || !canRecord ? 'border-slate-200 bg-slate-50 text-slate-400' : 'text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'}`}
                                        >
                                            {isPaused ? (
                                                <Play className="h-3.5 w-3.5" />
                                            ) : (
                                                <Pause className="h-3.5 w-3.5" />
                                            )}
                                            {isPaused ? 'Lanjut' : 'Jeda'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={stopRecordingSession}
                                            disabled={
                                                (!isRecording &&
                                                    !isServerRecording) ||
                                                !canRecord
                                            }
                                            className={`flex h-9 items-center gap-2 px-3 text-[12px] font-semibold ${(!isRecording && !isServerRecording) || !canRecord ? 'border-slate-200 bg-slate-50 text-slate-400' : 'text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600'}`}
                                        >
                                            <Square className="h-3.5 w-3.5" />{' '}
                                            Berhenti
                                        </Button>
                                    </div>
                                    {errorMsg && (
                                        <span className="mb-2 flex items-center text-[11px] text-rose-500">
                                            <AlertCircle className="mr-1 h-3 w-3" />{' '}
                                            {errorMsg}
                                        </span>
                                    )}
                                    <p className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
                                        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                                        {activeTab === 'record'
                                            ? 'Browser akan menampilkan dialog "Choose what to share" - pilih tab/jendela rapat (Zoom/Teams/dll) dan pastikan centang "Share system audio".'
                                            : 'Pastikan untuk memberikan izin (Allow) pada browser untuk mengakses Mikrofon saat popup muncul.'}
                                    </p>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                                    <UploadCloud className="mb-2 h-8 w-8 opacity-50" />
                                    <p className="mb-4 text-xs font-medium text-slate-600">
                                        Unggah file audio secara manual
                                    </p>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                    />
                                    <Button
                                        onClick={() =>
                                            canRecord &&
                                            fileInputRef.current?.click()
                                        }
                                        disabled={uploading || !canRecord}
                                        className="h-9 bg-blue-600 px-6 text-[12px] hover:bg-blue-700"
                                    >
                                        {uploading ? (
                                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                        ) : null}
                                        {uploading
                                            ? 'Mengunggah...'
                                            : 'Pilih File Audio'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timer & Send Action */}
                    <div className="relative flex flex-col items-center overflow-hidden rounded-xl border border-slate-200/60 bg-white p-12 text-center shadow-sm dark:border-border dark:bg-card">
                        {uploading && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 px-12 backdrop-blur-sm dark:bg-card/80">
                                <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-500" />
                                <p className="mb-3 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                    Mengirim audio ke server... {uploadProgress}
                                    %
                                </p>
                                <div className="h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-emerald-100 shadow-inner dark:bg-emerald-950/60">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {!isRecording &&
                            !isServerRecording &&
                            recordingDuration > 0 &&
                            !recordedBlob &&
                            (activeTab === 'record' ||
                                activeTab === 'record_mic') && (
                                <div className="absolute inset-0 z-10 flex animate-in flex-col items-center justify-center bg-white/80 px-12 backdrop-blur-sm duration-500 fade-in dark:bg-card/80">
                                    <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-500" />
                                    <p className="mb-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                        Operator sedang mengunggah file
                                        rekaman...
                                    </p>
                                    <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                                        Selesai merekam (
                                        {formatDuration(recordingDuration)})
                                    </p>
                                    <div className="h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-emerald-100 shadow-inner dark:bg-emerald-950/60">
                                        <div className="h-full w-full animate-pulse rounded-full bg-emerald-500"></div>
                                    </div>
                                </div>
                            )}

                        <div className="mb-6 flex items-center gap-1.5">
                            <div
                                className={`h-0.75 w-0.75 rounded-full ${isServerRecording ? 'animate-pulse bg-rose-500/80' : 'bg-slate-300 dark:bg-slate-700'}`}
                            ></div>
                            <div
                                className={`h-0.75 w-0.75 rounded-full ${isServerRecording ? 'animate-pulse bg-rose-500/80' : 'bg-slate-300 dark:bg-slate-700'}`}
                                style={{ animationDelay: '150ms' }}
                            ></div>
                            <div
                                className={`h-0.75 w-0.75 rounded-full ${isServerRecording ? 'animate-pulse bg-rose-500/80' : 'bg-slate-300 dark:bg-slate-700'}`}
                                style={{ animationDelay: '300ms' }}
                            ></div>
                            <div
                                className={`h-0.75 w-0.75 rounded-full ${isServerRecording ? 'animate-pulse bg-rose-500/80' : 'bg-slate-300 dark:bg-slate-700'}`}
                                style={{ animationDelay: '450ms' }}
                            ></div>
                            <div
                                className={`h-0.75 w-0.75 rounded-full ${isServerRecording ? 'animate-pulse bg-rose-500/80' : 'bg-slate-300 dark:bg-slate-700'}`}
                                style={{ animationDelay: '600ms' }}
                            ></div>
                        </div>

                        <div
                            className={`mb-3 font-mono text-5xl font-black tracking-widest text-slate-900 dark:text-white`}
                        >
                            {formatDuration(recordingDuration)}
                        </div>
                        <p className="mb-10 text-[11px] font-medium text-slate-400">
                            Waktu proses perekaman
                        </p>

                        <button
                            onClick={sendRecordingToBackend}
                            disabled={isRecording || !recordedBlob || uploading}
                            className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full shadow-sm transition-all ${!recordedBlob || isRecording ? 'cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600' : 'cursor-pointer border border-emerald-100 bg-emerald-50 text-emerald-600 hover:scale-105 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 dark:hover:bg-emerald-900/60'}`}
                            title={
                                isRecording
                                    ? 'Harap hentikan perekaman terlebih dahulu'
                                    : !recordedBlob
                                      ? 'Belum ada rekaman tersimpan'
                                      : 'Kirim rekaman sekarang'
                            }
                        >
                            <Send className="ml-0.5 h-5 w-5" />
                        </button>

                        <h3 className="mb-1 text-[14px] font-bold text-slate-900 dark:text-white">
                            Kirim audio agar ditranskrip
                        </h3>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400">
                            Pastikan proses rekaman telah dihentikan sebelum
                            mengirim file
                        </p>

                        {recordedBlob && !isRecording && (
                            <div className="mt-4 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                                ✓ Audio{' '}
                                {(recordedBlob.size / 1024 / 1024).toFixed(2)}{' '}
                                MB siap dikirim
                            </div>
                        )}
                    </div>
                </div>

                {/* KOLOM KANAN (Hasil Audio & Transkripsi) */}
                {hasRecordings && (
                    <div className="flex flex-col gap-6 lg:col-span-7">
                        {/* Hasil Audio Tersimpan */}
                        <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
                            <h3 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-slate-900 dark:text-white">
                                <Database className="h-4 w-4 text-slate-500 dark:text-slate-400" />{' '}
                                Hasil Audio Tersimpan
                            </h3>

                            <div className="flex flex-col gap-4">
                                {meeting.recordings.map(
                                    (rec: any, index: number) => (
                                        <div
                                            key={rec.id}
                                            className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/30 p-4 sm:flex-row sm:items-center dark:border-border dark:bg-slate-900/40"
                                        >
                                            <div className="w-full flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">
                                                        Rekaman #{index + 1}
                                                    </span>
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${rec.status === 'uploaded' ? 'bg-amber-100 text-amber-700' : rec.status === 'transcribing' ? 'animate-pulse bg-blue-100 text-blue-700' : rec.status === 'failed' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}
                                                    >
                                                        {rec.status ===
                                                        'uploaded'
                                                            ? 'Menunggu Transkripsi'
                                                            : rec.status ===
                                                                'transcribing'
                                                              ? 'Sedang Diproses AI...'
                                                              : rec.status ===
                                                                  'failed'
                                                                ? 'Gagal Transkripsi'
                                                                : 'Selesai Transkripsi'}
                                                    </span>
                                                </div>
                                                <p className="mb-3 text-[11px] text-slate-500">
                                                    {new Date(
                                                        rec.created_at,
                                                    ).toLocaleString(
                                                        'id-ID',
                                                    )}{' '}
                                                    •{' '}
                                                    {(
                                                        rec.file_size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(2)}{' '}
                                                    MB
                                                    {rec.duration_seconds
                                                        ? ` • ${formatDuration(rec.duration_seconds)}`
                                                        : ''}
                                                </p>

                                                <audio
                                                    controls
                                                    src={`/meetings/${meeting.id}/recording/${rec.id}/stream`}
                                                    className="h-9 w-full max-w-sm rounded-lg border border-slate-200/60"
                                                />
                                            </div>
                                            <div className="mt-2 flex w-full flex-wrap items-center gap-2 sm:mt-0 sm:w-auto">
                                                {canRecord && (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            deleteRecording(
                                                                rec.id,
                                                            )
                                                        }
                                                        className="h-9 flex-none border-rose-200 px-3 text-xs text-rose-600 shadow-sm hover:border-rose-300 hover:bg-rose-50"
                                                        disabled={
                                                            isTranscribing ===
                                                            rec.id
                                                        }
                                                        title="Hapus Rekaman"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {rec.status ===
                                                'transcribing' ? (
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-blue-600">
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            <span className="text-xs font-semibold">
                                                                AI sedang
                                                                bekerja di latar
                                                                belakang (1-3
                                                                menit)
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    canTranscribe && (
                                                        <Button
                                                            onClick={() =>
                                                                triggerTranscription(
                                                                    rec.id,
                                                                )
                                                            }
                                                            className={`h-9 flex-1 text-xs shadow-sm sm:flex-none ${rec.status === 'failed' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                                            disabled={
                                                                isTranscribing ===
                                                                rec.id
                                                            }
                                                        >
                                                            {isTranscribing ===
                                                            rec.id ? (
                                                                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                                            ) : (
                                                                <Bot className="mr-2 h-3.5 w-3.5" />
                                                            )}
                                                            {isTranscribing ===
                                                            rec.id
                                                                ? 'Memproses AI...'
                                                                : rec.status ===
                                                                    'completed'
                                                                  ? 'Ulangi Transkripsi AI'
                                                                  : rec.status ===
                                                                      'failed'
                                                                    ? 'Coba Lagi Transkripsi AI'
                                                                    : 'Mulai Transkripsi AI'}
                                                        </Button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                        {/* Selesai Rekaman Action - Tersedia bagi Bag. Humas, Bag. Umum, dan Admin */}
                        {(canRecord || canTranscribe) &&
                            !isRecording &&
                            !isServerRecording &&
                            !recordedBlob && (
                                <div className="flex justify-end">
                                    <Button
                                        onClick={finishRecording}
                                        disabled={isAnyRecordingTranscribing}
                                        className={`h-11 px-6 text-sm font-bold shadow-sm ${isAnyRecordingTranscribing ? 'cursor-not-allowed bg-slate-400 text-white opacity-90 hover:bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                                    >
                                        {isAnyRecordingTranscribing
                                            ? 'Menunggu AI Selesai...'
                                            : canTranscribe
                                              ? 'Selesai & Lanjut Koreksi'
                                              : 'Selesai Rekaman'}
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
                        <DialogTitle className="text-center">
                            QR Code Absensi
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Scan QR Code ini menggunakan aplikasi UMSU Employee
                            untuk mencatat kehadiran pada rapat.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center gap-4 py-6">
                        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                            {isClient && (
                                <Suspense
                                    fallback={
                                        <div className="h-62.5 w-62.5 animate-pulse rounded bg-slate-100" />
                                    }
                                >
                                    <QRCodeCanvas
                                        id="qr-code-canvas"
                                        value={`${window.location.origin}/attend/${meeting.id}`}
                                        size={250}
                                        level="H"
                                        includeMargin={false}
                                    />
                                </Suspense>
                            )}
                        </div>
                        <div className="space-y-1 text-center">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                {meeting.title}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {meeting.date} •{' '}
                                {meeting.start_time?.substring(0, 5)} -{' '}
                                {meeting.end_time?.substring(0, 5)}
                            </p>
                        </div>
                        <Button
                            onClick={handleDownloadQR}
                            className="mt-2"
                            variant="outline"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download QR Code
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
