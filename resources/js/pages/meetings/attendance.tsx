import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    QrCode,
    Fingerprint,
    Search,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

import { MeetingInfoCard } from '@/components/meetings/MeetingInfoCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMeetingWebSocket } from '@/hooks/use-meeting-websocket';
import { usePermissions } from '@/hooks/use-permissions';
import type { Meeting } from '@/types/meeting';

export default function MeetingAttendance({
    meeting,
    attendanceRecords,
    qrcode,
    signaturePath,
    hasSigned,
    total,
    present,
}: {
    meeting: Meeting;
    [key: string]: any;
}) {
    const { canEdit, hasRole, isAdmin } = usePermissions();
    const { flash } = usePage().props as any;

    // Logika Bypass Admin: Jika status rapat sudah selesai atau tahap persetujuan, hanya Admin yang boleh mengubah.
    const isLocked =
        meeting.status === 'selesai' || Number(meeting.current_stage || 1) >= 6;
    const canManageAttendance = isAdmin || (canEdit('attendance') && !isLocked);

    useMeetingWebSocket(meeting?.id);
    const participants = meeting.participants || [];
    const attendances = meeting.attendances || [];
    const isIrvanCloud = meeting.source === 'irvan_cloud';
    const [qrCodeHtml, setQrCodeHtml] = useState<string | null>(null);
    const [loadingQr, setLoadingQr] = useState(false);

    // States for filtering
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [deptFilter, setDeptFilter] = useState('Semua Departemen');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Realtime polling specifically for IrvanCloud (UMSU Employee) QR Scans
    useEffect(() => {
        if (!isIrvanCloud) {
            return;
        }

        const interval = setInterval(async () => {
            try {
                // Use fetch to silently pull latest data from IrvanCloud without triggering Inertia loading bar
                await fetch(`/meetings/${meeting.id}/attendance/sync`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN':
                            (
                                document.head.querySelector(
                                    'meta[name="csrf-token"]',
                                ) as HTMLMetaElement
                            )?.content || '',
                    },
                });

                // Then reload the page data silently
                router.reload({ only: ['meeting'] });
            } catch (e) {
                console.error('Failed to sync attendance from IrvanCloud', e);
            }
        }, 15000); // Diubah dari 5000 ke 15000 untuk mengurangi beban network (lelet)

        return () => clearInterval(interval);
    }, [isIrvanCloud, meeting.id]);

    // Removed polling in favor of true real-time WebSockets via useMeetingWebSocket

    const handleManualAttendance = (userId: string, status: string) => {
        router.post(
            `/meetings/${meeting.id}/attendance/manual`,
            {
                user_id: userId,
                status: status,
            },
            { preserveScroll: true },
        );
    };

    const handleFinish = () => {
        router.post(`/meetings/${meeting.id}/attendance/finish`);
    };

    const generateQrCode = async () => {
        setLoadingQr(true);

        try {
            const res = await fetch(`/meetings/${meeting.id}/attendance/qr`);
            const data = await res.json();

            if (data.qr_code) {
                setQrCodeHtml(`data:image/svg+xml;base64,${data.qr_code}`);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingQr(false);
        }
    };

    const guestAttendances = attendances.filter((a: any) => !a.user_id);
    const totalParticipants = participants.length + guestAttendances.length;
    const hadir = attendances.filter((a: any) => a.status === 'hadir').length;
    const terlambat = attendances.filter(
        (a: any) => a.status === 'terlambat',
    ).length;
    const tidakHadir = totalParticipants - hadir - terlambat;

    const getHadirPct = () =>
        totalParticipants > 0
            ? ((hadir / totalParticipants) * 100).toFixed(2)
            : '0.00';
    const getTerlambatPct = () =>
        totalParticipants > 0
            ? ((terlambat / totalParticipants) * 100).toFixed(2)
            : '0.00';
    const getTidakHadirPct = () =>
        totalParticipants > 0
            ? ((tidakHadir / totalParticipants) * 100).toFixed(2)
            : '0.00';

    // Map table data and fix user_id & status bugs
    const tableData = participants.map((p: any) => {
        const att = attendances.find((a: any) => a.user_id === p.user_id);
        const statusLabel = att
            ? att.status === 'hadir'
                ? 'Hadir'
                : att.status === 'terlambat'
                  ? 'Terlambat'
                  : 'Tidak Hadir'
            : 'Belum';

        return {
            id: p.id,
            user_id: p.user_id, // Fix Bug #1: Ensure user_id is mapped
            name: p.user?.name,
            dept: p.user?.department || '-',
            job: p.user?.roles?.[0]?.name || '-',
            nip: p.user?.nip || '-', // Added NIP
            status: statusLabel, // Fix Bug #2: Handle 'tidak_hadir'
            time_in: att?.check_in_time
                ? new Date(att.check_in_time).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                  })
                : '-',
            time_out: att?.check_out_time
                ? new Date(att.check_out_time).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                  })
                : '-',
            method: isIrvanCloud ? 'UMSU Employee App' : 'Manual',
        };
    });

    // Append external guests (attendances without user_id)
    guestAttendances.forEach((guest: any) => {
        tableData.push({
            id: guest.id,
            user_id: null,
            name: guest.guest_name + ' (Tamu)',
            dept: guest.guest_unit_kerja || '-',
            job: guest.guest_institution || 'Tamu / Eksternal',
            nip: '-',
            status:
                guest.status === 'hadir'
                    ? 'Hadir'
                    : guest.status === 'terlambat'
                      ? 'Terlambat'
                      : 'Tidak Hadir',
            time_in: guest.check_in_time
                ? new Date(guest.check_in_time).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                  })
                : '-',
            time_out: guest.check_out_time
                ? new Date(guest.check_out_time).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                  })
                : '-',
            method: 'QR Code (Web)',
        });
    });

    // Extract unique departments for filter
    const departments = [
        'Semua Departemen',
        ...Array.from(new Set<string>(tableData.map((d: any) => d.dept))),
    ].filter((d) => d !== '-');

    // Filter table data
    const filteredData = tableData.filter((row: any) => {
        const matchSearch =
            row.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.dept?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus =
            statusFilter === 'Semua Status' || row.status === statusFilter;
        const matchDept =
            deptFilter === 'Semua Departemen' || row.dept === deptFilter;

        return matchSearch && matchStatus && matchDept;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);

    // Sidebar: Peserta Tidak Hadir/Belum
    const unrecordedParticipants = tableData.filter(
        (r: any) => r.status === 'Belum' || r.status === 'Tidak Hadir',
    );

    return (
        <div className="flex w-full animate-in flex-col gap-4 py-2 duration-700 fade-in slide-in-from-bottom-4">
            <Head title="Absensi Peserta" />

            {/* Header & Breadcrumb */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center dark:border-slate-800/60 dark:bg-slate-900/40">
                <div>
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Absensi Peserta
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
                            Absensi Peserta
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

            {!canManageAttendance && (
                <Alert className="rounded-2xl border-rose-200 bg-rose-50/80 text-rose-900 backdrop-blur-sm dark:border-rose-800/50 dark:bg-rose-900/30 dark:text-rose-200">
                    <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    <AlertTitle className="ml-2 text-base font-bold text-rose-800 dark:text-rose-300">
                        Mode Hanya Baca
                    </AlertTitle>
                    <AlertDescription className="mt-1 ml-2 font-medium text-rose-700 dark:text-rose-400/90">
                        Anda tidak memiliki izin untuk mengelola absensi rapat
                        ini. Anda hanya dapat melihat data.
                    </AlertDescription>
                </Alert>
            )}

            {/* Success Banner (Fix Bug #7: Show only when there is flash success) */}
            {flash?.success && (
                <div className="shadow-soft flex items-start gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/80 p-4 backdrop-blur-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                        <h4 className="text-sm font-semibold text-emerald-800">
                            Berhasil
                        </h4>
                        <p className="mt-0.5 text-xs text-emerald-700">
                            {flash.success}
                        </p>
                    </div>
                </div>
            )}

            {/* Top Cards Row */}
            <div
                className={
                    isIrvanCloud || !canManageAttendance
                        ? 'grid gap-4 md:grid-cols-[1.2fr_1.5fr]'
                        : 'grid gap-4 md:grid-cols-[1.2fr_1.5fr_1fr]'
                }
            >
                {/* Informasi Rapat */}
                <MeetingInfoCard
                    meeting={meeting}
                    totalParticipants={totalParticipants}
                    showDetailButton={true}
                    className="bg-glass border-white/50 backdrop-blur-xl"
                />

                {/* Ringkasan Absensi */}
                <Card className="shadow-soft bg-glass rounded-2xl border-white/50 backdrop-blur-xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
                            Ringkasan Absensi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-4 gap-2">
                            <div className="flex flex-col justify-center rounded-lg border border-emerald-100/50 bg-emerald-50/60 px-2 py-1.5 text-center shadow-sm backdrop-blur-sm">
                                <p className="text-[10px] font-medium text-emerald-700">
                                    Hadir
                                </p>
                                <p className="mt-0.5 text-lg leading-none font-bold text-emerald-600">
                                    {hadir}
                                </p>
                            </div>
                            <div className="flex flex-col justify-center rounded-lg border border-amber-100/50 bg-amber-50/60 px-2 py-1.5 text-center shadow-sm backdrop-blur-sm">
                                <p className="text-[10px] font-medium text-amber-700">
                                    Terlambat
                                </p>
                                <p className="mt-0.5 text-lg leading-none font-bold text-amber-500">
                                    {terlambat}
                                </p>
                            </div>
                            <div className="flex flex-col justify-center rounded-lg border border-rose-100/50 bg-rose-50/60 px-2 py-1.5 text-center shadow-sm backdrop-blur-sm">
                                <p className="text-[10px] font-medium text-rose-700">
                                    Tidak Hadir
                                </p>
                                <p className="mt-0.5 text-lg leading-none font-bold text-rose-500">
                                    {tidakHadir}
                                </p>
                            </div>
                            <div className="flex flex-col justify-center rounded-lg border border-blue-100/50 bg-blue-50/60 px-2 py-1.5 text-center shadow-sm backdrop-blur-sm">
                                <p className="text-[10px] font-medium text-blue-700">
                                    Total
                                </p>
                                <p className="mt-0.5 text-lg leading-none font-bold text-blue-600">
                                    {totalParticipants}
                                </p>
                            </div>
                        </div>

                        <div className="mt-2 flex items-center justify-start gap-6 px-2">
                            {/* Fake Donut Chart */}
                            <div className="relative h-24 w-24 shrink-0 drop-shadow-sm">
                                <svg
                                    viewBox="0 0 100 100"
                                    className="h-full w-full -rotate-90 transform"
                                >
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="rgba(241, 245, 249, 0.5)"
                                        strokeWidth="20"
                                        fill="none"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="#10b981"
                                        strokeWidth="20"
                                        fill="none"
                                        strokeDasharray={`${(hadir / totalParticipants) * 251 || 0} 251`}
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="#f59e0b"
                                        strokeWidth="20"
                                        fill="none"
                                        strokeDasharray={`${(terlambat / totalParticipants) * 251 || 0} 251`}
                                        strokeDashoffset={`-${(hadir / totalParticipants) * 251 || 0}`}
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="#f43f5e"
                                        strokeWidth="20"
                                        fill="none"
                                        strokeDasharray={`${(tidakHadir / totalParticipants) * 251 || 0} 251`}
                                        strokeDashoffset={`-${((hadir + terlambat) / totalParticipants) * 251 || 0}`}
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="25"
                                        fill="rgba(255, 255, 255, 0.5)"
                                    />
                                </svg>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex w-24 items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div>
                                        <span className="text-slate-700 dark:text-slate-300">
                                            Hadir
                                        </span>
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        {hadir} ({getHadirPct()}%)
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex w-24 items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-200"></div>
                                        <span className="text-slate-700 dark:text-slate-300">
                                            Terlambat
                                        </span>
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        {terlambat} ({getTerlambatPct()}%)
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex w-24 items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200"></div>
                                        <span className="text-slate-700 dark:text-slate-300">
                                            Tidak Hadir
                                        </span>
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        {tidakHadir} ({getTidakHadirPct()}%)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Metode Absensi */}
                {!isIrvanCloud && canManageAttendance && (
                    <Card className="shadow-soft bg-glass rounded-2xl border-white/50 backdrop-blur-xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
                                Metode Absensi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative rounded-xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-800/60">
                                <Badge className="absolute top-4 right-4 border border-emerald-200/50 bg-emerald-50/80 text-emerald-600 shadow-none backdrop-blur-sm hover:bg-emerald-100/80">
                                    Aktif
                                </Badge>
                                <div className="mb-3 flex items-start gap-3">
                                    <div className="rounded-lg bg-slate-100/80 p-2 text-slate-600 shadow-sm">
                                        <QrCode className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                            QR Code
                                        </h4>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                            Peserta dapat melakukan scan QR code
                                            untuk absensi.
                                        </p>
                                    </div>
                                </div>
                                {qrCodeHtml ? (
                                    <div className="mt-4 flex flex-col items-center">
                                        <div className="mb-2 rounded-xl border border-slate-200/60 bg-white p-2 shadow-sm">
                                            <img
                                                src={qrCodeHtml}
                                                alt="QR Code Absensi"
                                                className="h-32 w-32"
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={generateQrCode}
                                            disabled={
                                                loadingQr ||
                                                !canManageAttendance
                                            }
                                            className="text-xs"
                                        >
                                            {loadingQr ? (
                                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                            ) : null}{' '}
                                            Perbarui
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="mt-2 h-8 w-max rounded-lg border-blue-200/60 bg-white/50 text-xs text-blue-600 backdrop-blur-sm hover:bg-blue-50/50"
                                        onClick={generateQrCode}
                                        disabled={
                                            loadingQr || !canManageAttendance
                                        }
                                    >
                                        {loadingQr ? (
                                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                        ) : null}
                                        Tampilkan QR Code
                                    </Button>
                                )}
                            </div>

                            <div className="rounded-xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-800/60">
                                <div className="mb-3 flex items-start gap-3">
                                    <div className="rounded-lg bg-slate-100/80 p-2 text-slate-600 shadow-sm">
                                        <Fingerprint className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Manual
                                        </h4>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                            Absensi dilakukan secara manual oleh
                                            operator.
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="h-8 w-max rounded-lg border-blue-200/60 bg-white/50 text-xs text-blue-600 backdrop-blur-sm hover:bg-blue-50/50"
                                    disabled={!canManageAttendance}
                                >
                                    Input Manual
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Bottom Section */}
            <div className="grid gap-4 md:grid-cols-[1fr_300px]">
                {/* Table Area */}
                <div className="flex flex-col gap-4">
                    {/* Filters (Fix Bug #6: Make filters work) */}
                    <div className="flex flex-wrap gap-4 md:flex-nowrap">
                        <div className="shadow-soft relative flex-1 rounded-xl border border-white/50 bg-white/60 backdrop-blur-md dark:bg-slate-800/60">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama atau departemen..."
                                className="h-10 w-full rounded-xl border-0 bg-transparent pr-4 pl-9 text-sm outline-none focus:ring-0"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <select
                            className="shadow-soft h-10 w-40 rounded-xl border border-white/50 bg-white/60 px-3 py-2 text-sm text-slate-700 backdrop-blur-md outline-none dark:bg-slate-800/60"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option>Semua Status</option>
                            <option>Belum</option>
                            <option>Hadir</option>
                            <option>Terlambat</option>
                            <option>Tidak Hadir</option>
                        </select>
                        <select
                            className="shadow-soft h-10 w-48 rounded-xl border border-white/50 bg-white/60 px-3 py-2 text-sm text-slate-700 backdrop-blur-md outline-none dark:bg-slate-800/60"
                            value={deptFilter}
                            onChange={(e) => {
                                setDeptFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            {departments.map((d, i) => (
                                <option key={i}>{d}</option>
                            ))}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="bg-glass shadow-soft flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/50 backdrop-blur-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-white/20 bg-white/40 font-medium text-slate-500 backdrop-blur-md dark:bg-slate-800/40">
                                    <tr>
                                        <th className="px-4 py-4 font-medium">
                                            No
                                        </th>
                                        <th className="px-4 py-4 font-medium">
                                            Nama Peserta
                                        </th>
                                        <th className="px-4 py-4 font-medium">
                                            Departemen
                                        </th>
                                        <th className="px-4 py-4 font-medium">
                                            NIP
                                        </th>
                                        <th className="px-4 py-4 font-medium">
                                            Masuk
                                        </th>
                                        <th className="px-4 py-4 font-medium">
                                            Keluar
                                        </th>
                                        <th className="px-4 py-4 font-medium">
                                            Status
                                        </th>
                                        <th className="px-4 py-4 font-medium">
                                            Metode
                                        </th>
                                        {!isIrvanCloud &&
                                            canManageAttendance && (
                                                <th className="px-4 py-4 text-right font-medium">
                                                    Aksi
                                                </th>
                                            )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/20">
                                    {currentData.length > 0 ? (
                                        currentData.map(
                                            (row: any, i: number) => (
                                                <tr
                                                    key={row.id}
                                                    className="transition-colors hover:bg-white/30 dark:hover:bg-slate-800/30"
                                                >
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                        {startIndex + i}
                                                    </td>
                                                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                                                        {row.name}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                        {row.dept}
                                                    </td>
                                                    <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                                                        {row.nip}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                        {row.time_in}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                        {row.time_out}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge
                                                            variant="outline"
                                                            className={`border font-medium shadow-sm backdrop-blur-sm ${
                                                                row.status ===
                                                                'Hadir'
                                                                    ? 'border-emerald-200/60 bg-emerald-50/80 text-emerald-600'
                                                                    : row.status ===
                                                                        'Terlambat'
                                                                      ? 'border-amber-200/60 bg-amber-50/80 text-amber-600'
                                                                      : row.status ===
                                                                          'Tidak Hadir'
                                                                        ? 'border-rose-200/60 bg-rose-50/80 text-rose-600'
                                                                        : 'border-slate-200/60 bg-slate-100/80 text-slate-600'
                                                            }`}
                                                        >
                                                            {row.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                        {row.method}
                                                    </td>
                                                    {!isIrvanCloud &&
                                                        canManageAttendance && (
                                                            <td className="px-4 py-3 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-8 rounded-lg border-emerald-200/60 bg-white/50 text-emerald-600 shadow-sm backdrop-blur-sm hover:bg-emerald-50/80"
                                                                        onClick={() =>
                                                                            handleManualAttendance(
                                                                                row.user_id,
                                                                                'hadir',
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            row.status ===
                                                                                'Hadir' ||
                                                                            !canManageAttendance
                                                                        }
                                                                    >
                                                                        Hadir
                                                                    </Button>
                                                                    {/* Fix Bug #3: Disable Alpha if it's already 'Tidak Hadir' or 'Hadir' */}
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-8 rounded-lg border-rose-200/60 bg-white/50 text-rose-500 shadow-sm backdrop-blur-sm hover:bg-rose-50/80"
                                                                        onClick={() =>
                                                                            handleManualAttendance(
                                                                                row.user_id,
                                                                                'tidak_hadir',
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            row.status ===
                                                                                'Tidak Hadir' ||
                                                                            row.status ===
                                                                                'Hadir' ||
                                                                            !canManageAttendance
                                                                        }
                                                                    >
                                                                        Alpha
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        )}
                                                </tr>
                                            ),
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="py-8 text-center text-slate-500 dark:text-slate-400"
                                            >
                                                Tidak ada data yang sesuai
                                                filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination (Fix Bug #5: Dynamic calculations) */}
                        {filteredData.length > 0 && (
                            <div className="mt-auto flex items-center justify-between border-t border-white/20 bg-white/20 p-4 backdrop-blur-md dark:bg-slate-800/20">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    Menampilkan {startIndex} - {endIndex} dari{' '}
                                    {filteredData.length} peserta
                                </span>
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg border-slate-200/50 bg-white/60 text-slate-600"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.max(1, currentPage - 1),
                                            )
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {Array.from({ length: totalPages }).map(
                                        (_, i) => (
                                            <Button
                                                key={i}
                                                variant="outline"
                                                size="icon"
                                                className={`h-8 w-8 rounded-lg ${currentPage === i + 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200/50 bg-white/60 text-slate-600 hover:bg-slate-50/80'}`}
                                                onClick={() =>
                                                    setCurrentPage(i + 1)
                                                }
                                            >
                                                {i + 1}
                                            </Button>
                                        ),
                                    )}

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg border-slate-200/50 bg-white/60 text-slate-600"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.min(
                                                    totalPages,
                                                    currentPage + 1,
                                                ),
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-4">
                    {/* Action Buttons */}
                    {canManageAttendance && meeting.current_stage === 4 && (
                        <Button
                            className="mt-2 h-12 w-full rounded-xl bg-blue-600 text-base font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 dark:shadow-blue-900/20"
                            onClick={handleFinish}
                        >
                            <CheckCircle2 className="mr-2 h-5 w-5" /> Simpan
                            Absensi & Lanjut
                        </Button>
                    )}
                    {canManageAttendance && meeting.current_stage > 4 && (
                        <Button
                            asChild
                            className="mt-2 h-12 w-full rounded-xl bg-slate-800 text-base font-bold text-white shadow-lg transition-all hover:bg-slate-900"
                        >
                            <Link href={`/meetings/${meeting.id}/review`}>
                                Lanjut ke Review Notulen
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
