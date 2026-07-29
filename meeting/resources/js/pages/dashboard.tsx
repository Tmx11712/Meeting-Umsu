import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, CheckCircle, ClipboardCheck, PieChart, TrendingUp, Plus, Mic, FileText, Users, PenTool, Check } from 'lucide-react';
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
            
            <div className="flex h-full flex-1 flex-col gap-6 p-8 w-full max-w-[1600px] mx-auto overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Rapat</h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Pantau status dan tindak lanjuti seluruh rapat.
                        </p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                        <Link 
                            href="/meetings"
                            onClick={(e) => {
                                if (!guardAction('meeting')) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            Jadwal Rapat
                        </Link>
                    </Button>
                </div>

                {/* Stats Row */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 shrink-0">
                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <CalendarDays className="size-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">{stats?.meetingsThisMonth || 0}</div>
                                    <p className="text-sm text-slate-500">Rapat bulan ini</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                                    <CheckCircle className="size-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">{stats?.minutesCompleted || 0}</div>
                                    <p className="text-sm text-slate-500">Notulen selesai</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                                    <ClipboardCheck className="size-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">{stats?.openActionItems || 0}</div>
                                    <p className="text-sm text-slate-500">Tindak lanjut aktif</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                    <PieChart className="size-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">{stats?.avgAttendance || 0}%</div>
                                    <p className="text-sm text-slate-500">Rata-rata kehadiran</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pipeline Board (Kanban) */}
                <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start min-h-[500px]">
                    
                    {/* Column 1: Recording */}
                    <div className="flex flex-col gap-3 min-w-[300px] w-[300px] bg-slate-50/50 p-3 rounded-xl border border-slate-200 h-full">
                        <div className="flex items-center justify-between px-1 mb-2">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <Mic className="w-4 h-4 text-slate-500" />
                                Menunggu Rekaman
                            </h3>
                            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{pipelines.recording.length}</span>
                        </div>
                        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                            {pipelines.recording.map(m => (
                                <Card key={m.id} className="shadow-sm border-slate-200 hover:border-blue-300 transition-colors">
                                    <CardContent className="p-4 flex flex-col gap-2">
                                        <h4 className="font-semibold text-slate-900 leading-tight">{m.title}</h4>
                                        <p className="text-xs text-slate-500">{formatDate(m.date)} • {m.start_time}</p>
                                        <div className="mt-2 pt-3 border-t border-slate-100">
                                            <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                                                <Link 
                                                    href={`/meetings/${m.id}/recording`}
                                                    onClick={(e) => {
                                                        if (!guardAction('transcript', 'Akses Terbatas: Hanya Bagian Humas yang dapat melakukan perekaman.')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    Mulai Rekam
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Correction & Attendance */}
                    <div className="flex flex-col gap-3 min-w-[300px] w-[300px] bg-slate-50/50 p-3 rounded-xl border border-slate-200 h-full">
                        <div className="flex items-center justify-between px-1 mb-2">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <PenTool className="w-4 h-4 text-slate-500" />
                                Koreksi & Absen
                            </h3>
                            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{pipelines.correction.length}</span>
                        </div>
                        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                            {pipelines.correction.map(m => (
                                <Card key={m.id} className="shadow-sm border-slate-200 hover:border-orange-300 transition-colors">
                                    <CardContent className="p-4 flex flex-col gap-2">
                                        <h4 className="font-semibold text-slate-900 leading-tight">{m.title}</h4>
                                        <p className="text-xs text-slate-500">{formatDate(m.date)} • {m.start_time}</p>
                                        <div className="mt-2 pt-3 border-t border-slate-100 flex gap-2">
                                            <Button asChild size="sm" variant="outline" className="flex-1 text-xs border-orange-200 hover:bg-orange-50">
                                                <Link 
                                                    href={`/meetings/${m.id}/correction`}
                                                    onClick={(e) => {
                                                        if (!guardAction('minutes', 'Akses Terbatas: Hanya Bagian Umum yang dapat melakukan koreksi.')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    Koreksi
                                                </Link>
                                            </Button>
                                            <Button asChild size="sm" variant="outline" className="flex-1 text-xs border-orange-200 hover:bg-orange-50">
                                                <Link 
                                                    href={`/meetings/${m.id}/attendance`}
                                                    onClick={(e) => {
                                                        if (!guardAction('attendance', 'Akses Terbatas: Hanya Bagian Umum yang dapat mengisi absensi.')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
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
                    <div className="flex flex-col gap-3 min-w-[300px] w-[300px] bg-slate-50/50 p-3 rounded-xl border border-slate-200 h-full">
                        <div className="flex items-center justify-between px-1 mb-2">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-500" />
                                Review Notulen
                            </h3>
                            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{pipelines.review.length}</span>
                        </div>
                        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                            {pipelines.review.map(m => (
                                <Card key={m.id} className="shadow-sm border-slate-200 hover:border-purple-300 transition-colors">
                                    <CardContent className="p-4 flex flex-col gap-2">
                                        <h4 className="font-semibold text-slate-900 leading-tight">{m.title}</h4>
                                        <p className="text-xs text-slate-500">{formatDate(m.date)}</p>
                                        <div className="mt-2 pt-3 border-t border-slate-100">
                                            <Button asChild size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                                                <Link 
                                                    href={`/meetings/${m.id}/review`}
                                                    onClick={(e) => {
                                                        if (!guardAction('minutes', 'Akses Terbatas: Hanya Bagian Umum yang dapat melakukan review.')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    Review (AI)
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Column 4: Approval */}
                    <div className="flex flex-col gap-3 min-w-[300px] w-[300px] bg-slate-50/50 p-3 rounded-xl border border-slate-200 h-full">
                        <div className="flex items-center justify-between px-1 mb-2">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-slate-500" />
                                Persetujuan
                            </h3>
                            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{pipelines.approval.length}</span>
                        </div>
                        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                            {pipelines.approval.map(m => (
                                <Card key={m.id} className="shadow-sm border-slate-200 hover:border-emerald-300 transition-colors">
                                    <CardContent className="p-4 flex flex-col gap-2">
                                        <h4 className="font-semibold text-slate-900 leading-tight">{m.title}</h4>
                                        <p className="text-xs text-slate-500">{formatDate(m.date)}</p>
                                        <div className="mt-2 pt-3 border-t border-slate-100">
                                            <Button asChild size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                                                <Link 
                                                    href={`/meetings/${m.id}/approval`}
                                                    onClick={(e) => {
                                                        if (!hasRole('Super Admin', 'Administrator', 'Pimpinan')) {
                                                            guardAction('report', 'Akses Terbatas: Hanya Pimpinan yang dapat menyetujui dokumen ini.');
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    Tinjau & Setujui
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Column 5: Finished */}
                    <div className="flex flex-col gap-3 min-w-[300px] w-[300px] bg-slate-50/50 p-3 rounded-xl border border-slate-200 h-full opacity-70">
                        <div className="flex items-center justify-between px-1 mb-2">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <Check className="w-4 h-4 text-slate-500" />
                                Selesai
                            </h3>
                            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{pipelines.finished.length}</span>
                        </div>
                        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                            {pipelines.finished.map(m => (
                                <Card key={m.id} className="shadow-sm border-slate-200">
                                    <CardContent className="p-4 flex flex-col gap-2">
                                        <h4 className="font-medium text-slate-900 leading-tight">{m.title}</h4>
                                        <p className="text-xs text-slate-500">{formatDate(m.date)}</p>
                                        <div className="mt-2 pt-3 border-t border-slate-100">
                                            <Button asChild size="sm" variant="outline" className="w-full text-xs hover:bg-slate-100">
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
