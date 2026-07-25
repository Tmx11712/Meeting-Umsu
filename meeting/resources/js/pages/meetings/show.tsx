import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Edit, Mic, PenTool, Users, FileText, CheckCircle } from 'lucide-react';
import { MeetingTabs } from '@/components/meeting-tabs';

export default function MeetingShow({ meeting }: any) {
    const { auth } = usePage<any>().props;
    const roles = auth?.roles || [];
    const isAdmin = roles.includes('Super Admin') || roles.includes('Administrator');
    const isUmum = roles.includes('Bag. Umum');
    const isHumas = roles.includes('Bag. Humas');
    const isPimpinan = roles.includes('Pimpinan');
    const isViewer = roles.includes('Viewer');

    return (
        <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 max-w-6xl mx-auto w-full">
            <Head title={`Rapat: ${meeting.title}`} />
            
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold tracking-tight">{meeting.title}</h1>
                    <div className="flex items-center gap-2">
                        <Badge variant={meeting.status === 'selesai' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                            {meeting.status.toUpperCase()}
                        </Badge>
                        {(isAdmin || isUmum) && (
                            <Button variant="outline" asChild>
                                <Link href={`/meetings/${meeting.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Rapat
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <MeetingTabs meeting={meeting} activeTab="info" />

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
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b">
                                <span className="text-muted-foreground">Lokasi</span>
                                <span className="font-medium flex items-center"><MapPin className="h-4 w-4 mr-2" /> {meeting.location}</span>
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
                    {(isAdmin || isUmum || isHumas || isPimpinan) && (
                        <Card className="border-blue-200 bg-blue-50/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-blue-800">Tindakan Operasional</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-3">
                                {(isAdmin || isHumas) && (
                                    <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
                                        <Link href={`/meetings/${meeting.id}/recording`}>
                                            <Mic className="mr-2 h-4 w-4" /> Buka Ruang Rekaman
                                        </Link>
                                    </Button>
                                )}
                                {(isAdmin || isUmum) && (
                                    <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                        <Link href={`/meetings/${meeting.id}/correction`}>
                                            <PenTool className="mr-2 h-4 w-4" /> Koreksi Transkrip
                                        </Link>
                                    </Button>
                                )}
                                {(isAdmin || isUmum || isHumas) && (
                                    <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                        <Link href={`/meetings/${meeting.id}/attendance`}>
                                            <Users className="mr-2 h-4 w-4" /> Kelola Absensi
                                        </Link>
                                    </Button>
                                )}
                                {(isAdmin || isUmum) && (
                                    <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                        <Link href={`/meetings/${meeting.id}/review`}>
                                            <FileText className="mr-2 h-4 w-4" /> Review Notulen
                                        </Link>
                                    </Button>
                                )}
                                {(isAdmin || isPimpinan) && (
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
                                            {participant.user?.initials || '??'}
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
