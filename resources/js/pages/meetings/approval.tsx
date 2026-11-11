import { Head, Link, router, usePage } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import {
    Download,
    FileText,
    CheckCircle2,
    RotateCcw,
    Info,
    Edit3,
    Plus,
    Trash2,
} from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

import { MeetingInfoCard } from '@/components/meetings/MeetingInfoCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMeetingWebSocket } from '@/hooks/use-meeting-websocket';
import { usePermissions } from '@/hooks/use-permissions';
import type { Meeting } from '@/types/meeting';

function formatDateInputValue(value?: string | null): string {
    if (!value) {
        return '';
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return value.substring(0, 10);
    }

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export default function MeetingApproval({
    meeting,
    ...props
}: {
    meeting: Meeting;
    [key: string]: any;
}) {
    const minutes =
        meeting.minutes && meeting.minutes.length > 0
            ? meeting.minutes[0]
            : null;
    const { auth } = usePage<any>().props;
    const { canEdit } = usePermissions();
    const canManageApproval = canEdit('approval'); // Untuk ACC / Tolak
    const canEditMinutes = canEdit('minutes'); // Untuk Edit Manual / Edit Tindak Lanjut
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [notes, setNotes] = useState('');
    const participants = meeting.participants || [];

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [savingEdit, setSavingEdit] = useState(false);

    const [editActionModalOpen, setEditActionModalOpen] = useState(false);
    const [actionItemsData, setActionItemsData] = useState<any[]>([]);
    const [savingActionItems, setSavingActionItems] = useState(false);

    const formatReviewDate = (dateString?: string) => {
        if (!dateString) {
            return '-';
        }

        const d = new Date(dateString);
        const months = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
        ];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');

        return `${day} ${month} ${year} ${hours}:${mins} WIB`;
    };

    useMeetingWebSocket(meeting?.id);

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

    const totalSeconds =
        meeting.recordings?.reduce(
            (sum: number, r: any) => sum + (r.duration_seconds || 0),
            0,
        ) ||
        meeting.duration ||
        0;
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

    const submitCorrection = () => {
        setSavingEdit(true);
        router.put(
            `/meetings/${meeting.id}/review`,
            { content: editData },
            {
                onSuccess: () => {
                    setEditModalOpen(false);
                },
                onFinish: () => setSavingEdit(false),
            },
        );
    };

    const saveEdit = () => {
        setSavingEdit(true);
        router.put(
            `/meetings/${meeting.id}/review`,
            { content: editData },
            {
                onSuccess: () => {
                    setEditModalOpen(false);
                },
                onFinish: () => setSavingEdit(false),
            },
        );
    };

    const openActionItemsModal = () => {
        if (minutes?.action_items) {
            setActionItemsData(
                JSON.parse(JSON.stringify(minutes.action_items)),
            );
        } else {
            setActionItemsData([]);
        }

        setEditActionModalOpen(true);
    };

    const saveActionItems = () => {
        setSavingActionItems(true);
        router.put(
            `/meetings/${meeting.id}/approval/action-items`,
            { action_items: actionItemsData },
            {
                onSuccess: () => {
                    setEditActionModalOpen(false);
                },
                onFinish: () => setSavingActionItems(false),
            },
        );
    };

    const addActionItem = () => {
        setActionItemsData([
            ...actionItemsData,
            { description: '', pic: '', deadline: '' },
        ]);
    };

    const updateActionItem = (index: number, field: string, value: string) => {
        const newData = [...actionItemsData];
        newData[index][field] = value;
        setActionItemsData(newData);
    };

    const removeActionItem = (index: number) => {
        const newData = [...actionItemsData];
        newData.splice(index, 1);
        setActionItemsData(newData);
    };

    const handleApprove = () => {
        setApproving(true);
        router.post(
            `/meetings/${meeting.id}/approval`,
            { decision: 'approved', notes },
            {
                onFinish: () => setApproving(false),
            },
        );
    };

    const handleReject = () => {
        setRejecting(true);
        router.post(
            `/meetings/${meeting.id}/approval`,
            { decision: 'rejected', notes },
            {
                onFinish: () => setRejecting(false),
            },
        );
    };

    const total = participants.length > 0 ? participants.length : 12;
    const getPct = (num: number) =>
        total > 0 ? ((num / total) * 100).toFixed(2) : '0.00';

    if (!minutes) {
        return (
            <div className="flex w-full animate-in flex-col gap-4 py-2 duration-700 fade-in slide-in-from-bottom-4">
                <Head title="Pimpinan" />

                {/* Header & Breadcrumb */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center dark:border-slate-800/60 dark:bg-slate-900/40">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Persetujuan Pimpinan
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
                                Persetujuan Pimpinan
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        asChild
                        className="h-11 rounded-xl border-slate-200 bg-white/60 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800"
                    >
                        <Link href="/meetings">Kembali ke Jadwal</Link>
                    </Button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    Notulen belum digenerate atau belum dikirim oleh operator.
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full animate-in flex-col gap-4 py-2 duration-700 fade-in slide-in-from-bottom-4">
            <Head title="Pimpinan" />

            {/* Header & Breadcrumb */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center dark:border-slate-800/60 dark:bg-slate-900/40">
                <div>
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Persetujuan Pimpinan
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
                            Persetujuan Pimpinan
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        asChild
                        className="h-11 rounded-xl border-slate-200 bg-white/60 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800"
                    >
                        <Link href="/meetings">Kembali ke Jadwal</Link>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() =>
                            window.open(
                                `/meetings/${meeting.id}/review/pdf`,
                                '_blank',
                            )
                        }
                        className="h-11 rounded-xl border-slate-200 bg-white/60 px-4 font-semibold text-slate-700 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        <Download className="mr-2 h-4 w-4" /> Unduh PDF
                    </Button>
                    {canManageApproval && (
                        <Button
                            className="h-11 rounded-xl bg-blue-600 px-4 font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
                            onClick={handleApprove}
                            disabled={approving || rejecting}
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Setujui
                            Notulen
                        </Button>
                    )}
                </div>
            </div>

            {!canManageApproval && (
                <Alert className="rounded-2xl border-rose-200 bg-rose-50/80 text-rose-900 backdrop-blur-sm dark:border-rose-800/50 dark:bg-rose-900/30 dark:text-rose-200">
                    <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    <AlertTitle className="ml-2 text-base font-bold text-rose-800 dark:text-rose-300">
                        Mode Hanya Baca
                    </AlertTitle>
                    <AlertDescription className="mt-1 ml-2 font-medium text-rose-700 dark:text-rose-400/90">
                        Anda tidak memiliki izin untuk menyetujui notulen ini.
                        Anda hanya dapat melihat data.
                    </AlertDescription>
                </Alert>
            )}

            {/* Top Row: 2 columns */}
            <div className="mb-6 flex flex-col justify-center gap-6 xl:flex-row">
                {/* Info Rapat */}
                <MeetingInfoCard
                    meeting={meeting}
                    className="w-full rounded-xl border-slate-200 shadow-sm xl:w-150"
                />

                {/* Ringkasan Otomatis AI */}
                <Card className="mx-auto h-fit w-fit rounded-xl border-slate-200 shadow-sm xl:mx-0">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold text-slate-900">
                            Ringkasan Otomatis (AI)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap justify-center gap-3">
                            <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-xl border border-blue-100 bg-blue-50/50 p-2 text-center">
                                <p className="mb-1 text-[10px] font-medium text-blue-700">
                                    Topik Utama
                                </p>
                                <p className="text-2xl leading-none font-bold text-blue-600">
                                    {minutes.ai_topics_count || 0}
                                </p>
                                <p className="mt-1 text-[10px] text-blue-500">
                                    Topik
                                </p>
                            </div>
                            <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-xl border border-green-100 bg-green-50/50 p-2 text-center">
                                <p className="mb-1 text-[10px] font-medium text-green-700">
                                    Keputusan
                                </p>
                                <p className="text-2xl leading-none font-bold text-green-600">
                                    {minutes.ai_decisions_count || 0}
                                </p>
                                <p className="mt-1 text-[10px] text-green-500">
                                    Keputusan Penting
                                </p>
                            </div>
                            <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-xl border border-yellow-100 bg-yellow-50/50 p-2 text-center">
                                <p className="mb-1 text-[10px] font-medium text-yellow-700">
                                    Tindak Lanjut
                                </p>
                                <p className="text-2xl leading-none font-bold text-yellow-600">
                                    {minutes.action_items?.length || 0}
                                </p>
                                <p className="mt-1 text-[10px] text-yellow-500">
                                    Action Items
                                </p>
                            </div>
                            <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-xl border border-sky-100 bg-sky-50/50 p-2 text-center">
                                <p className="mb-1 text-[10px] font-medium text-sky-700">
                                    Durasi Rapat
                                </p>
                                <p className="mt-1 text-xl leading-none font-bold text-sky-600">
                                    {recordingDuration}
                                </p>
                                <p className="mt-1 text-[10px] text-sky-500">
                                    Jam:Menit:Detik
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Middle Row: 2 columns */}
            <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
                {/* Ringkasan Notulen */}
                <Card className="flex flex-col rounded-xl border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-100 pb-4">
                        <CardTitle className="flex items-center text-base font-semibold text-slate-900">
                            <FileText className="mr-2 h-4 w-4 text-slate-500" />
                            Ringkasan Notulen
                        </CardTitle>
                        {canEditMinutes && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={openEditModal}
                                className="h-8 shadow-sm"
                            >
                                <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit
                                Manual
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6 p-4 text-sm text-slate-800">
                        {minutes.content &&
                        typeof minutes.content === 'object' &&
                        !Array.isArray(minutes.content) ? (
                            <div className="space-y-8">
                                {/* Latar Belakang */}
                                {minutes.content.latar_belakang && (
                                    <div>
                                        <h3 className="mb-2 text-sm font-bold text-slate-900">
                                            Latar Belakang
                                        </h3>
                                        <p className="leading-relaxed text-slate-700">
                                            {minutes.content.latar_belakang}
                                        </p>
                                    </div>
                                )}
                                {minutes.content.pembukaan && (
                                    <div>
                                        <h3 className="mb-2 text-sm font-bold text-slate-900">
                                            Pembukaan
                                        </h3>
                                        <p className="leading-relaxed text-slate-700">
                                            {minutes.content.pembukaan}
                                        </p>
                                    </div>
                                )}

                                {/* Peserta Rapat */}
                                {minutes.content.peserta_rapat &&
                                    Array.isArray(
                                        minutes.content.peserta_rapat,
                                    ) &&
                                    minutes.content.peserta_rapat.length >
                                        0 && (
                                        <div>
                                            <h3 className="mb-2 text-sm font-bold text-slate-900">
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
                                                            className="leading-relaxed text-slate-700"
                                                        >
                                                            {peserta}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                {/* Pembahasan */}
                                {minutes.content.pembahasan &&
                                    Array.isArray(minutes.content.pembahasan) &&
                                    minutes.content.pembahasan.length > 0 && (
                                        <div>
                                            <h3 className="mb-3 text-sm font-bold text-slate-900">
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
                                                            className="border-l-2 border-blue-200 pl-4"
                                                        >
                                                            <h4 className="mb-2 text-sm font-semibold text-slate-800">
                                                                {bahas.topik}
                                                            </h4>
                                                            <p className="mb-2 leading-relaxed text-slate-700">
                                                                {bahas.narasi}
                                                            </p>
                                                            {bahas.tabel && (
                                                                <div
                                                                    className="mt-2 overflow-x-auto rounded bg-slate-50 p-2 text-xs"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: DOMPurify.sanitize(
                                                                            bahas.tabel,
                                                                        ),
                                                                    }}
                                                                />
                                                            )}
                                                            {bahas.list && (
                                                                <div
                                                                    className="mt-2 list-disc pl-4 text-sm text-slate-700"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: DOMPurify.sanitize(
                                                                            bahas.list,
                                                                        ),
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
                                    Array.isArray(minutes.content.keputusan) &&
                                    minutes.content.keputusan.length > 0 && (
                                        <div>
                                            <h3 className="mb-2 text-sm font-bold text-slate-900">
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
                                                            className="leading-relaxed text-slate-700"
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
                            <div className="text-slate-500 italic">
                                Konten notulen tidak tersedia atau format tidak
                                didukung.
                            </div>
                        )}

                        <div className="mt-8">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900">
                                    Tindak Lanjut
                                </h3>
                                {canEditMinutes && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={openActionItemsModal}
                                        className="h-7 text-xs shadow-sm"
                                    >
                                        <Edit3 className="mr-1 h-3 w-3" /> Edit
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-3">
                                {minutes.action_items &&
                                minutes.action_items.length > 0 ? (
                                    minutes.action_items.map((item: any) => (
                                        <div
                                            className="flex gap-2"
                                            key={item.id}
                                        >
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                            <p className="text-sm leading-relaxed">
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
                                    ))
                                ) : (
                                    <div className="text-sm text-slate-500 italic">
                                        Tidak ada tindak lanjut.
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Documents and Approval Box */}
                <div className="space-y-6">
                    {/* Dokumen Notulen */}
                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center text-base font-semibold text-slate-900">
                                <FileText className="mr-2 h-4 w-4 text-slate-500" />
                                Dokumen Notulen
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {meeting.documents &&
                            meeting.documents.length > 0 ? (
                                meeting.documents.map((doc: any) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-md bg-blue-50 p-1.5 text-blue-500">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-700">
                                                {doc.title || doc.file_name}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-slate-400 hover:text-slate-600"
                                                asChild
                                            >
                                                <a
                                                    href={`/meetings/${meeting.id}/documents/${doc.id}/download`}
                                                    download
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-slate-500 italic">
                                    Belum ada dokumen.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Persetujuan Pimpinan */}
                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                Persetujuan Pimpinan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-lg border border-green-100 bg-green-50 p-3">
                                <p className="text-[11px] leading-relaxed text-green-700">
                                    Dengan menyetujui notulen ini, Anda
                                    menyatakan bahwa informasi dalam notulen
                                    telah sesuai dan dapat ditindaklanjuti.
                                </p>
                            </div>

                            {canManageApproval && (
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        className="h-10 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                                        onClick={handleReject}
                                        disabled={approving || rejecting}
                                    >
                                        <RotateCcw className="mr-2 h-4 w-4" />{' '}
                                        Tolak & Kembalikan
                                    </Button>
                                    <Button
                                        className="h-10 bg-green-600 text-white hover:bg-green-700"
                                        onClick={handleApprove}
                                        disabled={approving || rejecting}
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />{' '}
                                        Setujui Notulen
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom Row Info Banner */}
            <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 px-4 dark:border-border dark:bg-card">
                <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                        <Info className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400">
                            Dibuat oleh
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-900 dark:text-white">
                            {meeting.creator?.name || 'Sistem'}{' '}
                            <span className="font-normal text-slate-500 dark:text-slate-400">
                                (Operator)
                            </span>
                        </p>
                    </div>
                </div>

                <div className="h-8 w-px bg-slate-100 dark:bg-slate-800"></div>

                <div>
                    <p className="text-[10px] text-slate-400">Tanggal Review</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-900 dark:text-white">
                        {formatReviewDate(
                            minutes?.reviewed_at ||
                                minutes?.updated_at ||
                                meeting.updated_at,
                        )}
                    </p>
                </div>

                <div className="h-8 w-px bg-slate-100 dark:bg-slate-800"></div>

                <div className="pr-12">
                    <p className="text-[10px] text-slate-400">Versi</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-900">
                        v1.0 (Final)
                    </p>
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
                            <div className="space-y-2">
                                <Label className="font-bold">
                                    Latar Belakang
                                </Label>
                                <Textarea
                                    value={editData.latar_belakang || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            latar_belakang: e.target.value,
                                        })
                                    }
                                    rows={3}
                                />
                            </div>

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
                                        <div key={idx} className="flex gap-2">
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
                                                placeholder="Nama Peserta"
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
                                                className="absolute top-2 right-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
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
                            disabled={savingEdit}
                        >
                            {savingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Action Items Modal */}
            <Dialog
                open={editActionModalOpen}
                onOpenChange={setEditActionModalOpen}
            >
                <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Tindak Lanjut</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {actionItemsData.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4 md:flex-row"
                            >
                                <div className="w-full space-y-3">
                                    <div>
                                        <Label className="text-xs">
                                            Tugas / Tindak Lanjut
                                        </Label>
                                        <Input
                                            value={item.description || ''}
                                            onChange={(e) =>
                                                updateActionItem(
                                                    index,
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Deskripsi tugas..."
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-xs">
                                                PIC
                                            </Label>
                                            <Input
                                                value={item.pic || ''}
                                                onChange={(e) =>
                                                    updateActionItem(
                                                        index,
                                                        'pic',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Nama PIC"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">
                                                Deadline
                                            </Label>
                                            <Input
                                                type="date"
                                                value={formatDateInputValue(
                                                    item.deadline,
                                                )}
                                                onChange={(e) =>
                                                    updateActionItem(
                                                        index,
                                                        'deadline',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="mt-6 shrink-0 self-start text-red-500 hover:text-red-600"
                                    onClick={() => removeActionItem(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {actionItemsData.length === 0 && (
                            <div className="rounded-lg border border-dashed py-8 text-center text-slate-500 italic">
                                Belum ada tindak lanjut.
                            </div>
                        )}
                        <Button
                            variant="outline"
                            onClick={addActionItem}
                            className="w-full border-2 border-dashed py-6 text-slate-500 hover:text-slate-700"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Tambah Tugas
                        </Button>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditActionModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={saveActionItems}
                            disabled={savingActionItems}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {savingActionItems
                                ? 'Menyimpan...'
                                : 'Simpan Tindak Lanjut'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
