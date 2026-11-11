import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarDays, FileText, Users, Clock } from 'lucide-react';
import { useEffect } from 'react';
import { MeetingStatusBadge } from '@/components/meetings/MeetingStatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { usePermissions } from '@/hooks/use-permissions';
import { dashboard } from '@/routes';

type Props = {
    stats: {
        meetingsThisMonth: number;
        meetingsDelta: number;
        minutesCompleted: number;
        minutesDelta: number;
        openActionItems: number;
        avgAttendance: number;
    };
    todayMeetings: any[];
    upcomingMeetings: any[];
};
/**
 * [EDUKASI ARSITEKTUR: INERTIA PROPS]
 * Perhatikan fungsi `Dashboard` menerima `{ stats, todayMeetings, upcomingMeetings }`.
 * Data ini datang langsung dari Backend (Controller) tanpa perlu Fetch API, Axios, atau Loading State!
 * Inertia.js yang menjahitnya di belakang layar. Ini menghemat ratusan baris kode.
 */
export default function Dashboard({
    stats,
    todayMeetings,
    upcomingMeetings,
}: Props) {
    const { guardAction, hasRole, canEdit, isAdmin } = usePermissions();

    const page = usePage<any>();
    const roles: string[] = page.props.auth?.roles || [];
    const primaryRole = roles[0] || 'User';
    const isPimpinan = roles.includes('Pimpinan');

    // Real-time: listen for global meetings updates via WebSocket
    useEffect(() => {
        const channel = (window as any).Echo?.private('meetings');

        if (channel) {
            const handleUpdate = () => {
                router.reload({
                    only: ['stats', 'todayMeetings', 'upcomingMeetings'],
                });
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

    // Helper to format date
    const formatDate = (dateStr: string) => {
        if (!dateStr) {
            return '';
        }

        const d = new Date(dateStr);

        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatDateShort = (dateStr: string) => {
        if (!dateStr) {
            return '';
        }

        const d = new Date(dateStr);

        return d.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    };

    // Smart Routing for meetings
    const getMeetingUrl = (m: any) => {
        // Jika rapat sudah selesai (stage >= 7), arahkan semua viewer ke halaman hasil rapat (approval)
        if (m.current_stage >= 7) {
            return `/meetings/${m.id}/approval`;
        }

        // Jika Pimpinan dan rapat sudah masuk tahap review/persetujuan (stage >= 5)
        // Langsung arahkan ke halaman persetujuan agar tidak perlu lewat meeting hub
        if (isPimpinan && m.current_stage >= 5) {
            return `/meetings/${m.id}/approval`;
        }

        return `/meetings/${m.id}`;
    };

    // Removed getStatusInfo because we now use MeetingStatusBadge

    // Upcoming meeting icons (rotating)
    const upcomingIcons = [
        <Users className="h-6 w-6 text-blue-500" />,
        <CalendarDays className="h-6 w-6 text-emerald-500" />,
        <FileText className="h-6 w-6 text-violet-500" />,
    ];

    return (
        <>
            <Head title={`eNotulen`} />

            <div className="mx-auto flex h-full w-full max-w-300 flex-1 flex-col gap-6 bg-background p-6 lg:p-8 dark:bg-slate-950">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                        <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            Dashboard{' '}
                            <span className="text-slate-300 dark:text-slate-700">
                                —
                            </span>{' '}
                            {page.props.auth?.user?.name || primaryRole}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {primaryRole} ·{' '}
                            {new Date().toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}{' '}
                            · Selamat datang kembali
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                        <Link
                            href="/meetings"
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <CalendarDays className="h-4 w-4" />
                            Jadwal Rapat
                        </Link>
                        {canEdit('meeting') && (
                            <Link
                                href="/meetings/create"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
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
                            </Link>
                        )}
                    </div>
                </div>

                {/* 4 Stat Cards — single horizontal row */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <Card className="rounded-lg border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:border-slate-300 dark:bg-slate-900">
                        <CardContent className="flex flex-col items-start justify-center p-4 sm:p-5">
                            <div className="mb-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase sm:mb-2 sm:text-xs">
                                Rapat bulan ini
                            </div>
                            <div className="text-2xl leading-none font-bold text-slate-900 sm:text-3xl dark:text-white">
                                {stats?.meetingsThisMonth || 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:border-slate-300 dark:bg-slate-900">
                        <CardContent className="flex flex-col items-start justify-center p-4 sm:p-5">
                            <div className="mb-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase sm:mb-2 sm:text-xs">
                                Notulen selesai
                            </div>
                            <div className="text-2xl leading-none font-bold text-slate-900 sm:text-3xl dark:text-white">
                                {stats?.minutesCompleted || 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:border-slate-300 dark:bg-slate-900">
                        <CardContent className="flex flex-col items-start justify-center p-4 sm:p-5">
                            <div className="mb-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase sm:mb-2 sm:text-xs">
                                Notulen dalam proses
                            </div>
                            <div className="text-2xl leading-none font-bold text-amber-600 sm:text-3xl dark:text-amber-500">
                                {stats?.openActionItems || 0}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:border-slate-300 dark:bg-slate-900">
                        <CardContent className="flex flex-col items-start justify-center p-4 sm:p-5">
                            <div className="mb-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase sm:mb-2 sm:text-xs">
                                Rata-rata kehadiran
                            </div>
                            <div className="text-2xl leading-none font-bold text-emerald-600 sm:text-3xl dark:text-emerald-500">
                                {stats?.avgAttendance || 0}%
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Two-column: Rapat Hari Ini & Tertunda + Jadwal Mendatang */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Kolom Kiri: Rapat Hari Ini & Tertunda */}
                    <Card className="rounded-lg border-slate-200 bg-white shadow-sm dark:bg-slate-900">
                        <CardContent className="p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                    Rapat Hari Ini & Terbaru
                                </h2>
                                <Link
                                    href="/meetings"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Lihat semua
                                </Link>
                            </div>
                            {todayMeetings && todayMeetings.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {todayMeetings.map((m) => (
                                        <Link
                                            key={m.id}
                                            href={getMeetingUrl(m)}
                                            className="group block py-3 first:pt-0 last:pb-0"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100">
                                                        {m.title}
                                                    </h4>
                                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDateShort(
                                                            m.date,
                                                        )}
                                                        ,{' '}
                                                        {m.start_time
                                                            ? m.start_time.substring(
                                                                  0,
                                                                  5,
                                                              )
                                                            : ''}
                                                        <span className="mx-1">
                                                            ·
                                                        </span>
                                                        <Users className="h-3 w-3" />
                                                        {m.participants_count ||
                                                            0}{' '}
                                                        Peserta
                                                    </p>
                                                </div>
                                                <MeetingStatusBadge
                                                    status={m.status}
                                                    currentStage={
                                                        m.current_stage
                                                    }
                                                />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">
                                    Tidak ada rapat hari ini.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Kolom Kanan: Jadwal Mendatang */}
                    <Card className="rounded-lg border-slate-200 bg-white shadow-sm dark:bg-slate-900">
                        <CardContent className="p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                    Jadwal Mendatang
                                </h2>
                                <Link
                                    href="/meetings"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Lihat semua
                                </Link>
                            </div>
                            {upcomingMeetings && upcomingMeetings.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {upcomingMeetings.map((m) => (
                                        <Link
                                            key={m.id}
                                            href={getMeetingUrl(m)}
                                            className="group block py-3 first:pt-0 last:pb-0"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100">
                                                        {m.title}
                                                    </h4>
                                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDateShort(
                                                            m.date,
                                                        )}
                                                        ,{' '}
                                                        {m.start_time
                                                            ? m.start_time.substring(
                                                                  0,
                                                                  5,
                                                              )
                                                            : ''}
                                                        <span className="mx-1">
                                                            ·
                                                        </span>
                                                        <Users className="h-3 w-3" />
                                                        {m.participants_count ||
                                                            0}{' '}
                                                        Peserta
                                                    </p>
                                                </div>
                                                <MeetingStatusBadge
                                                    status={m.status}
                                                    currentStage={
                                                        m.current_stage
                                                    }
                                                    category={
                                                        new Date(
                                                            m.date,
                                                        ).toDateString() !==
                                                        new Date().toDateString()
                                                            ? 'jadwal_mendatang'
                                                            : undefined
                                                    }
                                                />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">
                                    Tidak ada jadwal mendatang.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'eNotulen',
            href: dashboard().url,
        },
    ],
});
