import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarDays, FileText, Users, Clock, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
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
    actionItems?: any[];
};
/**
 * [EDUKASI ARSITEKTUR: INERTIA PROPS]
 * Perhatikan fungsi `Dashboard` menerima `{ stats, latestMeetings, upcomingMeetings }`.
 * Data ini datang langsung dari Backend (Controller) tanpa perlu Fetch API, Axios, atau Loading State!
 * Inertia.js yang menjahitnya di belakang layar. Ini menghemat ratusan baris kode.
 */
export default function Dashboard({ stats, latestMeetings, upcomingMeetings, actionItems = [] }: Props) {
    const { guardAction, hasRole, canEdit, isAdmin } = usePermissions();

    const page = usePage<any>();
    const roles: string[] = page.props.auth?.roles || [];
    const primaryRole = roles[0] || 'User';
    const isPimpinan = roles.includes('Pimpinan');

    // Real-time: listen for global meetings updates via WebSocket
    useEffect(() => {
        const channel = (window as any).Echo?.channel('meetings');
        
        if (channel) {
            channel.listen('MeetingsListUpdated', (e: any) => {
                console.log('Dashboard real-time update:', e);
                router.reload({ only: ['stats', 'latestMeetings', 'upcomingMeetings', 'actionItems'] });
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

    // Status helpers
    const getStatusInfo = (stage: number, meetingDate?: string) => {
        const today = new Date().toISOString().slice(0, 10);
        const isPast = meetingDate ? meetingDate < today : false;

        if (stage <= 2) {
            if (isPast) {
                return { text: 'Belum Diproses', badgeClass: 'text-slate-600 bg-slate-50 border-slate-200', isLive: false };
            }

            return { text: 'Live', badgeClass: 'text-red-600 bg-red-50 border-red-200', isLive: true };
        }

        if (stage <= 4) {
return { text: 'Review', badgeClass: 'text-orange-600 bg-orange-50 border-orange-200', isLive: false };
}

        if (stage === 5) {
return { text: 'Review', badgeClass: 'text-amber-600 bg-amber-50 border-amber-200', isLive: false };
}

        if (stage === 6) {
return { text: 'Persetujuan', badgeClass: 'text-sky-600 bg-sky-50 border-sky-200', isLive: false };
}

        return { text: 'Selesai', badgeClass: 'text-emerald-600 bg-emerald-50 border-emerald-200', isLive: false };
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
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 w-full max-w-[1200px] mx-auto bg-background dark:bg-slate-950">
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
                    <Card className="rounded-lg border-slate-200 shadow-sm bg-white dark:bg-slate-900 hover:-translate-y-[1px] hover:border-slate-300 transition-all duration-200">
                        <CardContent className="p-4 sm:p-5 flex flex-col items-start justify-center">
                            <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 sm:mb-2">Rapat bulan ini</div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-none">{stats?.meetingsThisMonth || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg border-slate-200 shadow-sm bg-white dark:bg-slate-900 hover:-translate-y-[1px] hover:border-slate-300 transition-all duration-200">
                        <CardContent className="p-4 sm:p-5 flex flex-col items-start justify-center">
                            <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 sm:mb-2">Notulen selesai</div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-none">{stats?.minutesCompleted || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg border-slate-200 shadow-sm bg-white dark:bg-slate-900 hover:-translate-y-[1px] hover:border-slate-300 transition-all duration-200">
                        <CardContent className="p-4 sm:p-5 flex flex-col items-start justify-center">
                            <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 sm:mb-2">Action item terbuka</div>
                            <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-500 leading-none">{stats?.openActionItems || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg border-slate-200 shadow-sm bg-white dark:bg-slate-900 hover:-translate-y-[1px] hover:border-slate-300 transition-all duration-200">
                        <CardContent className="p-4 sm:p-5 flex flex-col items-start justify-center">
                            <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 sm:mb-2">Rata-rata kehadiran</div>
                            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-500 leading-none">{stats?.avgAttendance || 0}%</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Rapat terbaru */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col shadow-sm">
                    <div className="p-4 sm:px-5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Rapat terbaru</h2>
                        <Link href="/meetings" className="text-sm font-medium text-blue-600 hover:underline">Lihat semua</Link>
                    </div>
                    <div className="flex-1 divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto max-h-[400px]">
                        {latestMeetings && latestMeetings.length > 0 ? (
                            latestMeetings.map((m, idx) => {
                                const status = getStatusInfo(m.current_stage, m.date);
                                const today = new Date().toISOString().slice(0, 10);
                                const isToday = m.date === today;

                                return (
                                    <Link
                                        key={m.id}
                                        href={getMeetingUrl(m)}
                                        className="p-4 sm:p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group flex justify-between items-start"
                                    >
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h3 className="text-[15px] sm:text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors mb-2 truncate">
                                                {m.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-500 dark:text-slate-400 font-mono tracking-tight">
                                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    {isToday ? 'Hari ini' : formatDateShort(m.date)}, {m.start_time ? m.start_time.substring(0,5) : ''}
                                                </span>
                                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                                    {m.participants_count || 0} Peserta
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="shrink-0 pt-1">
                                            {status.isLive ? (
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${status.badgeClass}`}>
                                                    <span className="relative flex h-1.5 w-1.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600"></span>
                                                    </span>
                                                    {status.text}
                                                </span>
                                            ) : (
                                                <span className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full border text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${status.badgeClass}`}>
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
                </div>

                    {/* Action items mendesak */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col shadow-sm">
                        <div className="p-4 sm:px-5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Action items mendesak</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[400px] p-4 flex flex-col gap-3">
                            {actionItems && actionItems.length > 0 ? (
                                actionItems.map((item: any, idx: number) => {
                                    const bgColors = ['bg-red-50/50 dark:bg-red-900/20 border-red-100/50 dark:border-red-900/50', 'bg-amber-50/50 dark:bg-amber-900/20 border-amber-100/50 dark:border-amber-900/50', 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-100/50 dark:border-slate-800/50'];
                                    const dotColors = ['bg-red-500', 'bg-amber-500', 'bg-slate-400'];
                                    const dateColors = ['text-red-600 dark:text-red-400', 'text-amber-600 dark:text-amber-400', 'text-slate-500 dark:text-slate-400'];
                                    
                                    const colorIdx = idx < 3 ? idx : 2;

                                    return (
                                        <Link 
                                            href={`/meetings/${item.meeting_id}`} 
                                            key={item.id} 
                                            className={`rounded-xl border p-4 flex items-start gap-3 transition-transform hover:scale-[1.01] hover:shadow-sm cursor-pointer ${bgColors[colorIdx]}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${dotColors[colorIdx]}`}></div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-4">
                                                    <h3 className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                                                        {item.description}
                                                    </h3>
                                                    <span className={`text-[12px] whitespace-nowrap shrink-0 ${dateColors[colorIdx]}`}>
                                                        {item.deadline ? formatDateShort(item.deadline) : 'Tidak ada'}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-slate-400 text-sm">Tidak ada action items mendesak.</div>
                            )}
                        </div>
                    </div>
                </div>

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
                                                <h4 className="font-semibold text-[15px] text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors leading-snug mb-1.5">
                                                    {m.title}
                                                </h4>
                                                <p className="text-[13px] text-slate-500">
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
