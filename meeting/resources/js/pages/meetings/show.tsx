import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, MapPin, Clock, Edit, Mic, PenTool, Users, FileText, CheckCircle } from 'lucide-react';
import { MeetingStepper } from '@/components/meeting-stepper';
import { useInitials } from '@/hooks/use-initials';
import { useMeetingWebSocket } from '@/hooks/use-meeting-websocket';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MeetingShow({ meeting }: any) {
    useMeetingWebSocket(meeting?.id);
    const { auth } = usePage<any>().props;
    const getInitials = useInitials();
    const roles = auth?.roles || [];
    const isAdmin = roles.includes('Super Admin') || roles.includes('Administrator');
    const isUmum = roles.includes('Bag. Umum');
    const isHumas = roles.includes('Bag. Humas');
    const isPimpinan = roles.includes('Pimpinan');

    const canRecord = (isAdmin || isHumas) && ['terjadwal', 'recording', 'recorded'].includes(meeting.status);
    const canEnterRecordingRoom = ['terjadwal', 'recording', 'recorded'].includes(meeting.status);
    const canCorrect = (isAdmin || isUmum) && ['recorded', 'corrected'].includes(meeting.status);
    const canAttend = (isAdmin || isUmum || isHumas) && ['recorded', 'corrected', 'reviewed'].includes(meeting.status);
    const canReview = (isAdmin || isUmum) && ['corrected', 'reviewed'].includes(meeting.status);
    const canApprove = (isAdmin || isPimpinan) && meeting.status === 'reviewed';
    const hasOperationalActions = canEnterRecordingRoom || canCorrect || canAttend || canReview || canApprove;

    return (
        <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title={`Rapat: ${meeting.title}`} />
            
            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                            Informasi Rapat
                        </h1>
                        <Badge variant={meeting.status === 'selesai' ? 'default' : 'secondary'} className="text-sm px-3 py-1 bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                            {meeting.status.toUpperCase()}
                        </Badge>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                        <span>Dashboard</span>
                        <span>›</span>
                        <Link href="/meetings" className="hover:text-indigo-600 transition-colors">Jadwal Rapat</Link>
                        <span>›</span>
                        <span className="text-indigo-900 dark:text-indigo-300 font-bold">{meeting.title}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" asChild className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 shadow-sm h-11">
                        <Link href="/meetings">
                            Kembali ke Jadwal
                        </Link>
                    </Button>
                    {(isAdmin || isUmum) && (
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all h-11 px-5 font-semibold" asChild>
                            <Link href={`/meetings/${meeting.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Rapat
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Stepper */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-4 rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-sm">
                <MeetingStepper meeting={meeting} activeStage={2} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Rapat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b">
                                <span className="text-muted-foreground">Tanggal</span>
                                <span className="font-medium flex items-center"><Calendar className="h-4 w-4 mr-2" /> {meeting.date}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b">
                                <span className="text-muted-foreground">Waktu</span>
                                <span className="font-medium flex items-center"><Clock className="h-4 w-4 mr-2" /> {meeting.start_time ? meeting.start_time.substring(0,5) : ''} - {meeting.end_time ? meeting.end_time.substring(0,5) : ''}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b gap-4">
                                <span className="text-muted-foreground shrink-0">Lokasi</span>
                                <span className="font-medium flex items-center min-w-0 justify-end sm:text-right">
                                    <MapPin className="h-4 w-4 mr-2 shrink-0" /> 
                                    <span className="truncate" title={meeting.location}>{meeting.location}</span>
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b">
                                <span className="text-muted-foreground">Tipe Rapat</span>
                                <span className="font-medium uppercase">{meeting.type}</span>
                            </div>
                            <div className="pt-2">
                                <span className="text-muted-foreground block mb-1">Deskripsi</span>
                                <p className="font-medium">{meeting.description || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Operational Buttons Card */}
                    {hasOperationalActions && (
                        <Card className="border-blue-200 bg-blue-50/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-blue-800">Tindakan Operasional</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-3">
                                {canEnterRecordingRoom && (
                                    <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
                                        <Link href={`/meetings/${meeting.id}/recording`}>
                                            <Mic className="mr-2 h-4 w-4" /> Buka Ruang Rekaman
                                        </Link>
                                    </Button>
                                )}
                                {canCorrect && (
                                    <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                        <Link href={`/meetings/${meeting.id}/correction`}>
                                            <PenTool className="mr-2 h-4 w-4" /> Koreksi Transkrip
                                        </Link>
                                    </Button>
                                )}
                                {canAttend && (
                                    <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                        <Link href={`/meetings/${meeting.id}/attendance`}>
                                            <Users className="mr-2 h-4 w-4" /> Kelola Absensi
                                        </Link>
                                    </Button>
                                )}
                                {canReview && (
                                    <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                        <Link href={`/meetings/${meeting.id}/review`}>
                                            <FileText className="mr-2 h-4 w-4" /> Review Notulen
                                        </Link>
                                    </Button>
                                )}
                                {canApprove && (
                                    <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                        <Link href={`/meetings/${meeting.id}/approval`}>
                                            <CheckCircle className="mr-2 h-4 w-4" /> Persetujuan Pimpinan
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
                
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Peserta Terundang ({meeting.participants?.length || 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {meeting.participants?.map((participant: any) => (
                                    <li key={participant.id} className="flex items-center space-x-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                                            {participant.user?.name ? getInitials(participant.user.name) : '??'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{participant.user?.name}</p>
                                            <p className="text-xs text-muted-foreground">{participant.user?.department || 'Staff'}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
