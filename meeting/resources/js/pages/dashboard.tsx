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
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-8 w-full max-w-[1600px] mx-auto overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section with subtle gradient text */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                            Dashboard E-Notulen
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
                            Pantau status dan tindak lanjuti seluruh jadwal rapat Anda di satu tempat.
                        </p>
                    </div>
                    <Button asChild className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-xl px-6 h-11">
                        <Link href="/meetings">
                            <CalendarDays className="mr-2 h-5 w-5" />
                            <span className="font-semibold">Kelola Rapat</span>
                        </Link>
                    </Button>
                </div>

                {/* Premium Stats Row */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 shrink-0">
                    {/* Stat 1 */}
                    <Card className="p-0 rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-soft-hover transition-all duration-300 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                                    <CalendarDays className="size-7" />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats?.meetingsThisMonth || 0}</div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Rapat bulan ini</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stat 2 */}
                    <Card className="p-0 rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-soft-hover transition-all duration-300 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                                    <CheckCircle className="size-7" />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats?.minutesCompleted || 0}</div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Notulen selesai</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stat 3 */}
                    <Card className="p-0 rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-soft-hover transition-all duration-300 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                                    <ClipboardCheck className="size-7" />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats?.openActionItems || 0}</div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Tindak lanjut aktif</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stat 4 */}
                    <Card className="p-0 rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-soft-hover transition-all duration-300 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                                    <PieChart className="size-7" />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats?.avgAttendance || 0}%</div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Rata-rata kehadiran</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pipeline Board (Kanban) - Modern Glass Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6 pb-6 items-start min-h-[500px]">
                    
                    {/* Column 1: Recording */}
                    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900/50 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 h-full backdrop-blur-sm shadow-sm">
                        <div className="flex items-center justify-between px-2 mb-1">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <span className="p-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                                    <Mic className="w-4 h-4" />
                                </span>
                                Menunggu Rekaman
                            </h3>
                            <span className="bg-white dark:bg-slate-700 shadow-sm text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full">{pipelines.recording.length}</span>
                        </div>
                        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                            {pipelines.recording.map(m => (
                                <Card key={m.id} className="p-0 gap-0 border border-blue-100 dark:border-blue-900/50 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
                                    <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                                    <CardContent className="p-4 flex flex-col gap-3">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{m.title}</h4>
                                        <div className="flex items-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1.5 rounded-md border border-blue-100/50 dark:border-blue-800/50">
                                            <CalendarDays className="w-3.5 h-3.5 opacity-70" />
                                            {formatDate(m.date)} • {m.start_time}
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                                            {canEdit('recording') ? (
                                                <Button asChild size="sm" className="w-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-xl transition-colors shadow-none group-hover:bg-blue-600 group-hover:text-white">
                                                    <Link href={`/meetings/${m.id}/recording`}>
                                                        Mulai Rekam <ArrowRight className="w-3 h-3 ml-2" />
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <Button asChild size="sm" variant="secondary" className="w-full rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">
                                                    <Link href={`/meetings/${m.id}`}>
                                                        Lihat Detail <Eye className="w-3 h-3 ml-2" />
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Correction & Attendance */}
                    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900/50 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 h-full backdrop-blur-sm shadow-sm">
                        <div className="flex items-center justify-between px-2 mb-1">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <span className="p-1.5 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-lg">
                                    <PenTool className="w-4 h-4" />
                                </span>
                                Koreksi & Absen
                            </h3>
                            <span className="bg-white dark:bg-slate-700 shadow-sm text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full">{pipelines.correction.length}</span>
                        </div>
                        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                            {pipelines.correction.map(m => (
                                <Card key={m.id} className="p-0 gap-0 border border-orange-100 dark:border-orange-900/50 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
                                    <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-amber-400"></div>
                                    <CardContent className="p-4 flex flex-col gap-3">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{m.title}</h4>
                                        <div className="flex items-center gap-2 text-xs font-medium text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/30 px-2.5 py-1.5 rounded-md border border-orange-100/50 dark:border-orange-800/50">
                                            <CalendarDays className="w-3.5 h-3.5 opacity-70" />
                                            {formatDate(m.date)} • {m.start_time}
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                                            {canEdit('transcript') ? (
                                                <Button asChild size="sm" variant="outline" className="flex-1 text-xs border-orange-200 dark:border-orange-900/50 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-xl">
                                                    <Link href={`/meetings/${m.id}/correction`}>
                                                        Koreksi
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <Button asChild size="sm" variant="secondary" className="flex-1 text-xs rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">
                                                    <Link href={`/meetings/${m.id}/correction`}>
                                                        Lihat Transkrip
                                                    </Link>
                                                </Button>
                                            )}
                                            {canEdit('attendance') && (
                                                <Button asChild size="sm" variant="outline" className="flex-1 text-xs border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-xl">
                                                    <Link href={`/meetings/${m.id}/attendance`}>
                                                        Absensi
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Review */}
                    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900/50 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 h-full backdrop-blur-sm shadow-sm">
                        <div className="flex items-center justify-between px-2 mb-1">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <span className="p-1.5 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg">
                                    <FileText className="w-4 h-4" />
                                </span>
                                Review Notulen
                            </h3>
                            <span className="bg-white dark:bg-slate-700 shadow-sm text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full">{pipelines.review.length}</span>
                        </div>
                        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                            {pipelines.review.map(m => (
                                <Card key={m.id} className="p-0 gap-0 border border-purple-100 dark:border-purple-900/50 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
                                    <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                    <CardContent className="p-4 flex flex-col gap-3">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{m.title}</h4>
                                        <div className="flex items-center gap-2 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2.5 py-1.5 rounded-md border border-purple-100/50 dark:border-purple-800/50">
                                            <CalendarDays className="w-3.5 h-3.5 opacity-70" />
                                            {formatDate(m.date)}
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                                            {canEdit('minutes') ? (
                                                <Button asChild size="sm" className="w-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white rounded-xl transition-colors shadow-none group-hover:bg-purple-600 group-hover:text-white">
                                                    <Link href={`/meetings/${m.id}/review`}>
                                                        Review (AI) <ArrowRight className="w-3 h-3 ml-2" />
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <Button asChild size="sm" variant="secondary" className="w-full rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">
                                                    <Link href={`/meetings/${m.id}`}>
                                                        Lihat Detail <Eye className="w-3 h-3 ml-2" />
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Column 4: Approval */}
                    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900/50 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 h-full backdrop-blur-sm shadow-sm">
                        <div className="flex items-center justify-between px-2 mb-1">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <span className="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                    <CheckCircle className="w-4 h-4" />
                                </span>
                                Persetujuan
                            </h3>
                            <span className="bg-white dark:bg-slate-700 shadow-sm text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full">{pipelines.approval.length}</span>
                        </div>
                        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                            {pipelines.approval.map(m => (
                                <Card key={m.id} className="p-0 gap-0 border border-emerald-100 dark:border-emerald-900/50 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
                                    <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                                    <CardContent className="p-4 flex flex-col gap-3">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{m.title}</h4>
                                        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1.5 rounded-md border border-emerald-100/50 dark:border-emerald-800/50">
                                            <CalendarDays className="w-3.5 h-3.5 opacity-70" />
                                            {formatDate(m.date)}
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                                            {(isAdmin || hasRole('Pimpinan')) ? (
                                                <Button asChild size="sm" className="w-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white rounded-xl transition-colors shadow-none group-hover:bg-emerald-600 group-hover:text-white">
                                                    <Link href={`/meetings/${m.id}/approval`}>
                                                        Tinjau & Setujui <ArrowRight className="w-3 h-3 ml-2" />
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <Button asChild size="sm" variant="secondary" className="w-full rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">
                                                    <Link href={`/meetings/${m.id}`}>
                                                        Lihat Detail <Eye className="w-3 h-3 ml-2" />
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Column 5: Finished */}
                    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900/50 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 h-full backdrop-blur-sm opacity-80 hover:opacity-100 transition-opacity shadow-sm">
                        <div className="flex items-center justify-between px-2 mb-1">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <span className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
                                    <Check className="w-4 h-4" />
                                </span>
                                Selesai
                            </h3>
                            <span className="bg-white/80 dark:bg-slate-700 shadow-sm text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full">{pipelines.finished.length}</span>
                        </div>
                        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                            {pipelines.finished.map(m => (
                                <Card key={m.id} className="p-0 gap-0 border border-slate-200/80 dark:border-slate-700/50 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
                                    <div className="h-1.5 w-full bg-gradient-to-r from-slate-400 to-gray-500"></div>
                                    <CardContent className="p-4 flex flex-col gap-3">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{m.title}</h4>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1.5 rounded-md border border-slate-100 dark:border-slate-800/50">
                                            <CalendarDays className="w-3.5 h-3.5 opacity-70" />
                                            {formatDate(m.date)}
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                                            <Button asChild size="sm" variant="outline" className="w-full text-sm font-medium hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-100 rounded-xl border-slate-200 dark:border-slate-600 transition-colors">
                                                <a href={`/meetings/${m.id}/review/pdf`} target="_blank">Unduh PDF</a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
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
