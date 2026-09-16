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
export default function Dashboard({ stats, todayMeetings, upcomingMeetings }: Props) {
    const { guardAction, hasRole, canEdit, isAdmin } = usePermissions();

    const page = usePage<any>();
    const roles: string[] = page.props.auth?.roles || [];
    const primaryRole = roles[0] || 'User';
    const isPimpinan = roles.includes('Pimpinan');

    // Real-time: listen for global meetings updates via WebSocket
    useEffect(() => {
        const channel = (window as any).Echo?.channel('meetings');

        if (channel) {
            const handleUpdate = (e: any) => {
                console.log('Dashboard real-time update:', e);
                router.reload({ only: ['stats', 'todayMeetings', 'upcomingMeetings'] });
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

        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatDateShort = (dateStr: string) => {
        if (!dateStr) {
            return '';
        }

        const d = new Date(dateStr);

        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
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
        <Users className="w-6 h-6 text-blue-500" />,
        <CalendarDays className="w-6 h-6 text-emerald-500" />,
        <FileText className="w-6 h-6 text-violet-500" />,
    ];

    return (
        <>
            <Head title={`eNotulen`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 w-full max-w-300 mx-auto bg-background dark:bg-slate-950">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            Dashboard <span className="text-slate-300 dark:text-slate-700">—</span> {page.props.auth?.user?.name || primaryRole}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            {primaryRole} · {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Selamat datang kembali
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                        <Link
                            href="/meetings"
                            className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-full px-5 h-10 text-sm font-semibold shadow-sm transition-colors"
                        >
                            <CalendarDays className="h-4 w-4" />
                            Jadwal Rapat
                        </Link>
                        {canEdit('meeting') && (
                            <Link
                                href="/meetings/create"
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 h-10 text-sm font-semibold shadow-sm transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                Buat Rapat
                            </Link>
                        )}
                    </div>
                </div>

                {/* 4 Stat Cards — single horizontal row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="rounded-lg border-slate-200 shadow-sm bg-white dark:bg-slate-900 hover:-translate-y-px hover:border-slate-300 transition-all duration-200">
                        <CardContent className="p-4 sm:p-5 flex flex-col items-start justify-center">
                            <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 sm:mb-2">Rapat bulan ini</div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-none">{stats?.meetingsThisMonth || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg border-slate-200 shadow-sm bg-white dark:bg-slate-900 hover:-translate-y-px hover:border-slate-300 transition-all duration-200">
                        <CardContent className="p-4 sm:p-5 flex flex-col items-start justify-center">
                            <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 sm:mb-2">Notulen selesai</div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-none">{stats?.minutesCompleted || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg border-slate-200 shadow-sm bg-white dark:bg-slate-900 hover:-translate-y-px hover:border-slate-300 transition-all duration-200">
                        <CardContent className="p-4 sm:p-5 flex flex-col items-start justify-center">
                            <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 sm:mb-2">Action item terbuka</div>
                            <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-500 leading-none">{stats?.openActionItems || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg border-slate-200 shadow-sm bg-white dark:bg-slate-900 hover:-translate-y-px hover:border-slate-300 transition-all duration-200">
                        <CardContent className="p-4 sm:p-5 flex flex-col items-start justify-center">
                            <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 sm:mb-2">Rata-rata kehadiran</div>
                            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-500 leading-none">{stats?.avgAttendance || 0}%</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Rapat Hari Ini */}
                {todayMeetings && todayMeetings.length > 0 && (
                    <div className="mb-2">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Rapat Hari Ini (Terjadwal)</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {todayMeetings.map((m, idx) => (
                                <Link key={m.id} href={getMeetingUrl(m)}>
                                    <Card className="rounded-xl border-slate-200 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer h-full">
                                        <CardContent className="p-5 flex flex-col gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-500`}>
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-start gap-2 mb-1.5">
                                                    <h4 className="font-semibold text-[15px] text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors leading-snug">
                                                        {m.title}
                                                    </h4>
                                                    {m.status === 'dibatalkan' && (
                                                        <span className="inline-flex shrink-0 items-center px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border-slate-200">
                                                            Rapat Dibatalkan
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[13px] text-slate-500">
                                                    Hari ini · {m.start_time ? m.start_time.substring(0, 5) : ''} · {m.participants_count || 0} peserta
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Jadwal mendatang */}
                {upcomingMeetings && upcomingMeetings.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Jadwal mendatang</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {upcomingMeetings.map((m, idx) => (
                                <Link key={m.id} href={getMeetingUrl(m)}>
                                    <Card className="rounded-xl border-slate-200 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer h-full">
                                        <CardContent className="p-5 flex flex-col gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${idx === 0 ? 'bg-blue-50 text-blue-500' : idx === 1 ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                                                {idx === 0 ? <Users className="w-5 h-5" /> : idx === 1 ? <Clock className="w-5 h-5" /> : <CalendarDays className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-start gap-2 mb-1.5">
                                                    <h4 className="font-semibold text-[15px] text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors leading-snug">
                                                        {m.title}
                                                    </h4>
                                                    {m.status === 'dibatalkan' && (
                                                        <span className="inline-flex shrink-0 items-center px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border-slate-200">
                                                            Rapat Dibatalkan
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[13px] text-slate-500">
                                                    {formatDateShort(m.date)} · {m.start_time ? m.start_time.substring(0, 5) : ''} · {m.participants_count || 0} peserta
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
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
