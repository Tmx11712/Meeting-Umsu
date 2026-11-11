import { Head, Link, router, usePage } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import {
    Send,
    FileText,
    Download,
    Edit3,
    CheckCircle2,
    ChevronDown,
    RefreshCw,
    Sparkles,
    Plus,
    Trash2,
    Upload,
    Loader2,
} from 'lucide-react';

import { AlertCircle, Info } from 'lucide-react';
import React, { useState } from 'react';

import { MeetingInfoCard } from '@/components/meetings/MeetingInfoCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMeetingWebSocket } from '@/hooks/use-meeting-websocket';
import { usePermissions } from '@/hooks/use-permissions';
import type { Meeting } from '@/types/meeting';

export default function MeetingReview({
    meeting,
    ...props
}: {
    meeting: Meeting;
    [key: string]: any;
}) {
    const totalSeconds =
        meeting.recordings?.reduce(
            (sum: number, r: any) => sum + (r.duration_seconds || 0),
            0,
        ) || 0;
    const h = Math.floor(totalSeconds / 3600)
        .toString()
        .padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60)
        .toString()
        .padStart(2, '0');
    const s = Math.floor(totalSeconds % 60)
        .toString()
        .padStart(2, '0');
    const recordingDuration = totalSeconds > 0 ? `${h}:${m}:${s}` : '00:00:00';

    const minutes =
        meeting.minutes && meeting.minutes.length > 0
            ? meeting.minutes[0]
            : null;
    const { auth } = usePage<any>().props;
    const { canEdit, hasRole } = usePermissions();
    const canManageReview = canEdit('review');
    const canManageTranscript = canEdit('transcript');
    const isPimpinan = hasRole('Pimpinan');
    const participants = meeting.participants || [];

    /**
     * [EDUKASI ARSITEKTUR: REACT CUSTOM HOOKS]
     * useMeetingWebSocket adalah Custom Hook.
     * Ini menyembunyikan kompleksitas WebSockets (Pusher/Echo) dari UI Component.
     * Komponen ini tidak perlu tahu BAGAIMANA data masuk, ia hanya akan otomatis ter-re-render jika ada pesan baru.
     */
    useMeetingWebSocket(meeting?.id);

    const [sending, setSending] = useState(false);
    const isGeneratingAi = meeting?.ai_status === 'processing';
    const [documentToDelete, setDocumentToDelete] = useState<string | null>(
        null,
    );

    // Edit Modal States
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    const openEditModal = () => {
        if (minutes?.content) {
            setEditData(JSON.parse(JSON.stringify(minutes.content)));
        } else {
            setEditData({
                latar_belakang: '',
                peserta_rapat: [],
                pembahasan: [],
                keputusan: [],
            });
        }

        setEditModalOpen(true);
    };

    /**
     * [EDUKASI ARSITEKTUR: STATE MANAGEMENT INERTIA]
     * Inertia.js tidak butuh kita untuk 'fetch' data via axios lalu di-set pakai 'useState'.
     * Inertia me-request dari server dan me-refresh 'props' komponen ini secara ajaib (SPA feeling).
     * Saat `onSuccess` dipanggil, `meeting` props di atas akan otomatis memiliki data terbaru!
     */
    const saveEdit = () => {
        setSending(true);
        router.put(
            `/meetings/${meeting.id}/review`,
            { content: editData },
            {
                onSuccess: () => {
                    setEditModalOpen(false);
                },
                onFinish: () => setSending(false),
            },
        );
    };

    const sendToPimpinan = () => {
        setSending(true);
        router.post(
            `/meetings/${meeting.id}/review/send`,
            {},
            {
                onFinish: () => setSending(false),
            },
        );
    };

    const approveNotulen = () => {
        setSending(true);
        router.post(
            `/meetings/${meeting.id}/approval`,
            { decision: 'approved', notes: '' },
            {
                onFinish: () => setSending(false),
            },
        );
    };

    const downloadPdf = () => {
        window.open(`/meetings/${meeting.id}/review/pdf`, '_blank');
    };

    // Document Handlers
    const [uploadingDoc, setUploadingDoc] = useState(false);

    const handleUploadDocument = (e: any) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        setUploadingDoc(true);
        const formData = new FormData();
        formData.append('document', file);

        router.post(`/meetings/${meeting.id}/documents`, formData, {
            onFinish: () => {
                setUploadingDoc(false);
                e.target.value = null; // reset input
            },
        });
    };

    const handleDeleteDocument = (id: string) => {
        setDocumentToDelete(id);
    };

    // Real Attendance Data (gabungan peserta terdaftar & tamu tambahan)
    const attendances = meeting.attendances || [];

    const displayList: any[] = [];

    // 1. Masukkan semua peserta yang diundang (dari tabel meeting_participants)
    participants.forEach((p: any) => {
        const att = attendances.find((a: any) => a.user_id === p.user_id);
        displayList.push({
            id: `p-${p.id}`,
            user_id: p.user_id,
            name: p.user?.name || 'Unknown',
            subtitle: p.role_in_meeting || p.user?.department || 'Peserta',
            status: att?.status || 'tidak_hadir',
            isGuest: false,
        });
    });

    // 2. Masukkan absensi yang tidak ada di daftar peserta (misal: tamu manual)
    attendances.forEach((a: any) => {
        if (a.user_id) {
            const isParticipant = participants.some(
                (p: any) => p.user_id === a.user_id,
            );

            if (!isParticipant) {
                displayList.push({
                    id: `a-${a.id}`,
                    user_id: a.user_id,
                    name: a.user?.name || 'Unknown',
                    subtitle:
                        a.user?.department ||
                        (a.method === 'qr_code' ? 'Scan QR' : 'Hadir Tambahan'),
                    status: a.status,
                    isGuest: false,
                });
            }
        } else {
            // Tamu tanpa user_id
            displayList.push({
                id: `g-${a.id}`,
                user_id: null,
                name: a.guest_name || 'Tamu',
                subtitle:
                    a.guest_unit_kerja && a.guest_institution
                        ? `${a.guest_unit_kerja} - ${a.guest_institution}`
                        : a.guest_institution ||
                          a.guest_unit_kerja ||
                          'Input Manual',
                status: a.status,
                isGuest: true,
                unit_kerja: a.guest_unit_kerja,
                institution: a.guest_institution,
            });
        }
    });

    const total = displayList.length;
    const hadir = displayList.filter((i) => i.status === 'hadir').length;
    const terlambat = displayList.filter(
        (i) => i.status === 'terlambat',
    ).length;
    const tidakHadir = displayList.filter(
        (i) => i.status === 'tidak_hadir',
    ).length;

    const getPct = (num: number) =>
        total > 0 ? ((num / total) * 100).toFixed(0) : '0';

    const changeStatus = (item: any, newStatus: string) => {
        const payload: any = { status: newStatus };

        if (item.user_id) {
            payload.user_id = item.user_id;
        } else {
            payload.guest_name = item.name;
            payload.guest_unit_kerja = item.unit_kerja;
            payload.guest_institution = item.institution;
        }

        router.post(`/meetings/${meeting.id}/attendance/manual`, payload, {
            preserveScroll: true,
        });
    };

    // Manual attendance form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [guestUnitKerja, setGuestUnitKerja] = useState('');
    const [guestInstitution, setGuestInstitution] = useState('');
    const [guestStatus, setGuestStatus] = useState('hadir');
    const [addingAttendance, setAddingAttendance] = useState(false);

    const addGuestAttendance = () => {
        if (!guestName.trim()) {
            return;
        }

        setAddingAttendance(true);
        router.post(
            `/meetings/${meeting.id}/attendance/manual`,
            {
                guest_name: guestName,
                guest_unit_kerja: guestUnitKerja,
                guest_institution: guestInstitution,
                status: guestStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setGuestName('');
                    setGuestUnitKerja('');
                    setGuestInstitution('');
                    setGuestStatus('hadir');
                    setShowAddForm(false);
                },
                onFinish: () => setAddingAttendance(false),
            },
        );
    };

    const renderDocumentCard = (isReadOnly: boolean = false) => (
        <Card className="rounded-xl border-slate-200 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800/60">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                    Dokumen Pendukung
                </CardTitle>
                {canManageReview && !isReadOnly && (
                    <div className="relative">
                        <input
                            type="file"
                            id="document-upload"
                            className="hidden"
                            accept=".pdf,.txt,.docx"
                            onChange={handleUploadDocument}
                            disabled={uploadingDoc}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            disabled={uploadingDoc}
                            onClick={() =>
                                document
                                    .getElementById('document-upload')
                                    ?.click()
                            }
                        >
                            {uploadingDoc ? (
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            ) : (
                                <Upload className="mr-2 h-3 w-3" />
                            )}
                            Upload
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
                {meeting.documents && meeting.documents.length > 0 ? (
                    meeting.documents.map((doc: any) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800/60 dark:bg-slate-800/40"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="truncate">
                                    <p
                                        className="truncate text-sm font-medium text-slate-900 dark:text-white"
                                        title={doc.file_name}
                                    >
                                        {doc.file_name}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase dark:text-slate-400">
                                        {doc.mime_type.split('/')[1] || 'FILE'}{' '}
                                        •{' '}
                                        {(doc.file_size / 1024 / 1024).toFixed(
                                            2,
                                        )}{' '}
                                        MB
                                    </p>
                                </div>
                            </div>
                            {canManageReview && !isReadOnly && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 text-rose-500 hover:text-rose-600"
                                    onClick={() => handleDeleteDocument(doc.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-6 text-center text-slate-500 dark:text-slate-400">
                        <FileText className="mx-auto mb-2 h-8 w-8 opacity-20" />
                        <p className="text-xs">Belum ada dokumen tambahan.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    if (!minutes) {
        return (
            <div className="flex w-full animate-in flex-col gap-4 py-2 duration-700 fade-in slide-in-from-bottom-4">
                <Head title="Review Notulen" />

                {/* Header & Breadcrumb */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center dark:border-slate-800/60 dark:bg-slate-900/40">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Review Notulen
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
                                Review Notulen
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        asChild
                        className="h-11 rounded-xl border-slate-200 bg-white/60 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800"
                    >
                        <Link href={`/meetings/${meeting.id}/correction`}>
                            Kembali ke Koreksi
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Left side: Transcripts reference + Attendance */}
                    <div className="space-y-4 lg:col-span-2">
                        <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                            <FileText className="h-5 w-5 text-blue-500" />
                            Referensi Transkrip (
                            {meeting.recordings?.length || 0} File)
                        </h3>

                        {meeting.recordings?.length === 0 ? (
                            <Card className="border-dashed bg-slate-50 dark:bg-slate-900">
                                <CardContent className="py-10 text-center text-sm text-slate-500">
                                    Belum ada rekaman audio untuk rapat ini.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {meeting.recordings?.map(
                                    (rec: any, idx: number) => {
                                        const transcripts =
                                            rec.transcripts || [];
                                        const combinedText = transcripts
                                            .map((t: any) => {
                                                const latest =
                                                    t.corrections?.length > 0
                                                        ? t.corrections[
                                                              t.corrections
                                                                  .length - 1
                                                          ].corrected_text
                                                        : t.text;

                                                return latest;
                                            })
                                            .join(' ');

                                        return (
                                            <Card
                                                key={rec.id}
                                                className="overflow-hidden border-slate-200 bg-white/70 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70"
                                            >
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-100 bg-slate-50/80 px-4 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
                                                    <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                                                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-xs text-blue-600 dark:bg-blue-900/60 dark:text-blue-400">
                                                            {idx + 1}
                                                        </span>
                                                        {rec.label ||
                                                            `Rekaman #${idx + 1}`}
                                                    </CardTitle>
                                                    <Badge
                                                        variant="outline"
                                                        className="border-emerald-200 bg-emerald-50 text-[10px] font-semibold tracking-wide text-emerald-600 dark:border-emerald-800/50 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                    >
                                                        {transcripts.length}{' '}
                                                        SEGMEN
                                                    </Badge>
                                                </CardHeader>
                                                <CardContent className="custom-scrollbar max-h-100 overflow-y-auto bg-white/40 p-5 dark:bg-slate-900/40">
                                                    <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                                        {combinedText || (
                                                            <span className="text-slate-400 italic">
                                                                Transkrip kosong
                                                                atau belum
                                                                diproses.
                                                            </span>
                                                        )}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        );
                                    },
                                )}
                            </div>
                        )}

                        {/* Attendance Summary */}
                        <h3 className="mt-6 mb-2 flex items-center justify-between text-lg font-bold text-slate-900 dark:text-white">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                Data Absensi ({hadir + terlambat}/{total} Hadir)
                            </span>
                            {canManageReview && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs"
                                    onClick={() => setShowAddForm(!showAddForm)}
                                >
                                    <Plus className="mr-1.5 h-3.5 w-3.5" />{' '}
                                    Tambah Absensi
                                </Button>
                            )}
                        </h3>

                        {/* Form Tambah Absensi Manual */}
                        {showAddForm && canManageReview && (
                            <Card className="mb-3 border-blue-200 bg-blue-50/30">
                                <CardContent className="space-y-3 p-4">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Input Absensi Manual
                                    </p>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div>
                                            <Label className="mb-1 text-xs text-slate-600">
                                                Nama Peserta *
                                            </Label>
                                            <Input
                                                value={guestName}
                                                onChange={(e) =>
                                                    setGuestName(e.target.value)
                                                }
                                                placeholder="Masukkan nama..."
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <Label className="mb-1 text-xs text-slate-600">
                                                Unit Kerja
                                            </Label>
                                            <Input
                                                value={guestUnitKerja}
                                                onChange={(e) =>
                                                    setGuestUnitKerja(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Fakultas Teknik"
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <Label className="mb-1 text-xs text-slate-600">
                                                Jabatan
                                            </Label>
                                            <Input
                                                value={guestInstitution}
                                                onChange={(e) =>
                                                    setGuestInstitution(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Dosen"
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            {[
                                                {
                                                    value: 'hadir',
                                                    label: 'Hadir',
                                                    active: 'bg-emerald-500 text-white',
                                                    inactive:
                                                        'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
                                                },
                                                {
                                                    value: 'terlambat',
                                                    label: 'Terlambat',
                                                    active: 'bg-amber-500 text-white',
                                                    inactive:
                                                        'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
                                                },
                                                {
                                                    value: 'tidak_hadir',
                                                    label: 'Tidak Hadir',
                                                    active: 'bg-red-500 text-white',
                                                    inactive:
                                                        'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
                                                },
                                            ].map((s) => (
                                                <button
                                                    key={s.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setGuestStatus(s.value)
                                                    }
                                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${guestStatus === s.value ? s.active : s.inactive}`}
                                                >
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="ml-auto flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-xs"
                                                onClick={() =>
                                                    setShowAddForm(false)
                                                }
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="h-8 bg-blue-600 text-xs text-white hover:bg-blue-700"
                                                onClick={addGuestAttendance}
                                                disabled={
                                                    addingAttendance ||
                                                    !guestName.trim()
                                                }
                                            >
                                                {addingAttendance
                                                    ? 'Menyimpan...'
                                                    : 'Simpan'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="overflow-hidden border-slate-200 bg-white/70 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
                            <CardContent className="p-4">
                                {/* Stats Row */}
                                <div className="mb-4 grid grid-cols-3 gap-3">
                                    <div className="rounded-xl bg-emerald-50 p-3 text-center dark:bg-emerald-900/20">
                                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                            {hadir}
                                        </div>
                                        <div className="text-xs font-medium text-emerald-600/70 dark:text-emerald-400/70">
                                            Hadir
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-900/20">
                                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                            {terlambat}
                                        </div>
                                        <div className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70">
                                            Terlambat
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-red-50 p-3 text-center dark:bg-red-900/20">
                                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                            {tidakHadir}
                                        </div>
                                        <div className="text-xs font-medium text-red-600/70 dark:text-red-400/70">
                                            Tidak Hadir
                                        </div>
                                    </div>
                                </div>
                                {/* Daftar Kehadiran (dari data gabungan) */}
                                <div className="custom-scrollbar max-h-100 space-y-2 overflow-y-auto">
                                    {displayList.length === 0 ? (
                                        <div className="py-6 text-center text-sm text-slate-400 italic">
                                            Belum ada data absensi. Gunakan QR
                                            Code atau input manual.
                                        </div>
                                    ) : (
                                        displayList.map((att: any) => {
                                            const name = att.name;
                                            const subtitle = att.subtitle;
                                            const status = att.status;
                                            const statuses = [
                                                {
                                                    value: 'hadir',
                                                    label: 'Hadir',
                                                    color: 'bg-emerald-500 hover:bg-emerald-600 text-white',
                                                    inactive:
                                                        'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
                                                },
                                                {
                                                    value: 'terlambat',
                                                    label: 'Terlambat',
                                                    color: 'bg-amber-500 hover:bg-amber-600 text-white',
                                                    inactive:
                                                        'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
                                                },
                                                {
                                                    value: 'tidak_hadir',
                                                    label: 'Absen',
                                                    color: 'bg-red-500 hover:bg-red-600 text-white',
                                                    inactive:
                                                        'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
                                                },
                                            ];

                                            return (
                                                <div
                                                    key={att.id}
                                                    className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${att.isGuest ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}
                                                        >
                                                            {name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                                {name}
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                {subtitle}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {canManageReview ? (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                asChild
                                                            >
                                                                <button
                                                                    className={`flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold shadow-sm transition-all ${
                                                                        status ===
                                                                        'hadir'
                                                                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                                                            : status ===
                                                                                'terlambat'
                                                                              ? 'bg-amber-500 text-white hover:bg-amber-600'
                                                                              : 'bg-red-500 text-white hover:bg-red-600'
                                                                    }`}
                                                                >
                                                                    {status ===
                                                                    'hadir'
                                                                        ? 'Hadir'
                                                                        : status ===
                                                                            'terlambat'
                                                                          ? 'Terlambat'
                                                                          : 'Absen'}
                                                                    <ChevronDown className="h-3 w-3 opacity-70" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="w-32"
                                                            >
                                                                {statuses.map(
                                                                    (s) => (
                                                                        <DropdownMenuItem
                                                                            key={
                                                                                s.value
                                                                            }
                                                                            onClick={() =>
                                                                                changeStatus(
                                                                                    att,
                                                                                    s.value,
                                                                                )
                                                                            }
                                                                            className="cursor-pointer text-xs font-medium"
                                                                        >
                                                                            {
                                                                                s.label
                                                                            }
                                                                        </DropdownMenuItem>
                                                                    ),
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    ) : (
                                                        <Badge
                                                            className={`border-0 text-[10px] font-semibold ${
                                                                status ===
                                                                'hadir'
                                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                                                    : status ===
                                                                        'terlambat'
                                                                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                                                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                                                            }`}
                                                        >
                                                            {status === 'hadir'
                                                                ? 'Hadir'
                                                                : status ===
                                                                    'terlambat'
                                                                  ? 'Terlambat'
                                                                  : 'Tidak Hadir'}
                                                        </Badge>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right side: Action card */}
                    <div className="sticky top-4 flex flex-col gap-4">
                        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white/80 p-8 text-center text-slate-500 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                            <Sparkles className="mb-4 h-12 w-12 text-sky-500" />
                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                                Notulen Belum Digenerate
                            </h3>
                            <p className="mb-6 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                AI akan membaca semua transkrip dari rekaman
                                yang ada dan merangkumnya menjadi notulen resmi
                                lengkap dengan keputusan dan tindak lanjut.
                            </p>
                            <Button
                                className="h-12 w-full rounded-xl bg-linear-to-r from-sky-600 to-blue-600 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 hover:from-sky-500 hover:to-blue-500 dark:shadow-blue-900/20"
                                onClick={() => {
                                    router.post(
                                        `/meetings/${meeting.id}/review/ai`,
                                        {},
                                        {
                                            preserveScroll: true,
                                        },
                                    );
                                }}
                                disabled={isGeneratingAi || !canManageReview}
                            >
                                {isGeneratingAi ? (
                                    <Loader2 className="mr-2 inline-block h-5 w-5 animate-spin" />
                                ) : null}
                                {isGeneratingAi
                                    ? '⏳ AI Sedang Merangkum (1-2 Menit)...'
                                    : '✨ Generate Notulen dengan AI'}
                            </Button>
                        </div>
                        {renderDocumentCard(false)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full animate-in flex-col gap-4 py-2 duration-700 fade-in slide-in-from-bottom-4">
            <Head title="Review Notulen" />

            {/* Header & Breadcrumb */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center dark:border-slate-800/60 dark:bg-slate-900/40">
                <div>
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Review Notulen
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
                            Review Notulen
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        asChild
                        className="h-11 rounded-xl border-slate-200 bg-white/60 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800"
                    >
                        <Link href={`/meetings/${meeting.id}/correction`}>
                            Kembali ke Koreksi
                        </Link>
                    </Button>
                    {canManageReview &&
                        meeting.current_stage === 5 &&
                        !isPimpinan && (
                            <Button
                                className="h-11 rounded-xl bg-blue-600 px-4 font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
                                onClick={sendToPimpinan}
                                disabled={sending}
                            >
                                <Send className="mr-2 h-4 w-4" /> Kirim ke
                                Pimpinan
                            </Button>
                        )}
                    {canManageReview &&
                        meeting.current_stage === 6 &&
                        isPimpinan && (
                            <Button
                                className="h-11 rounded-xl bg-emerald-600 px-4 font-semibold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg"
                                onClick={approveNotulen}
                                disabled={sending}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />{' '}
                                Setujui Notulen
                            </Button>
                        )}
                </div>
            </div>

            {!canManageReview && (
                <Alert className="rounded-2xl border-rose-200 bg-rose-50/80 text-rose-900 backdrop-blur-sm dark:border-rose-800/50 dark:bg-rose-900/30 dark:text-rose-200">
                    <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    <AlertTitle className="ml-2 text-base font-bold text-rose-800 dark:text-rose-300">
                        Mode Hanya Baca
                    </AlertTitle>
                    <AlertDescription className="mt-1 ml-2 font-medium text-rose-700 dark:text-rose-400/90">
                        Anda tidak memiliki izin untuk mengelola review notulen
                        ini. Anda hanya dapat melihat data.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-[1fr_2fr_1fr]">
                {/* Kiri: Info, Ringkasan AI, Dokumen */}
                <div className="space-y-6">
                    {/* Informasi Rapat */}
                    <MeetingInfoCard
                        meeting={meeting}
                        showDetailButton={true}
                        className="rounded-xl border-slate-200 shadow-sm"
                    />

                    {/* Ringkasan Otomatis */}
                    <Card className="ml-auto h-fit w-fit rounded-xl border-slate-200 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                                Ringkasan Otomatis (AI)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap justify-center gap-3">
                                <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-xl border border-blue-100 bg-blue-50/50 p-2 text-center dark:border-blue-900/40 dark:bg-blue-950/30">
                                    <p className="mb-1 text-[10px] font-medium text-blue-700 dark:text-blue-300">
                                        Topik Dibahas
                                    </p>
                                    <p className="text-2xl leading-none font-bold text-blue-600 dark:text-blue-400">
                                        {minutes.ai_topics_count || 0}
                                    </p>
                                    <p className="mt-1 text-[10px] text-blue-500 dark:text-blue-400">
                                        Topik utama
                                    </p>
                                </div>
                                <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-xl border border-green-100 bg-green-50/50 p-2 text-center dark:border-emerald-900/40 dark:bg-emerald-950/30">
                                    <p className="mb-1 text-[10px] font-medium text-green-700 dark:text-emerald-300">
                                        Keputusan
                                    </p>
                                    <p className="text-2xl leading-none font-bold text-green-600 dark:text-emerald-400">
                                        {minutes.ai_decisions_count || 0}
                                    </p>
                                    <p className="mt-1 text-[10px] text-green-500 dark:text-emerald-400">
                                        Keputusan penting
                                    </p>
                                </div>
                                <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-xl border border-yellow-100 bg-yellow-50/50 p-2 text-center dark:border-amber-900/40 dark:bg-amber-950/30">
                                    <p className="mb-1 text-[10px] font-medium text-yellow-700 dark:text-amber-300">
                                        Tindak Lanjut
                                    </p>
                                    <p className="text-2xl leading-none font-bold text-yellow-600 dark:text-amber-400">
                                        {minutes.action_items?.length || 0}
                                    </p>
                                    <p className="mt-1 text-[10px] text-yellow-500 dark:text-amber-400">
                                        Action items
                                    </p>
                                </div>
                                <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-xl border border-sky-100 bg-sky-50/50 p-2 text-center dark:border-sky-900/40 dark:bg-sky-950/30">
                                    <p className="mb-1 text-[10px] font-medium text-sky-700 dark:text-sky-300">
                                        Durasi Rapat
                                    </p>
                                    <p className="mt-1 text-xl leading-none font-bold text-sky-600 dark:text-sky-400">
                                        {recordingDuration}
                                    </p>
                                    <p className="mt-1 text-[10px] text-sky-500 dark:text-sky-400">
                                        Jam:Menit:Detik
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tengah: Notulen Rapat */}
                <div className="flex flex-col">
                    <Card className="flex flex-1 flex-col rounded-xl border-slate-200 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80">
                        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800/60">
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                Notulen Rapat
                            </CardTitle>
                            <div className="flex flex-wrap gap-2">
                                {canManageReview && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="hidden h-8 text-xs text-slate-600 sm:flex dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                        onClick={openEditModal}
                                    >
                                        <Edit3 className="mr-2 h-3 w-3" /> Edit
                                        Notulen
                                    </Button>
                                )}
                                {meeting.current_stage >= 7 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                        onClick={downloadPdf}
                                    >
                                        <Download className="mr-2 h-3 w-3" />{' '}
                                        Unduh{' '}
                                        <ChevronDown className="ml-1 h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-8 p-4 text-sm text-slate-800 dark:text-slate-200">
                            {minutes.content &&
                            typeof minutes.content === 'object' &&
                            !Array.isArray(minutes.content) ? (
                                <div className="space-y-8">
                                    {/* Peserta Rapat */}
                                    {minutes.content.peserta_rapat &&
                                        Array.isArray(
                                            minutes.content.peserta_rapat,
                                        ) &&
                                        minutes.content.peserta_rapat.length >
                                            0 && (
                                            <div>
                                                <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
                                                    Peserta Rapat
                                                </h3>
                                                <ul className="list-disc space-y-1.5 pl-5">
                                                    {minutes.content.peserta_rapat.map(
                                                        (
                                                            peserta: string,
                                                            idx: number,
                                                        ) => (
                                                            <li
                                                                key={idx}
                                                                className="leading-relaxed text-slate-700 dark:text-slate-300"
                                                            >
                                                                {peserta}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                    {/* Latar Belakang */}
                                    {minutes.content.latar_belakang && (
                                        <div>
                                            <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
                                                Latar Belakang
                                            </h3>
                                            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                                                {minutes.content.latar_belakang}
                                            </p>
                                        </div>
                                    )}
                                    {minutes.content.pembukaan && (
                                        <div>
                                            <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
                                                Pembukaan
                                            </h3>
                                            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                                                {minutes.content.pembukaan}
                                            </p>
                                        </div>
                                    )}

                                    {/* Pembahasan */}
                                    {minutes.content.pembahasan &&
                                        Array.isArray(
                                            minutes.content.pembahasan,
                                        ) &&
                                        minutes.content.pembahasan.length >
                                            0 && (
                                            <div>
                                                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                                                    Pembahasan
                                                </h3>
                                                <div className="space-y-6">
                                                    {minutes.content.pembahasan.map(
                                                        (
                                                            bahas: any,
                                                            idx: number,
                                                        ) => (
                                                            <div
                                                                key={idx}
                                                                className="border-l-2 border-blue-200 pl-4 dark:border-blue-700"
                                                            >
                                                                <h4 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                                    {
                                                                        bahas.topik
                                                                    }
                                                                </h4>
                                                                <p className="mb-2 leading-relaxed text-slate-700 dark:text-slate-300">
                                                                    {
                                                                        bahas.narasi
                                                                    }
                                                                </p>
                                                                {bahas.tabel && (
                                                                    <div
                                                                        className="mt-2 overflow-x-auto rounded bg-slate-50 p-2 text-xs dark:bg-slate-800/60"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html:
                                                                                typeof window !==
                                                                                'undefined'
                                                                                    ? DOMPurify.sanitize(
                                                                                          bahas.tabel,
                                                                                      )
                                                                                    : '',
                                                                        }}
                                                                    />
                                                                )}
                                                                {bahas.list && (
                                                                    <div
                                                                        className="mt-2 list-disc pl-4 text-sm text-slate-700 dark:text-slate-300"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html:
                                                                                typeof window !==
                                                                                'undefined'
                                                                                    ? DOMPurify.sanitize(
                                                                                          bahas.list,
                                                                                      )
                                                                                    : '',
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Keputusan */}
                                    {minutes.content.keputusan &&
                                        Array.isArray(
                                            minutes.content.keputusan,
                                        ) &&
                                        minutes.content.keputusan.length >
                                            0 && (
                                            <div>
                                                <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
                                                    Keputusan
                                                </h3>
                                                <ul className="list-disc space-y-1.5 pl-5">
                                                    {minutes.content.keputusan.map(
                                                        (
                                                            kep: string,
                                                            idx: number,
                                                        ) => (
                                                            <li
                                                                key={idx}
                                                                className="leading-relaxed text-slate-700 dark:text-slate-300"
                                                            >
                                                                {kep}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                </div>
                            ) : (
                                <div className="text-slate-500 italic dark:text-slate-400">
                                    Konten notulen tidak tersedia atau format
                                    tidak didukung.
                                </div>
                            )}

                            <div>
                                <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
                                    Tindak Lanjut
                                </h3>
                                <div className="space-y-2">
                                    {minutes.action_items &&
                                    minutes.action_items.length > 0 ? (
                                        minutes.action_items.map(
                                            (item: any) => (
                                                <div
                                                    className="flex gap-2"
                                                    key={item.id}
                                                >
                                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                                        {item.description} (PIC:{' '}
                                                        {item.pic}, Deadline:{' '}
                                                        {item.deadline
                                                            ? new Date(
                                                                  item.deadline,
                                                              ).toLocaleDateString(
                                                                  'id-ID',
                                                                  {
                                                                      day: 'numeric',
                                                                      month: 'long',
                                                                      year: 'numeric',
                                                                  },
                                                              )
                                                            : '-'}
                                                        )
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <div className="text-sm text-slate-500 italic dark:text-slate-400">
                                            Tidak ada tindak lanjut.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="rounded-b-xl border-t border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
                            <div className="flex w-full items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                                <Info className="h-4 w-4 shrink-0" />
                                <span className="text-xs font-medium">
                                    Notulen ini telah melalui proses
                                    transkripsi, koreksi, dan verifikasi
                                    kehadiran.
                                </span>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Kanan: Peserta Rapat & Info Review */}
                <div className="space-y-6">
                    {/* Peserta Rapat */}
                    <Card className="rounded-xl border-slate-200 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                                Peserta Rapat
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            Hadir
                                        </span>
                                    </div>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {hadir} ({getPct(hadir)}%)
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            Terlambat
                                        </span>
                                    </div>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {terlambat} ({getPct(terlambat)}%)
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            Tidak Hadir
                                        </span>
                                    </div>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {tidakHadir} ({getPct(tidakHadir)}%)
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm dark:border-slate-800/60">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">
                                            Total Peserta
                                        </span>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {total} Orang
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dokumen Pendukung */}
                    {renderDocumentCard(true)}

                    {/* Informasi Review */}
                    <Card className="rounded-xl border-slate-200 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                                Informasi Review
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div>
                                <p className="mb-2 text-[11px] text-slate-500 dark:text-slate-400">
                                    Direview oleh
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700 uppercase dark:bg-emerald-950/60 dark:text-emerald-400">
                                        {auth?.user?.name?.substring(0, 2) ||
                                            'BU'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {auth?.user?.name || 'Bag. Umum'}
                                        </p>
                                        <Badge
                                            variant="secondary"
                                            className="mt-0.5 h-5 bg-blue-50 text-[10px] text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                                        >
                                            {auth?.user?.department ||
                                                'Operator'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="mb-1 text-[11px] text-slate-500 dark:text-slate-400">
                                    Tanggal Review
                                </p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {minutes.reviewed_at
                                        ? new Date(minutes.reviewed_at)
                                              .toLocaleString('id-ID', {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric',
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                              })
                                              .replace('.', ':') + ' WIB'
                                        : 'Belum direview'}
                                </p>
                            </div>

                            <div>
                                <p className="mb-1 text-[11px] text-slate-500 dark:text-slate-400">
                                    Status
                                </p>
                                <Badge className="border-0 bg-blue-50 text-xs font-medium text-blue-600 shadow-none hover:bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 dark:hover:bg-blue-950/60">
                                    Siap Dikirim
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Langkah Selanjutnya */}
                    {canManageReview &&
                        meeting.current_stage === 5 &&
                        !isPimpinan && (
                            <Alert className="rounded-2xl border-blue-200 bg-blue-50/80 text-blue-900 backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/30 dark:text-blue-200">
                                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <AlertTitle className="ml-2 text-base font-bold text-blue-800 dark:text-blue-300">
                                    Langkah Selanjutnya
                                </AlertTitle>
                                <AlertDescription className="mt-1 ml-2 font-medium text-blue-700 dark:text-blue-400/90">
                                    Jika notulen sudah sesuai, klik tombol{' '}
                                    <strong>"Kirim ke Pimpinan"</strong> di
                                    kanan atas untuk meminta persetujuan
                                    Pimpinan.
                                </AlertDescription>
                            </Alert>
                        )}
                </div>
            </div>

            {/* Edit Notulen Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Notulen Rapat</DialogTitle>
                    </DialogHeader>
                    {editData && (
                        <div className="space-y-6 py-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold">
                                        Peserta Rapat
                                    </Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setEditData({
                                                ...editData,
                                                peserta_rapat: [
                                                    ...(editData.peserta_rapat ||
                                                        []),
                                                    '',
                                                ],
                                            })
                                        }
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Tambah
                                        Peserta
                                    </Button>
                                </div>
                                {editData.peserta_rapat?.map(
                                    (peserta: string, idx: number) => (
                                        <div
                                            key={`p-${idx}`}
                                            className="flex items-center gap-2"
                                        >
                                            <div className="h-2 w-2 shrink-0 rounded-full bg-slate-400"></div>
                                            <Input
                                                value={peserta}
                                                onChange={(e) => {
                                                    const newData = [
                                                        ...editData.peserta_rapat,
                                                    ];
                                                    newData[idx] =
                                                        e.target.value;
                                                    setEditData({
                                                        ...editData,
                                                        peserta_rapat: newData,
                                                    });
                                                }}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="shrink-0 text-rose-500"
                                                onClick={() => {
                                                    const newData = [
                                                        ...editData.peserta_rapat,
                                                    ];
                                                    newData.splice(idx, 1);
                                                    setEditData({
                                                        ...editData,
                                                        peserta_rapat: newData,
                                                    });
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ),
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="font-bold">
                                    Latar Belakang
                                </Label>
                                <Textarea
                                    value={
                                        editData.latar_belakang ||
                                        editData.pembukaan ||
                                        ''
                                    }
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            latar_belakang: e.target.value,
                                            pembukaan: e.target.value,
                                        })
                                    }
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold">
                                        Pembahasan
                                    </Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setEditData({
                                                ...editData,
                                                pembahasan: [
                                                    ...(editData.pembahasan ||
                                                        []),
                                                    { topik: '', narasi: '' },
                                                ],
                                            })
                                        }
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Tambah
                                        Topik
                                    </Button>
                                </div>
                                {editData.pembahasan?.map(
                                    (bahas: any, idx: number) => (
                                        <Card
                                            key={idx}
                                            className="relative p-4"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 text-rose-500 hover:text-rose-600"
                                                onClick={() => {
                                                    const newBahas = [
                                                        ...editData.pembahasan,
                                                    ];
                                                    newBahas.splice(idx, 1);
                                                    setEditData({
                                                        ...editData,
                                                        pembahasan: newBahas,
                                                    });
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <div className="space-y-3 pr-8">
                                                <div>
                                                    <Label className="text-xs">
                                                        Topik
                                                    </Label>
                                                    <Input
                                                        value={
                                                            bahas.topik || ''
                                                        }
                                                        onChange={(e) => {
                                                            const newBahas = [
                                                                ...editData.pembahasan,
                                                            ];
                                                            newBahas[
                                                                idx
                                                            ].topik =
                                                                e.target.value;
                                                            setEditData({
                                                                ...editData,
                                                                pembahasan:
                                                                    newBahas,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">
                                                        Narasi
                                                    </Label>
                                                    <Textarea
                                                        value={
                                                            bahas.narasi || ''
                                                        }
                                                        onChange={(e) => {
                                                            const newBahas = [
                                                                ...editData.pembahasan,
                                                            ];
                                                            newBahas[
                                                                idx
                                                            ].narasi =
                                                                e.target.value;
                                                            setEditData({
                                                                ...editData,
                                                                pembahasan:
                                                                    newBahas,
                                                            });
                                                        }}
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    ),
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold">
                                        Keputusan
                                    </Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setEditData({
                                                ...editData,
                                                keputusan: [
                                                    ...(editData.keputusan ||
                                                        []),
                                                    '',
                                                ],
                                            })
                                        }
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Tambah
                                        Keputusan
                                    </Button>
                                </div>
                                {editData.keputusan?.map(
                                    (kep: string, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2"
                                        >
                                            <div className="h-2 w-2 shrink-0 rounded-full bg-slate-400"></div>
                                            <Input
                                                value={kep}
                                                onChange={(e) => {
                                                    const newKep = [
                                                        ...editData.keputusan,
                                                    ];
                                                    newKep[idx] =
                                                        e.target.value;
                                                    setEditData({
                                                        ...editData,
                                                        keputusan: newKep,
                                                    });
                                                }}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="shrink-0 text-rose-500"
                                                onClick={() => {
                                                    const newKep = [
                                                        ...editData.keputusan,
                                                    ];
                                                    newKep.splice(idx, 1);
                                                    setEditData({
                                                        ...editData,
                                                        keputusan: newKep,
                                                    });
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={saveEdit}
                            disabled={sending}
                        >
                            {sending ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={documentToDelete !== null}
                onOpenChange={(open) => !open && setDocumentToDelete(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">
                            Hapus Dokumen
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 text-slate-600">
                        <p>Apakah Anda yakin ingin menghapus dokumen ini?</p>
                        <p className="mt-2 text-sm font-medium text-rose-600">
                            <AlertCircle className="mr-1 inline h-4 w-4" />
                            Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDocumentToDelete(null)}
                            disabled={sending}
                        >
                            Batal
                        </Button>
                        <Button
                            className="bg-rose-600 text-white hover:bg-rose-700"
                            onClick={() => {
                                if (!documentToDelete) {
                                    return;
                                }

                                setSending(true);
                                router.delete(
                                    `/meetings/${meeting.id}/documents/${documentToDelete}`,
                                    {
                                        onFinish: () => {
                                            setSending(false);
                                            setDocumentToDelete(null);
                                        },
                                    },
                                );
                            }}
                            disabled={sending}
                        >
                            {sending ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            {sending ? 'Menghapus...' : 'Ya, Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
