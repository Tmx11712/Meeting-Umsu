import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Filter,
    Calendar,
    Edit3,
    Trash2,
    QrCode,
    Download,
    Loader2,
} from 'lucide-react';
import {
    useEffect,
    useCallback,
    useRef,
    useState,
    lazy,
    Suspense,
} from 'react';
import { toast } from 'sonner';
import { MeetingStatusBadge } from '@/components/meetings/MeetingStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useIsClient } from '@/hooks/use-is-client';
import { usePermissions } from '@/hooks/use-permissions';

// Lazy-load QRCodeCanvas agar tidak crash saat SSR
const QRCodeCanvas = lazy(() =>
    import('qrcode.react').then((m) => ({ default: m.QRCodeCanvas })),
);

export default function MeetingIndex({ meetings, filters }: any) {
    const { canEdit, guardAction } = usePermissions();
    const [qrMeeting, setQrMeeting] = useState<any>(null);
    const isClient = useIsClient();
    const [deletingId, setDeletingId] = useState<number | null>(null);

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
        downloadLink.download = `QR_Absensi_${qrMeeting?.title?.replace(/\s+/g, '_') || 'Meeting'}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const handleSync = useCallback(() => {
        if (!guardAction('meeting', '')) {
            return;
        }

        // Ambil token CSRF Laravel
        const getXsrfToken = () => {
            const match = document.cookie.match(
                new RegExp('(^| )XSRF-TOKEN=([^;]+)'),
            );

            return match ? decodeURIComponent(match[2]) : '';
        };

        // Gunakan /meetings/auto-sync dengan cache-lock 5 menit agar tidak membebani server
        fetch('/meetings/auto-sync', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getXsrfToken(),
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data?.status === 'synced') {
                    router.reload({ only: ['meetings'] });
                }
            })
            .catch(() => {});
    }, [guardAction]);

    useEffect(() => {
        // Automatically sync on load if user has permission
        if (canEdit('meeting')) {
            handleSync();
        }
    }, [canEdit, handleSync]);

    useEffect(() => {
        const channel = (window as any).Echo?.private('meetings');

        if (channel) {
            const handleUpdate = () => {
                router.reload({ only: ['meetings'] });
            };

            channel.listen('MeetingsListUpdated', handleUpdate);
            channel.listen('.MeetingsListUpdated', handleUpdate);
        }

        return () => {
            if (channel) {
                channel.stopListening('MeetingsListUpdated');
                channel.stopListening('.MeetingsListUpdated');
                (window as any).Echo?.leaveChannel('meetings');
            }
        };
    }, []);

    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilter = (key: string, value: string) => {
        const currentFilters = { ...filters, [key]: value };

        /**
         * [EDUKASI ARSITEKTUR: PARTIAL RELOADS INERTIA]
         * Saat filter/search diubah, kita me-request data ke backend.
         * Dengan `only: ['meetings']`, backend TIDAK akan merender seluruh halaman (navbar, sidebar).
         * Backend hanya mengirimkan potongan data 'meetings' berupa JSON.
         * Ini menghemat bandwidth secara drastis (SPA Experience).
         */
        router.get('/meetings', currentFilters, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            only: ['meetings'],
        });
    };

    const handleSearchChange = (value: string) => {
        /**
         * [EDUKASI ARSITEKTUR: DEBOUNCING]
         * Mencegah server dibombardir request (DDoS) setiap kali tombol keyboard ditekan.
         * Request ke server HANYA akan dikirim jika user berhenti mengetik selama 300 milidetik.
         */
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            applyFilter('search', value);
        }, 300);
    };

    const monthOptions = Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric',
        });

        return { value, label };
    });

    return (
        <div className="flex h-full w-full flex-1 animate-in flex-col gap-4 py-2 duration-700 fade-in slide-in-from-bottom-4">
            <Head title="Jadwal Rapat" />

            {/* Header Section */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center dark:border-slate-800/60 dark:bg-slate-900/40">
                <div>
                    <h1 className="mb-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Jadwal Rapat
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Daftar dan kelola jadwal rapat instansi
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {canEdit('meeting') && (
                        <Link href="/meetings/create">
                            <Button className="h-11 rounded-xl border-0 bg-linear-to-r from-blue-600 to-blue-500 px-5 font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-2 h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Buat Rapat
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <Card className="shadow-soft overflow-hidden rounded-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
                <CardContent className="p-0">
                    {/* Top Filters Bar */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center dark:border-slate-800/50">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="search"
                                placeholder="Cari judul rapat..."
                                className="h-11 w-full rounded-xl border-slate-200 bg-white/60 pl-9 text-sm transition-all focus-visible:ring-1 focus-visible:ring-blue-500 md:w-80 dark:border-slate-700 dark:bg-slate-800/60"
                                defaultValue={filters?.search || ''}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (searchTimeout.current) {
                                            clearTimeout(searchTimeout.current);
                                        }

                                        applyFilter(
                                            'search',
                                            (e.target as HTMLInputElement)
                                                .value,
                                        );
                                    }
                                }}
                            />
                        </div>

                        <div className="flex w-full items-center gap-3 overflow-x-auto pb-2 md:w-auto md:pb-0">
                            <div className="relative shrink-0">
                                <select
                                    className="h-11 w-40 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white/60 pr-10 pl-4 text-sm text-slate-700 transition-colors outline-none hover:bg-white focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
                                    value={filters?.status || 'all'}
                                    onChange={(e) =>
                                        applyFilter('status', e.target.value)
                                    }
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="terjadwal">Terjadwal</option>
                                    <option value="berlangsung">
                                        Berlangsung
                                    </option>
                                    <option value="review">Review</option>
                                    <option value="selesai">Selesai</option>
                                </select>
                                <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                                    <svg
                                        className="h-4 w-4 text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        ></path>
                                    </svg>
                                </div>
                            </div>

                            <div className="relative shrink-0">
                                <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                </div>
                                <select
                                    className="h-11 w-45 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white/60 pr-10 pl-9 text-sm text-slate-700 transition-colors outline-none hover:bg-white focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
                                    value={filters?.month || ''}
                                    onChange={(e) =>
                                        applyFilter('month', e.target.value)
                                    }
                                >
                                    <option value="">Semua Bulan</option>
                                    {monthOptions.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                                    <svg
                                        className="h-4 w-4 text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        ></path>
                                    </svg>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="h-11 shrink-0 rounded-xl border-slate-200 bg-white/60 px-4 font-medium text-slate-700 transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
                                onClick={() =>
                                    router.get(
                                        '/meetings',
                                        {},
                                        { preserveState: false },
                                    )
                                }
                            >
                                <Filter className="mr-2 h-4 w-4 text-slate-500" />{' '}
                                Reset
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-100 bg-slate-50/50 text-xs tracking-wider text-slate-500 uppercase dark:border-slate-800/50 dark:bg-slate-800/30 dark:text-slate-400">
                                <tr>
                                    <th className="px-4 py-5 font-semibold">
                                        No
                                    </th>
                                    <th className="px-4 py-5 font-semibold">
                                        Judul Rapat
                                    </th>
                                    <th className="px-4 py-5 font-semibold">
                                        Tanggal
                                    </th>
                                    <th className="px-4 py-5 font-semibold">
                                        Waktu
                                    </th>
                                    <th className="px-4 py-5 font-semibold">
                                        Ruangan
                                    </th>
                                    <th className="px-4 py-5 text-center font-semibold">
                                        Peserta
                                    </th>
                                    <th className="px-4 py-5 text-center font-semibold">
                                        Status
                                    </th>
                                    <th className="px-4 py-5 text-center font-semibold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {meetings?.data && meetings.data.length > 0 ? (
                                    meetings.data.map(
                                        (meeting: any, index: number) => (
                                            <tr
                                                key={meeting.id}
                                                className={`group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${deletingId === meeting.id ? 'pointer-events-none opacity-50' : ''}`}
                                            >
                                                <td className="px-4 py-5 font-medium text-slate-500 dark:text-slate-400">
                                                    {(meetings.current_page -
                                                        1) *
                                                        meetings.per_page +
                                                        index +
                                                        1}
                                                </td>
                                                <td className="px-4 py-5">
                                                    <Link
                                                        href={`/meetings/${meeting.id}`}
                                                        className="font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                                                    >
                                                        {meeting.title}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-5 font-medium text-slate-600 dark:text-slate-300">
                                                    {meeting.date}
                                                </td>
                                                <td className="bg-slate-50/50 px-4 py-5 font-medium text-slate-600 dark:bg-slate-800/20 dark:text-slate-300">
                                                    {meeting.start_time?.substring(
                                                        0,
                                                        5,
                                                    )}{' '}
                                                    -{' '}
                                                    {meeting.end_time?.substring(
                                                        0,
                                                        5,
                                                    )}
                                                </td>
                                                <td className="max-w-50 px-4 py-5 text-slate-600 dark:text-slate-300">
                                                    <span
                                                        className="block truncate"
                                                        title={meeting.location}
                                                    >
                                                        {meeting.location}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-5 text-center font-medium text-slate-600 dark:text-slate-300">
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                                                        {meeting.participants_count ??
                                                            0}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-5 text-center">
                                                    <MeetingStatusBadge
                                                        status={meeting.status}
                                                        category={
                                                            meeting.category
                                                        }
                                                        currentStage={
                                                            meeting.current_stage
                                                        }
                                                    />
                                                </td>
                                                <td className="px-4 py-5 text-center">
                                                    <div className="flex items-center justify-center gap-2 opacity-70 transition-opacity group-hover:opacity-100">
                                                        <Link
                                                            href={`/meetings/${meeting.id}`}
                                                            className="rounded-lg p-2 text-blue-500 transition-all hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/30"
                                                            onClick={(e) => {
                                                                if (
                                                                    !guardAction(
                                                                        'meeting',
                                                                    )
                                                                ) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            className="rounded-lg p-2 text-emerald-500 transition-all hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30"
                                                            onClick={() =>
                                                                setQrMeeting(
                                                                    meeting,
                                                                )
                                                            }
                                                            title="Tampilkan QR Code"
                                                        >
                                                            <QrCode className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            className="flex items-center gap-2 rounded-lg p-2 text-rose-500 transition-all hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50 dark:hover:bg-rose-900/30"
                                                            onClick={async () => {
                                                                if (
                                                                    !guardAction(
                                                                        'meeting',
                                                                    )
                                                                ) {
                                                                    return;
                                                                }

                                                                const {
                                                                    confirmDelete,
                                                                } =
                                                                    await import('@/lib/sweetalert');

                                                                if (
                                                                    await confirmDelete(
                                                                        `Yakin ingin menghapus rapat "${meeting.title}"?`,
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        `/meetings/${meeting.id}`,
                                                                        {
                                                                            preserveScroll: true,
                                                                            preserveState: true,
                                                                            onBefore:
                                                                                () =>
                                                                                    setDeletingId(
                                                                                        meeting.id,
                                                                                    ),
                                                                            onSuccess:
                                                                                () => {
                                                                                    toast.success(
                                                                                        'Data berhasil dihapus.',
                                                                                    );
                                                                                },
                                                                            onError:
                                                                                async () => {
                                                                                    const {
                                                                                        showError,
                                                                                    } =
                                                                                        await import('@/lib/sweetalert');
                                                                                    showError(
                                                                                        'Gagal',
                                                                                        'Terjadi kesalahan saat menghapus data.',
                                                                                    );
                                                                                },
                                                                            onFinish:
                                                                                () =>
                                                                                    setDeletingId(
                                                                                        null,
                                                                                    ),
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                            title="Hapus Rapat"
                                                            disabled={
                                                                deletingId ===
                                                                meeting.id
                                                            }
                                                        >
                                                            {deletingId ===
                                                            meeting.id ? (
                                                                <>
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                    <span className="text-xs font-medium">
                                                                        Menghapus...
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ),
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-4 py-16 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                                                <Calendar className="mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
                                                <p className="font-medium">
                                                    Belum ada data rapat.
                                                </p>
                                                <p className="mt-1 text-sm">
                                                    Buat rapat baru untuk mulai.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/30 p-5 text-sm text-slate-500 md:flex-row dark:border-slate-800/50 dark:bg-slate-900/30 dark:text-slate-400">
                        <div className="font-medium">
                            Menampilkan {meetings?.from ?? 0} –{' '}
                            {meetings?.to ?? 0} dari {meetings?.total ?? 0} data
                        </div>
                        <div className="flex items-center gap-2">
                            {meetings?.links?.map((link: any, i: number) => {
                                const label = link.label
                                    .replace('&laquo; Previous', '←')
                                    .replace('Next &raquo;', '→');

                                return (
                                    <Button
                                        key={i}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="icon"
                                        className={`h-9 w-9 rounded-xl text-xs font-semibold transition-all ${
                                            link.active
                                                ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                                                : 'border-slate-200 bg-white/50 text-slate-600 hover:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800'
                                        } ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`}
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url &&
                                            router.get(link.url, filters, {
                                                preserveState: true,
                                                preserveScroll: true,
                                                only: ['meetings'],
                                            })
                                        }
                                    >
                                        {label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Dialog
                open={!!qrMeeting}
                onOpenChange={(open) => !open && setQrMeeting(null)}
            >
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
                    {qrMeeting && (
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
                                            value={`${window.location.origin}/attend/${qrMeeting?.id}`}
                                            size={250}
                                            level="H"
                                            includeMargin={false}
                                        />
                                    </Suspense>
                                )}
                            </div>
                            <div className="space-y-1 text-center">
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                    {qrMeeting.title}
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {qrMeeting.date} •{' '}
                                    {qrMeeting.start_time?.substring(0, 5)} -{' '}
                                    {qrMeeting.end_time?.substring(0, 5)}
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
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
MeetingIndex.layout = () => ({
    breadcrumbs: [
        {
            title: 'eNotulen',
            href: '/dashboard',
        },
    ],
});
