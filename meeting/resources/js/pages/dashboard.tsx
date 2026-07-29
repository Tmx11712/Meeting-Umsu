import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, CheckCircle, ClipboardCheck, PieChart, TrendingUp, Plus, Mic, FileText, Users, PenTool, Check, ArrowRight } from 'lucide-react';
import { dashboard } from '@/routes';
import { usePermissions } from '@/hooks/use-permissions';

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
    const { guardAction, hasRole } = usePermissions();

    // Helper to format date
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
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
                    <Button asChild className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-xl px-6 py-5">
                        <Link href="/meetings">
                            <CalendarDays className="mr-2 h-5 w-5" />
                            <span className="font-semibold">Kelola Rapat</span>
                        </Link>
                    </Button>
                </div>

                {/* Premium Stats Row */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 shrink-0">
                    {/* Stat 1 */}
                    <Card className="rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-soft-hover transition-all duration-300 group overflow-hidden relative">
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
                    <Card className="rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-soft-hover transition-all duration-300 group overflow-hidden relative">
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
                    <Card className="rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-soft-hover transition-all duration-300 group overflow-hidden relative">
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
                    <Card className="rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-soft-hover transition-all duration-300 group overflow-hidden relative">
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
                <div className="flex-1 flex gap-6 overflow-x-auto pb-6 items-start min-h-[500px] snap-x">
                    
                    {/* Column 1: Recording */}
                    <div className="flex flex-col gap-4 min-w-[320px] w-[320px] bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-[2rem] border border-white/60 dark:border-slate-700/50 h-full backdrop-blur-sm snap-center">
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
                                <Card key={m.id} className="border-0 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
                                    <div className="h-1 w-full bg-blue-500"></div>
                                    <CardContent className="p-5 flex flex-col gap-3">
                                        <h4 className="font-bold text-slate-900 dark:text-white leading-snug">{m.title}</h4>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                                            <CalendarDays className="w-3.5 h-3.5" />
                                            {formatDate(m.date)} • {m.start_time}
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                                            <Button asChild size="sm" className="w-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-xl transition-colors shadow-none group-hover:bg-blue-600 group-hover:text-white">
                                                <Link href={`/meetings/${m.id}/recording`}>
                                                    Mulai Rekam <ArrowRight className="w-3 h-3 ml-2" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Correction & Attendance */}
                    <div className="flex flex-col gap-4 min-w-[320px] w-[320px] bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-[2rem] border border-white/60 dark:border-slate-700/50 h-full backdrop-blur-sm snap-center">
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
                                <Card key={m.id} className="border-0 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden">
                                    <div className="h-1 w-full bg-orange-500"></div>
                                    <CardContent className="p-5 flex flex-col gap-3">
                                        <h4 className="font-bold text-slate-900 dark:text-white leading-snug">{m.title}</h4>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                                            <CalendarDays className="w-3.5 h-3.5" />
                                            {formatDate(m.date)} • {m.start_time}
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                                            <Button asChild size="sm" variant="outline" className="flex-1 text-xs border-orange-200 dark:border-orange-900/50 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-xl">
                                                <Link href={`/meetings/${m.id}/correction`}>
                                                    Koreksi
                                                </Link>
                                            </Button>
                                            <Button asChild size="sm" variant="outline" className="flex-1 text-xs border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-xl">
                                                <Link href={`/meetings/${m.id}/attendance`}>
                                                    Absensi
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Review */}
                    <div className="flex flex-col gap-4 min-w-[320px] w-[320px] bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-[2rem] border border-white/60 dark:border-slate-700/50 h-full backdrop-blur-sm snap-center">
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
                                <Card key={m.id} className="border-0 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
                                    <div className="h-1 w-full bg-purple-500"></div>
                                    <CardContent className="p-5 flex flex-col gap-3">
                                        <h4 className="font-bold text-slate-900 dark:text-white leading-snug">{m.title}</h4>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                                            <CalendarDays className="w-3.5 h-3.5" />
                                            {formatDate(m.date)}
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                                            <Button asChild size="sm" className="w-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white rounded-xl transition-colors shadow-none group-hover:bg-purple-600 group-hover:text-white">
                                                <Link href={`/meetings/${m.id}/review`}>
                                                    Review (AI) <ArrowRight className="w-3 h-3 ml-2" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Column 4: Approval */}
                    <div className="flex flex-col gap-4 min-w-[320px] w-[320px] bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-[2rem] border border-white/60 dark:border-slate-700/50 h-full backdrop-blur-sm snap-center">
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
                                <Card key={m.id} className="border-0 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
                                    <div className="h-1 w-full bg-emerald-500"></div>
                                    <CardContent className="p-5 flex flex-col gap-3">
                                        <h4 className="font-bold text-slate-900 dark:text-white leading-snug">{m.title}</h4>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                                            <CalendarDays className="w-3.5 h-3.5" />
                                            {formatDate(m.date)}
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                                            <Button asChild size="sm" className="w-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white rounded-xl transition-colors shadow-none group-hover:bg-emerald-600 group-hover:text-white">
                                                <Link href={`/meetings/${m.id}/approval`}>
                                                    Tinjau & Setujui <ArrowRight className="w-3 h-3 ml-2" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Column 5: Finished */}
                    <div className="flex flex-col gap-4 min-w-[320px] w-[320px] bg-slate-100/30 dark:bg-slate-800/20 p-4 rounded-[2rem] border border-white/40 dark:border-slate-700/30 h-full backdrop-blur-sm opacity-80 hover:opacity-100 transition-opacity snap-center">
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
                                <Card key={m.id} className="border-0 shadow-sm bg-white/90 dark:bg-slate-800/90 rounded-2xl overflow-hidden">
                                    <div className="h-1 w-full bg-slate-300 dark:bg-slate-600"></div>
                                    <CardContent className="p-5 flex flex-col gap-3">
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">{m.title}</h4>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                                            <CalendarDays className="w-3.5 h-3.5" />
                                            {formatDate(m.date)}
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                                            <Button asChild size="sm" variant="outline" className="w-full text-xs hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl border-slate-200 dark:border-slate-600">
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
