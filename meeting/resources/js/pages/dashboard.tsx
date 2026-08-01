import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { CalendarDays, CheckCircle, ClipboardCheck, PieChart, TrendingUp, Plus, Mic, FileText, Users, PenTool, Check, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    pipelines: {
        recording: any[];
        correction: any[];
        review: any[];
        approval: any[];
        finished: any[];
    };
};

export default function Dashboard({ stats, pipelines }: Props) {
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
                router.reload({ only: ['stats', 'pipelines'] });
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

    return (
        <>
            <Head title={`Dashboard Rapat`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 w-full max-w-[1600px] mx-auto overflow-hidden bg-[#fafafa] dark:bg-slate-950">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            Dashboard <span className="text-slate-300 dark:text-slate-700">—</span> {primaryRole}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Selamat datang kembali
                        </p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 h-10 shadow-sm font-medium">
                        <Link href="/meetings">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            Jadwal Rapat
                        </Link>
                    </Button>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 shrink-0">
                    <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">{stats?.meetingsThisMonth || 0}</div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Rapat bulan ini</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-500 mb-1">{stats?.minutesCompleted || 0}</div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Notulen selesai</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="text-2xl font-semibold text-orange-600 dark:text-orange-500 mb-1">{stats?.openActionItems || 0}</div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Action item terbuka</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="text-2xl font-semibold text-blue-600 dark:text-blue-500 mb-1">{stats?.avgAttendance || 0}%</div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Rata-rata kehadiran</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Pipeline Board */}
                <div className="flex overflow-x-auto gap-4 pb-4 items-start min-h-[500px] mt-2">
                    
                    {/* Column 1: Recording */}
                    <div className="flex-none w-[270px] flex flex-col gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <span className="p-1 bg-blue-50 text-blue-600 rounded-md">
                                    <Mic className="w-3.5 h-3.5" />
                                </span>
                                Menunggu Rekaman
                            </h3>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">{pipelines?.recording?.length || 0}</span>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {pipelines?.recording?.map(m => (
                                <div key={m.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-sm flex flex-col gap-2">
                                    <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-100 leading-snug">{m.title}</h4>
                                    <div className="flex items-center gap-1 text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-1 rounded-md w-fit">
                                        <CalendarDays className="w-3 h-3" /> {formatDate(m.date)} • {m.start_time}
                                    </div>
                                    <div className="mt-1 border-t border-slate-100 dark:border-slate-700 pt-2.5">
                                        {canEdit('recording') ? (
                                            <Button asChild size="sm" variant="outline" className="w-full text-[11px] h-7 rounded-md text-blue-600 border-blue-200 hover:bg-blue-50">
                                                <Link href={`/meetings/${m.id}/recording`}>Lihat Detail <Eye className="w-3 h-3 ml-1.5" /></Link>
                                            </Button>
                                        ) : (
                                            <Button asChild size="sm" variant="outline" className="w-full text-[11px] h-7 rounded-md text-slate-600 hover:bg-slate-50">
                                                <Link href={`/meetings/${m.id}`}>Lihat Detail <Eye className="w-3 h-3 ml-1.5" /></Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Correction & Attendance */}
                    <div className="flex-none w-[270px] flex flex-col gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <span className="p-1 bg-orange-50 text-orange-600 rounded-md">
                                    <PenTool className="w-3.5 h-3.5" />
                                </span>
                                Koreksi & Absen
                            </h3>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">{pipelines?.correction?.length || 0}</span>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {pipelines?.correction?.map(m => (
                                <div key={m.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-sm flex flex-col gap-2">
                                    <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-100 leading-snug">{m.title}</h4>
                                    <div className="flex items-center gap-1 text-[10px] text-orange-600 font-medium bg-orange-50 px-1.5 py-1 rounded-md w-fit">
                                        <CalendarDays className="w-3 h-3" /> {formatDate(m.date)} • {m.start_time}
                                    </div>
                                    <div className="mt-1 border-t border-slate-100 dark:border-slate-700 pt-2.5 flex gap-2">
                                        <Button asChild size="sm" variant="outline" className="flex-1 text-[10px] h-7 rounded-md text-slate-600 hover:bg-slate-50">
                                            <Link href={`/meetings/${m.id}/correction`}>Transkrip</Link>
                                        </Button>
                                        {canEdit('attendance') && (
                                            <Button asChild size="sm" variant="outline" className="flex-1 text-[10px] h-7 rounded-md text-orange-600 border-orange-200 hover:bg-orange-50">
                                                <Link href={`/meetings/${m.id}/attendance`}>Absensi</Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Review */}
                    <div className="flex-none w-[270px] flex flex-col gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <span className="p-1 bg-sky-50 text-sky-600 rounded-md">
                                    <FileText className="w-3.5 h-3.5" />
                                </span>
                                Review Notulen
                            </h3>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">{pipelines?.review?.length || 0}</span>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {pipelines?.review?.map(m => (
                                <div key={m.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-sm flex flex-col gap-2">
                                    <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-100 leading-snug">{m.title}</h4>
                                    <div className="flex items-center gap-1 text-[10px] text-sky-600 font-medium bg-sky-50 px-1.5 py-1 rounded-md w-fit">
                                        <CalendarDays className="w-3 h-3" /> {formatDate(m.date)}
                                    </div>
                                    <div className="mt-1 border-t border-slate-100 dark:border-slate-700 pt-2.5">
                                        <Button asChild size="sm" variant="outline" className="w-full text-[11px] h-7 rounded-md text-sky-600 border-sky-200 hover:bg-sky-50">
                                            <Link href={canEdit('minutes') ? `/meetings/${m.id}/review` : `/meetings/${m.id}`}>Lihat Detail <Eye className="w-3 h-3 ml-1.5" /></Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 4: Approval */}
                    <div className="flex-none w-[270px] flex flex-col gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <span className="p-1 bg-emerald-50 text-emerald-600 rounded-md">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                </span>
                                Persetujuan
                            </h3>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">{pipelines?.approval?.length || 0}</span>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {pipelines?.approval?.map(m => (
                                <div key={m.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-sm flex flex-col gap-2">
                                    <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-100 leading-snug">{m.title}</h4>
                                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-1 rounded-md w-fit">
                                        <CalendarDays className="w-3 h-3" /> {formatDate(m.date)}
                                    </div>
                                    <div className="mt-1 border-t border-slate-100 dark:border-slate-700 pt-2.5">
                                        <Button asChild size="sm" variant="outline" className="w-full text-[11px] h-7 rounded-md text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                                            <Link href={(isAdmin || hasRole('Pimpinan')) ? `/meetings/${m.id}/approval` : `/meetings/${m.id}`}>Lihat Detail <Eye className="w-3 h-3 ml-1.5" /></Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 5: Finished */}
                    <div className="flex-none w-[270px] flex flex-col gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <span className="p-1 bg-slate-100 text-slate-600 rounded-md">
                                    <Check className="w-3.5 h-3.5" />
                                </span>
                                Selesai
                            </h3>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">{pipelines?.finished?.length || 0}</span>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {pipelines?.finished?.map(m => (
                                <div key={m.id} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 rounded-xl flex flex-col gap-2">
                                    <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-100 leading-snug">{m.title}</h4>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium px-1.5 py-1 rounded-md bg-white border border-slate-100 w-fit">
                                        <CalendarDays className="w-3 h-3" /> {formatDate(m.date)}
                                    </div>
                                    <div className="mt-1 border-t border-slate-200 dark:border-slate-700 pt-2.5 flex gap-2">
                                        <Button asChild size="sm" variant="outline" className="flex-1 text-[11px] h-7 rounded-md text-slate-600 hover:bg-slate-100 bg-white">
                                            <a href={`/meetings/${m.id}/review/pdf`} target="_blank">Unduh PDF</a>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
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
