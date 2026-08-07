import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { CalendarDays, CheckCircle, Mic, FileText, Users, PenTool, Check, Clock } from 'lucide-react';
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
    latestMeetings: any[];
    upcomingMeetings: any[];
};

export default function Dashboard({ stats, latestMeetings, upcomingMeetings }: Props) {
    const { guardAction, hasRole, canEdit, isAdmin } = usePermissions();

    const page = usePage<any>();
    const roles: string[] = page.props.auth?.roles || [];
    const primaryRole = roles[0] || 'User';

    // Real-time: listen for global meetings updates via WebSocket
    useEffect(() => {
        const channel = (window as any).Echo?.channel('meetings');
        
        if (channel) {
            channel.listen('MeetingsListUpdated', (e: any) => {
                console.log('Dashboard real-time update:', e);
                router.reload({ only: ['stats', 'latestMeetings', 'upcomingMeetings'] });
            });
        }

        return () => {
            if (channel) {
                channel.stopListening('MeetingsListUpdated');
                (window as any).Echo?.leaveChannel('meetings');
            }
        };
    }, []);

    // Helper to format date
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatDateShort = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    // Status helpers
    const getStatusInfo = (stage: number, meetingDate?: string) => {
        const today = new Date().toISOString().slice(0, 10);
        const isPast = meetingDate ? meetingDate < today : false;

        if (stage <= 2) {
            if (isPast) {
                return { icon: <Clock className="w-5 h-5" />, iconColor: 'text-slate-400', iconBg: 'bg-slate-100', text: 'Belum Diproses', badgeColor: 'text-slate-400', dotColor: 'bg-slate-300', isLive: false };
            }
            return { icon: <Mic className="w-5 h-5" />, iconColor: 'text-red-600', iconBg: 'bg-red-50', text: 'Live', badgeColor: 'text-red-600', dotColor: 'bg-red-500', isLive: true };
        }
        if (stage <= 4) return { icon: <PenTool className="w-5 h-5" />, iconColor: 'text-orange-600', iconBg: 'bg-orange-50', text: 'Koreksi', badgeColor: 'text-orange-600', dotColor: 'bg-orange-500', isLive: false };
        if (stage === 5) return { icon: <FileText className="w-5 h-5" />, iconColor: 'text-sky-600', iconBg: 'bg-sky-50', text: 'Review', badgeColor: 'text-sky-600', dotColor: 'bg-sky-500', isLive: false };
        if (stage === 6) return { icon: <CheckCircle className="w-5 h-5" />, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50', text: 'Persetujuan', badgeColor: 'text-emerald-600', dotColor: 'bg-emerald-500', isLive: false };
        return { icon: <Check className="w-5 h-5" />, iconColor: 'text-slate-500', iconBg: 'bg-slate-100', text: 'Selesai', badgeColor: 'text-slate-500', dotColor: 'bg-slate-400', isLive: false };
    };

    // Upcoming meeting icons (rotating)
    const upcomingIcons = [
        <Users className="w-6 h-6 text-blue-500" />,
        <CalendarDays className="w-6 h-6 text-emerald-500" />,
        <FileText className="w-6 h-6 text-violet-500" />,
    ];

    return (
        <>
            <Head title={`Dashboard Rapat`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 w-full max-w-[1200px] mx-auto bg-[#fafafa] dark:bg-slate-950">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            Dashboard <span className="text-slate-300 dark:text-slate-700">—</span> {primaryRole}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Selamat datang kembali
                        </p>
                    </div>
                    <Link
                        href="/meetings"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 h-10 text-sm font-semibold shadow-sm transition-colors shrink-0"
                    >
                        <CalendarDays className="h-4 w-4" />
                        Jadwal Rapat
                    </Link>
                </div>

                {/* 4 Stat Cards — single horizontal row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{stats?.meetingsThisMonth || 0}</div>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Rapat bulan ini</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats?.minutesCompleted || 0}</div>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Notulen selesai</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-orange-500">{stats?.openActionItems || 0}</div>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Action item terbuka</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats?.avgAttendance || 0}%</div>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Rata-rata kehadiran</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Rapat terbaru */}
                <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between px-5 pt-5 pb-3">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Rapat terbaru</h2>
                        {latestMeetings?.some(m => { const today = new Date().toISOString().slice(0, 10); return m.current_stage <= 2 && m.date >= today; }) && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                Live
                            </span>
                        )}
                    </div>
                    <CardContent className="p-0 pb-2">
                        <div className="flex flex-col">
                            {latestMeetings && latestMeetings.length > 0 ? (
                                latestMeetings.map((m, idx) => {
                                    const status = getStatusInfo(m.current_stage, m.date);
                                    const today = new Date().toISOString().slice(0, 10);
                                    const isToday = m.date === today;

                                    return (
                                        <Link
                                            key={m.id}
                                            href={`/meetings/${m.id}`}
                                            className="group flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            {/* Icon */}
                                            <div className={`p-2.5 rounded-xl ${status.iconBg} ${status.iconColor} shrink-0`}>
                                                {status.icon}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors truncate">
                                                    {m.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-0.5 truncate">
                                                    {isToday ? 'Hari ini' : formatDate(m.date)} · {m.start_time ? m.start_time.substring(0,5) : ''}–{m.end_time ? m.end_time.substring(0,5) : ''} · {m.participants_count || 0} peserta
                                                </p>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="shrink-0">
                                                {status.isLive ? (
                                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                                                        <span className="relative flex h-1.5 w-1.5">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                                        </span>
                                                        Live
                                                    </span>
                                                ) : (
                                                    <span className={`text-xs font-semibold ${status.badgeColor}`}>
                                                        {status.text}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-slate-400 text-sm">Belum ada rapat terbaru.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Jadwal mendatang */}
                {upcomingMeetings && upcomingMeetings.length > 0 && (
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Jadwal mendatang</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {upcomingMeetings.map((m, idx) => (
                                <Link key={m.id} href={`/meetings/${m.id}`}>
                                    <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white dark:bg-slate-900 hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer h-full">
                                        <CardContent className="p-5 flex flex-col gap-3">
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${idx === 0 ? 'bg-blue-50' : idx === 1 ? 'bg-emerald-50' : 'bg-violet-50'}`}>
                                                {upcomingIcons[idx % 3]}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors leading-snug">
                                                    {m.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1.5">
                                                    {formatDateShort(m.date)} · {m.start_time ? m.start_time.substring(0,5) : ''} · {m.participants_count || 0} peserta
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
            title: 'Dashboard Rapat',
            href: dashboard().url,
        },
    ],
});
