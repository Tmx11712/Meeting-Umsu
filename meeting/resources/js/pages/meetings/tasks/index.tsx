import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, ArrowRight, Mic, PenTool, Users, FileText, CheckCircle, Lock } from 'lucide-react';
import React from 'react';

// Map icon string to actual Lucide component
const IconMap: Record<string, React.ElementType> = {
    'Mic': Mic,
    'PenTool': PenTool,
    'Users': Users,
    'FileText': FileText,
    'CheckCircle': CheckCircle,
};

export default function TaskDashboard({ meetings, task }: any) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'berlangsung': return 'bg-red-50 text-red-600 border-red-200';
            case 'selesai': return 'bg-green-50 text-green-600 border-green-200';
            case 'terjadwal': return 'bg-blue-50 text-blue-600 border-blue-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    const { auth } = usePage().props as any;
    const userRole = auth?.user?.roles?.[0]?.name;
    const dept = auth?.user?.department?.toLowerCase() || '';
    const roles = auth?.roles || [];

    // Determine access
    let hasAccess = false;
    const action = task.actionRoute;
    if (userRole === 'Super Admin' || userRole === 'Administrator' || roles.includes('Super Admin') || roles.includes('Administrator')) {
        hasAccess = true;
    } else if (action === 'meetings.recording' || action === 'meetings.correction') {
        hasAccess = userRole === 'Humas' || userRole === 'Bag. Humas' || dept.includes('humas') || roles.includes('Bag. Humas') || roles.includes('Humas');
    } else if (action === 'meetings.attendance') {
        hasAccess = userRole === 'Umum' || userRole === 'Bag. Umum' || dept.includes('umum') || roles.includes('Bag. Umum') || roles.includes('Umum');
    } else if (action === 'meetings.review') {
        hasAccess = userRole === 'Umum' || userRole === 'Bag. Umum' || userRole === 'Sekretaris' || dept.includes('umum') || roles.includes('Bag. Umum') || roles.includes('Sekretaris');
    } else if (action === 'meetings.approval') {
        hasAccess = userRole === 'Pimpinan' || userRole === 'Rektor' || userRole === 'Wakil Rektor' || roles.includes('Pimpinan');
    }

    const TaskIcon = IconMap[task.icon] || FileText;

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-8 max-w-7xl mx-auto w-full">
            <Head title={task.title} />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{task.title}</h1>
                    <p className="text-slate-500 text-sm mt-1">{task.description}</p>
                </div>
            </div>

            <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                        <TaskIcon className="h-5 w-5 mr-2 text-primary" /> {task.header}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {meetings.data.map((meeting: any) => (
                            <div key={meeting.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Link href={`/meetings/${meeting.id}/${task.actionRoute.split('.').pop()}`} className="font-semibold text-lg text-slate-900 hover:text-primary transition-colors">
                                            {meeting.title}
                                        </Link>
                                        <Badge variant="outline" className={`rounded-full px-2.5 font-medium ${getStatusColor(meeting.status)}`}>
                                            {meeting.status === 'berlangsung' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />}
                                            {meeting.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                                        <div className="flex items-center">
                                            <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                                            {meeting.date}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4 text-slate-400" />
                                            {meeting.start_time ? meeting.start_time.substring(0,5) : ''} - {meeting.end_time ? meeting.end_time.substring(0,5) : ''}
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="mr-2 h-4 w-4 text-slate-400" />
                                            {meeting.location}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {hasAccess ? (
                                        <Button className="shadow-sm" asChild>
                                            <Link href={`/meetings/${meeting.id}/${task.actionRoute.split('.').pop()}`}>
                                                {task.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button className="shadow-sm bg-slate-100 text-slate-400 hover:bg-slate-100 cursor-not-allowed border border-slate-200">
                                            <Lock className="mr-2 h-4 w-4" /> Tidak Ada Akses
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {meetings.data.length === 0 && (
                            <div className="py-16 flex flex-col items-center justify-center text-center">
                                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <TaskIcon className="h-8 w-8 text-green-500 opacity-80" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 mb-1">{task.emptyTitle}</h3>
                                <p className="text-slate-500 max-w-sm">{task.emptyDesc}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {meetings.data.length > 0 && (
                <div className="flex items-center justify-between text-sm text-slate-500 mt-2">
                    <div>
                        Menampilkan <span className="font-medium text-slate-900">{meetings.from || 0}</span> - <span className="font-medium text-slate-900">{meetings.to || 0}</span> dari <span className="font-medium text-slate-900">{meetings.total || 0}</span> rapat
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled={!meetings.prev_page_url} asChild={!!meetings.prev_page_url}>
                            {meetings.prev_page_url ? <Link href={meetings.prev_page_url}>Sebelumnya</Link> : <span>Sebelumnya</span>}
                        </Button>
                        <Button variant="outline" size="sm" disabled={!meetings.next_page_url} asChild={!!meetings.next_page_url}>
                            {meetings.next_page_url ? <Link href={meetings.next_page_url}>Selanjutnya</Link> : <span>Selanjutnya</span>}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
