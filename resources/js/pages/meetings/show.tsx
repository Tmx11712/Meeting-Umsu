import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Calendar,
    MapPin,
    Clock,
    Edit,
    Mic,
    PenTool,
    Users,
    FileText,
    CheckCircle,
    QrCode,
    Download,
    Ban,
} from 'lucide-react';
import { useState, lazy, Suspense } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { useInitials } from '@/hooks/use-initials';
import { useIsClient } from '@/hooks/use-is-client';
import { useMeetingWebSocket } from '@/hooks/use-meeting-websocket';

// Lazy-load QRCodeCanvas agar tidak crash saat SSR (Node.js tidak punya Canvas API)
const QRCodeCanvas = lazy(() =>
    import('qrcode.react').then((m) => ({ default: m.QRCodeCanvas })),
);

export default function MeetingShow({ meeting }: any) {
    useMeetingWebSocket(meeting?.id);
    const [isQrOpen, setIsQrOpen] = useState(false);
    const isClient = useIsClient();

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
    const { auth } = usePage<any>().props;
    const getInitials = useInitials();
    const roles = auth?.roles || [];
    const isAdmin =
        roles.includes('Super Admin') || roles.includes('Administrator');
    const isUmum = roles.includes('Bag. Umum');
    const isHumas = roles.includes('Bag. Humas');
    const isPimpinan = roles.includes('Pimpinan');
    const isViewer = roles.includes('Viewer');

    const currentStage = Number(meeting.current_stage || 1);
    const isCancelled = meeting.status === 'dibatalkan';

    const canRecord =
        (isAdmin || isHumas || isUmum) && !isCancelled && currentStage <= 2;
    const canEnterRecordingRoom =
        (isAdmin || isHumas || isUmum) && !isCancelled;
    const canCorrect = (isAdmin || isUmum) && !isCancelled && currentStage >= 3;
    const canAttend = (isAdmin || isUmum || isHumas) && !isCancelled;
    const canReview = (isAdmin || isUmum) && !isCancelled && currentStage >= 4;
    const canApprove =
        (isAdmin || isPimpinan) && !isCancelled && currentStage >= 6;
    const hasOperationalActions =
        canEnterRecordingRoom ||
        canCorrect ||
        canAttend ||
        canReview ||
        canApprove;

    return (
        <div className="flex w-full animate-in flex-col gap-4 py-2 duration-700 fade-in slide-in-from-bottom-4">
            <Head title={`Rapat: ${meeting.title}`} />

            {/* Header & Breadcrumb */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center dark:border-slate-800/60 dark:bg-slate-900/40">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Informasi Rapat
                        </h1>
                        <Badge
                            variant={
                                meeting.status === 'selesai'
                                    ? 'default'
                                    : 'secondary'
                            }
                            className="border-border bg-card/60 px-3 py-1 text-sm text-foreground"
                        >
                            {meeting.status === 'dibatalkan'
                                ? 'RAPAT DIBATALKAN'
                                : meeting.status?.toUpperCase() || 'TERJADWAL'}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span>Dashboard</span>
                        <span></span>
                        <Link
                            href="/meetings"
                            className="transition-colors hover:text-blue-600"
                        >
                            Jadwal Rapat
                        </Link>
                        <span></span>
                        <span className="font-bold text-blue-900 dark:text-blue-300">
                            {meeting.title}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        asChild
                        className="h-11 rounded-xl border-border bg-card/60 shadow-sm hover:bg-card"
                    >
                        <Link href="/meetings">Kembali ke Jadwal</Link>
                    </Button>
                    {meeting.minutes && meeting.minutes.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={() =>
                                window.open(
                                    `/meetings/${meeting.id}/review/pdf`,
                                    '_blank',
                                )
                            }
                            className="h-11 rounded-xl border-border bg-card/60 px-4 font-semibold text-slate-700 shadow-sm hover:bg-card dark:text-slate-200"
                        >
                            <Download className="mr-2 h-4 w-4" /> Unduh Notulen
                            PDF
                        </Button>
                    )}
                    {(isAdmin || isUmum) && (
                        <>
                            {['terjadwal'].includes(meeting.status) && (
                                <Button
                                    variant="destructive"
                                    className="h-11 rounded-xl px-5 font-semibold shadow-md transition-all hover:shadow-lg"
                                    onClick={async () => {
                                        const { confirmDelete } =
                                            await import('@/lib/sweetalert');

                                        if (
                                            await confirmDelete(
                                                'Batalkan Rapat?',
                                                'Rapat yang dibatalkan tidak dapat dikembalikan.',
                                                'Ya, Batalkan!',
                                            )
                                        ) {
                                            router.post(
                                                `/meetings/${meeting.id}/cancel`,
                                            );
                                        }
                                    }}
                                >
                                    <Ban className="mr-2 h-4 w-4" /> Batalkan
                                    Rapat
                                </Button>
                            )}
                            <Button
                                className="h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
                                asChild
                            >
                                <Link href={`/meetings/${meeting.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Rapat
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-6 md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Rapat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col justify-between border-b py-2 sm:flex-row sm:items-center">
                                <span className="text-muted-foreground">
                                    Tanggal
                                </span>
                                <span className="flex items-center font-medium">
                                    <Calendar className="mr-2 h-4 w-4" />{' '}
                                    {meeting.date}
                                </span>
                            </div>
                            <div className="flex flex-col justify-between border-b py-2 sm:flex-row sm:items-center">
                                <span className="text-muted-foreground">
                                    Waktu
                                </span>
                                <span className="flex items-center font-medium">
                                    <Clock className="mr-2 h-4 w-4" />{' '}
                                    {meeting.start_time
                                        ? meeting.start_time.substring(0, 5)
                                        : ''}{' '}
                                    -{' '}
                                    {meeting.end_time
                                        ? meeting.end_time.substring(0, 5)
                                        : ''}
                                </span>
                            </div>
                            <div className="flex flex-col justify-between gap-4 border-b py-2 sm:flex-row sm:items-center">
                                <span className="shrink-0 text-muted-foreground">
                                    Lokasi
                                </span>
                                <span className="flex min-w-0 items-center justify-end font-medium sm:text-right">
                                    <MapPin className="mr-2 h-4 w-4 shrink-0" />
                                    <span
                                        className="truncate"
                                        title={meeting.location}
                                    >
                                        {meeting.location}
                                    </span>
                                </span>
                            </div>
                            <div className="flex flex-col justify-between border-b py-2 sm:flex-row sm:items-center">
                                <span className="text-muted-foreground">
                                    Tipe Rapat
                                </span>
                                <span className="font-medium uppercase">
                                    {meeting.type}
                                </span>
                            </div>
                            <div className="pt-2">
                                <span className="mb-2 block text-muted-foreground">
                                    Agenda Rapat
                                </span>
                                {meeting.agenda && meeting.agenda.length > 0 ? (
                                    <ul className="list-disc space-y-1 pl-5 font-medium">
                                        {meeting.agenda.map(
                                            (item: string, index: number) => (
                                                <li key={index}>{item}</li>
                                            ),
                                        )}
                                    </ul>
                                ) : (
                                    <p className="font-medium text-slate-500 italic">
                                        Tidak ada agenda
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Operational Buttons Card */}
                    {hasOperationalActions && (
                        <Card className="border-blue-200 bg-blue-50/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-blue-800">
                                    Tindakan Operasional
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-3">
                                {canEnterRecordingRoom && (
                                    <Button
                                        onClick={() => setIsQrOpen(true)}
                                        variant="outline"
                                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                    >
                                        <QrCode className="mr-2 h-4 w-4" />{' '}
                                        Tampilkan QR Absensi
                                    </Button>
                                )}
                                {canEnterRecordingRoom && (
                                    <Button
                                        asChild
                                        variant="default"
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Link
                                            href={`/meetings/${meeting.id}/recording`}
                                        >
                                            <Mic className="mr-2 h-4 w-4" />{' '}
                                            Buka Ruang Rekaman
                                        </Link>
                                    </Button>
                                )}
                                {canCorrect && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                    >
                                        <Link
                                            href={`/meetings/${meeting.id}/correction`}
                                        >
                                            <PenTool className="mr-2 h-4 w-4" />{' '}
                                            Koreksi Transkrip
                                        </Link>
                                    </Button>
                                )}
                                {canAttend && !isHumas && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                    >
                                        <Link
                                            href={`/meetings/${meeting.id}/attendance`}
                                        >
                                            <Users className="mr-2 h-4 w-4" />{' '}
                                            Kelola Absensi
                                        </Link>
                                    </Button>
                                )}
                                {canReview && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                    >
                                        <Link
                                            href={`/meetings/${meeting.id}/review`}
                                        >
                                            <FileText className="mr-2 h-4 w-4" />{' '}
                                            Review Notulen
                                        </Link>
                                    </Button>
                                )}
                                {canApprove && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                    >
                                        <Link
                                            href={`/meetings/${meeting.id}/approval`}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />{' '}
                                            Persetujuan Pimpinan
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Daftar Peserta (
                                {(meeting.participants?.length || 0) +
                                    (meeting.attendances?.filter(
                                        (a: any) => !a.user_id,
                                    ).length || 0)}
                                )
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {meeting.participants?.map(
                                    (participant: any) => (
                                        <li
                                            key={`internal-${participant.id}`}
                                            className="flex items-center space-x-3"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                                {participant.user?.name
                                                    ? getInitials(
                                                          participant.user.name,
                                                      )
                                                    : '??'}
                                            </div>
                                            <div>
                                                <p className="text-sm leading-none font-medium">
                                                    {participant.user?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {participant.user
                                                        ?.department || 'Staff'}
                                                </p>
                                            </div>
                                        </li>
                                    ),
                                )}

                                {meeting.attendances
                                    ?.filter((a: any) => !a.user_id)
                                    .map((guest: any) => (
                                        <li
                                            key={`external-${guest.id}`}
                                            className="flex items-center space-x-3"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
                                                {guest.guest_name
                                                    ? getInitials(
                                                          guest.guest_name,
                                                      )
                                                    : '??'}
                                            </div>
                                            <div>
                                                <p className="text-sm leading-none font-medium">
                                                    {guest.guest_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {guest.guest_unit_kerja &&
                                                    guest.guest_institution
                                                        ? `${guest.guest_unit_kerja} - ${guest.guest_institution}`
                                                        : guest.guest_institution ||
                                                          guest.guest_unit_kerja ||
                                                          'Tamu Eksternal'}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
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
