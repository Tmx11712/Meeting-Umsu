import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, MapPin, Clock, Edit, Mic, PenTool, Users, FileText, CheckCircle, QrCode, Download } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { QRCodeCanvas } from 'qrcode.react';
import { useInitials } from '@/hooks/use-initials';
import { useMeetingWebSocket } from '@/hooks/use-meeting-websocket';

export default function MeetingShow({ meeting }: any) {
    useMeetingWebSocket(meeting?.id);
    const [isQrOpen, setIsQrOpen] = useState(false);

    const handleDownloadQR = () => {
        const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
        if (!canvas) return;
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_Absensi_${meeting?.title?.replace(/\s+/g, '_') || 'Meeting'}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };
    const { auth } = usePage<any>().props;
    const getInitials = useInitials();
    const roles = auth?.roles || [];
    const isAdmin = roles.includes('Super Admin') || roles.includes('Administrator');
    const isUmum = roles.includes('Bag. Umum');
    const isHumas = roles.includes('Bag. Humas');
    const isPimpinan = roles.includes('Pimpinan');
    const isViewer = roles.includes('Viewer');

    const canRecord = (isAdmin || isHumas || isUmum) && ['terjadwal', 'berlangsung', 'recording', 'recorded'].includes(meeting.status);
    const canEnterRecordingRoom = (isAdmin || isHumas || isUmum) && ['terjadwal', 'berlangsung', 'recording', 'recorded'].includes(meeting.status);
    const canCorrect = (isAdmin || isUmum) && ['berlangsung', 'recorded', 'corrected'].includes(meeting.status);
    const canAttend = (isAdmin || isUmum || isHumas) && ['berlangsung', 'recorded', 'corrected', 'reviewed', 'selesai'].includes(meeting.status);
    const canReview = (isAdmin || isUmum) && ['corrected', 'reviewed', 'selesai'].includes(meeting.status);
    const canApprove = (isAdmin || isPimpinan) && meeting.status === 'reviewed';
    const hasOperationalActions = canEnterRecordingRoom || canCorrect || canAttend || canReview || canApprove;

    return (
        <div className="flex flex-col gap-4 py-2 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title={`Rapat: ${meeting.title}`} />
            
            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Informasi Rapat
                        </h1>
                        <Badge variant={meeting.status === 'selesai' ? 'default' : 'secondary'} className="text-sm px-3 py-1 bg-card/60 border-border text-foreground">
                            {meeting.status.toUpperCase()}
                        </Badge>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                        <span>Dashboard</span>
                        <span>›</span>
                        <Link href="/meetings" className="hover:text-blue-600 transition-colors">Jadwal Rapat</Link>
                        <span>›</span>
                        <span className="text-blue-900 dark:text-blue-300 font-bold">{meeting.title}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" asChild className="rounded-xl border-border bg-card/60 hover:bg-card shadow-sm h-11">
                        <Link href="/meetings">
                            Kembali ke Jadwal
                        </Link>
                    </Button>
                    {(isAdmin || isUmum) && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all h-11 px-5 font-semibold" asChild>
                            <Link href={`/meetings/${meeting.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Rapat
                            </Link>
                        </Button>
                    )}
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                <span className="text-muted-foreground block mb-2">Agenda Rapat</span>
                                {meeting.agenda && meeting.agenda.length > 0 ? (
                                    <ul className="list-disc pl-5 font-medium space-y-1">
                                        {meeting.agenda.map((item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="font-medium text-slate-500 italic">Tidak ada agenda</p>
                                )}
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
                                {canEnterRecordingRoom && !isHumas && (
                                    <Button onClick={() => setIsQrOpen(true)} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                        <QrCode className="mr-2 h-4 w-4" /> Tampilkan QR Absensi
                                    </Button>
                                )}
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
                                {canAttend && !isHumas && (
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
                            <CardTitle>Daftar Peserta ({(meeting.participants?.length || 0) + (meeting.attendances?.filter((a: any) => !a.user_id).length || 0)})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {meeting.participants?.map((participant: any) => (
                                    <li key={`internal-${participant.id}`} className="flex items-center space-x-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                                            {participant.user?.name ? getInitials(participant.user.name) : '??'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{participant.user?.name}</p>
                                            <p className="text-xs text-muted-foreground">{participant.user?.department || 'Staff'}</p>
                                        </div>
                                    </li>
                                ))}
                                
                                {meeting.attendances?.filter((a: any) => !a.user_id).map((guest: any) => (
                                    <li key={`external-${guest.id}`} className="flex items-center space-x-3">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">
                                            {guest.guest_name ? getInitials(guest.guest_name) : '??'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{guest.guest_name}</p>
                                            <p className="text-xs text-muted-foreground">{guest.guest_institution || 'Tamu Eksternal'}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">QR Code Absensi</DialogTitle>
                        <DialogDescription className="text-center">
                            Scan QR Code ini menggunakan aplikasi UMSU Employee untuk mencatat kehadiran pada rapat.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-6 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <QRCodeCanvas 
                                id="qr-code-canvas"
                                value={`http://192.168.100.98:8000/attend/${meeting.id}`} 
                                size={250}
                                level="H"
                                includeMargin={false}
                            />
                        </div>
                        <div className="text-center space-y-1">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{meeting.title}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {meeting.date} • {meeting.start_time?.substring(0,5)} - {meeting.end_time?.substring(0,5)}
                            </p>
                        </div>
                        <Button onClick={handleDownloadQR} className="mt-2" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download QR Code
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
