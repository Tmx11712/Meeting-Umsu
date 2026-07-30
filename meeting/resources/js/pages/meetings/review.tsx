import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Users, Eye, Send, FileText, Download, Edit3, Lightbulb, CheckCircle2, ChevronDown } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { MeetingStepper } from '@/components/meeting-stepper';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { usePermissions } from '@/hooks/use-permissions';

export default function MeetingReview({ meeting }: any) {
    const minutes = meeting.minutes && meeting.minutes.length > 0 ? meeting.minutes[0] : null;
    const { auth } = usePage<any>().props;
    const { canEdit } = usePermissions();
    const canManageReview = canEdit('minutes');
    const [sending, setSending] = useState(false);

    const sendToPimpinan = () => {
        setSending(true);
        router.post(`/meetings/${meeting.id}/review/send`, {}, {
            onFinish: () => setSending(false)
        });
    };

    const downloadPdf = () => {
        window.location.href = `/meetings/${meeting.id}/review/pdf`;
    };

    // Dummy Attendance Logic
    const participants = meeting.participants || [];
    const attendances = meeting.attendances || [];
    const total = participants.length > 0 ? participants.length : 12;
    const hadir = attendances.length > 0 ? attendances.filter((a: any) => a.status === 'hadir').length : (participants.length > 0 ? 0 : 10);
    const terlambat = attendances.length > 0 ? attendances.filter((a: any) => a.status === 'terlambat').length : (participants.length > 0 ? 0 : 1);
    const tidakHadir = total - hadir - terlambat;

    const getPct = (num: number) => total > 0 ? ((num / total) * 100).toFixed(2) : '0.00';

    if (!minutes) {
        return (
            <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Head title="Review Notulen" />
                
                {/* Header & Breadcrumb */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 mb-2">
                            Review Notulen
                        </h1>
                        <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                            <span>Dashboard</span>
                            <span>›</span>
                            <Link href="/meetings" className="hover:text-indigo-600 transition-colors">Jadwal Rapat</Link>
                            <span>›</span>
                            <span className="text-indigo-900 dark:text-indigo-300 font-bold">Review Notulen</span>
                        </div>
                    </div>
                    <Button variant="outline" asChild className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 shadow-sm h-11">
                        <Link href="/meetings">
                            Kembali ke Jadwal
                        </Link>
                    </Button>
                </div>

                {/* Stepper */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-4 rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-sm">
                    <MeetingStepper meeting={meeting} activeStage={6} />
                </div>

                <div className="text-center py-20 text-slate-500 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                        <Lightbulb className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Notulen Belum Digenerate</h3>
                    <p className="max-w-md mx-auto mb-6">
                        Transkrip rapat sudah siap, namun notulen resmi belum dibuat oleh AI. Silakan klik tombol di bawah untuk meminta AI merangkum hasil rapat menjadi notulen.
                    </p>
                    <Button 
                        className="bg-purple-600 hover:bg-purple-700 text-white" 
                        onClick={() => {
                            setSending(true);
                            router.post(`/meetings/${meeting.id}/review/ai`, {}, {
                                onFinish: () => setSending(false),
                                onSuccess: () => {
                                    window.location.reload();
                                }
                            });
                        }}
                        disabled={sending || !canManageReview}
                    >
                        {sending ? 'Sedang Memproses...' : '✨ Generate Notulen dengan AI'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title="Review Notulen" />
            
            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 mb-2">
                        Review Notulen
                    </h1>
                    <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                        <span>Dashboard</span>
                        <span>›</span>
                        <Link href="/meetings" className="hover:text-indigo-600 transition-colors">Jadwal Rapat</Link>
                        <span>›</span>
                        <span className="text-indigo-900 dark:text-indigo-300 font-bold">Review Notulen</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" asChild className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 shadow-sm h-11">
                        <Link href="/meetings">
                            Kembali ke Jadwal
                        </Link>
                    </Button>
                    {canManageReview && (
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all h-11 px-6 font-semibold" onClick={sendToPimpinan} disabled={sending}>
                            <Send className="w-4 h-4 mr-2" /> Kirim ke Pimpinan
                        </Button>
                    )}
                </div>
            </div>

            {/* Stepper */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-4 rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-sm">
                <MeetingStepper meeting={meeting} activeStage={6} />
            </div>

            {!canManageReview && (
                <Alert className="bg-rose-50/80 dark:bg-rose-900/30 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800/50 rounded-2xl backdrop-blur-sm">
                    <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    <AlertTitle className="text-rose-800 dark:text-rose-300 font-bold text-base ml-2">Mode Hanya Baca</AlertTitle>
                    <AlertDescription className="text-rose-700 dark:text-rose-400/90 ml-2 mt-1 font-medium">
                        Anda tidak memiliki izin untuk mengelola review notulen ini. Anda hanya dapat melihat data.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid md:grid-cols-[1fr_2fr_1fr] gap-6">
                
                {/* Kiri: Info, Ringkasan AI, Dokumen */}
                <div className="space-y-6">
                    {/* Informasi Rapat */}
                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold flex items-center text-slate-900">
                                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md mr-2">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                Informasi Rapat
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Judul Rapat</p>
                                <p className="font-semibold text-slate-900 text-base">{meeting.title || "-"}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Tanggal</p>
                                    <p className="text-sm font-medium flex items-center text-slate-700">
                                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                        {meeting.date || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Waktu</p>
                                    <p className="text-sm font-medium flex items-center text-slate-700">
                                        <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                        {meeting.start_time ? `${meeting.start_time.substring(0,5)} - ${meeting.end_time?.substring(0,5)} WIB` : "-"}
                                    </p>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 mb-1">Ruangan / Lokasi</p>
                                    <div className="text-sm font-medium flex items-center text-slate-700">
                                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                                        <span className="truncate" title={meeting.location || "-"}>{meeting.location || "-"}</span>
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 mb-1">Peserta Terdaftar</p>
                                    <div className="text-sm font-medium flex items-center text-slate-700">
                                        <Users className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                                        <span className="truncate">{participants.length} Orang</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 mt-2">
                                <Eye className="w-4 h-4 mr-2" /> Lihat Detail Rapat
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Ringkasan Otomatis */}
                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-slate-900">Ringkasan Otomatis (AI)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-blue-50/50 rounded-lg p-3 text-center border border-blue-100">
                                    <p className="text-[11px] text-blue-700 font-medium mb-1">Topik Dibahas</p>
                                    <p className="text-2xl font-bold text-blue-600">{minutes.ai_topics_count || 0}</p>
                                    <p className="text-[10px] text-blue-500 mt-1">Topik utama</p>
                                </div>
                                <div className="bg-green-50/50 rounded-lg p-3 text-center border border-green-100">
                                    <p className="text-[11px] text-green-700 font-medium mb-1">Keputusan</p>
                                    <p className="text-2xl font-bold text-green-600">{minutes.ai_decisions_count || 0}</p>
                                    <p className="text-[10px] text-green-500 mt-1">Keputusan penting</p>
                                </div>
                                <div className="bg-yellow-50/50 rounded-lg p-3 text-center border border-yellow-100">
                                    <p className="text-[11px] text-yellow-700 font-medium mb-1">Tindak Lanjut</p>
                                    <p className="text-2xl font-bold text-yellow-600">{minutes.action_items?.length || 0}</p>
                                    <p className="text-[10px] text-yellow-500 mt-1">Action items</p>
                                </div>
                                <div className="bg-purple-50/50 rounded-lg p-3 text-center border border-purple-100">
                                    <p className="text-[11px] text-purple-700 font-medium mb-1">Durasi Rapat</p>
                                    <p className="text-xl font-bold text-purple-600 mt-1">{meeting.duration_formatted || "00:00:00"}</p>
                                    <p className="text-[10px] text-purple-500 mt-1">Jam:Menit:Detik</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dokumen Pendukung */}
                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-slate-900">Dokumen Pendukung</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {meeting.documents?.length > 0 ? meeting.documents.map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-blue-50 text-blue-500 rounded-md">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">{doc.title || doc.file_name}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-600" asChild>
                                            <a href={`/storage/${doc.file_path}`} download><Download className="w-3.5 h-3.5" /></a>
                                        </Button>
                                    </div>
                                </div>
                            )) : <div className="text-slate-500 italic text-sm">Belum ada dokumen.</div>}
                        </CardContent>
                    </Card>
                </div>

                {/* Tengah: Notulen Rapat */}
                <div className="flex flex-col">
                    <Card className="rounded-xl border-slate-200 shadow-sm flex-1 flex flex-col">
                        <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold text-slate-900">Notulen Rapat</CardTitle>
                            <div className="flex gap-2">
                                {canManageReview && (
                                    <Button variant="outline" size="sm" className="h-8 text-xs text-slate-600">
                                        <Edit3 className="w-3 h-3 mr-2" /> Edit Notulen
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" className="h-8 text-xs text-slate-600" onClick={downloadPdf}>
                                    <Download className="w-3 h-3 mr-2" /> Unduh <ChevronDown className="w-3 h-3 ml-1" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 text-sm text-slate-800 space-y-8">
                            {minutes.content && typeof minutes.content === 'object' && !Array.isArray(minutes.content) ? (
                                <div className="space-y-8">
                                    {/* Pembukaan */}
                                    {minutes.content.pembukaan && (
                                        <div>
                                            <h3 className="font-bold text-sm mb-2 text-slate-900">Pembukaan</h3>
                                            <p className="leading-relaxed text-slate-700">{minutes.content.pembukaan}</p>
                                        </div>
                                    )}

                                    {/* Pembahasan */}
                                    {minutes.content.pembahasan && Array.isArray(minutes.content.pembahasan) && minutes.content.pembahasan.length > 0 && (
                                        <div>
                                            <h3 className="font-bold text-sm mb-3 text-slate-900">Pembahasan</h3>
                                            <div className="space-y-6">
                                                {minutes.content.pembahasan.map((bahas: any, idx: number) => (
                                                    <div key={idx} className="border-l-2 border-blue-200 pl-4">
                                                        <h4 className="font-semibold text-sm text-slate-800 mb-2">{bahas.topik}</h4>
                                                        <p className="leading-relaxed text-slate-700 mb-2">{bahas.narasi}</p>
                                                        {bahas.tabel && <div className="mt-2 text-xs overflow-x-auto bg-slate-50 p-2 rounded" dangerouslySetInnerHTML={{__html: bahas.tabel}} />}
                                                        {bahas.list && <div className="mt-2 pl-4 list-disc text-sm text-slate-700" dangerouslySetInnerHTML={{__html: bahas.list}} />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Keputusan */}
                                    {minutes.content.keputusan && Array.isArray(minutes.content.keputusan) && minutes.content.keputusan.length > 0 && (
                                        <div>
                                            <h3 className="font-bold text-sm mb-2 text-slate-900">Keputusan</h3>
                                            <ul className="list-disc pl-5 space-y-1.5">
                                                {minutes.content.keputusan.map((kep: string, idx: number) => (
                                                    <li key={idx} className="leading-relaxed text-slate-700">{kep}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-slate-500 italic">Konten notulen tidak tersedia atau format tidak didukung.</div>
                            )}

                            <div>
                                <h3 className="font-bold text-sm mb-2 text-slate-900">Tindak Lanjut</h3>
                                <div className="space-y-2">
                                    {minutes.action_items?.length > 0 ? minutes.action_items.map((item: any) => (
                                        <div className="flex gap-2" key={item.id}>
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            <p className="leading-relaxed text-sm">{item.description} (PIC: {item.pic}, Deadline: {item.deadline})</p>
                                        </div>
                                    )) : <div className="text-slate-500 italic text-sm">Tidak ada tindak lanjut.</div>}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 rounded-b-xl">
                            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2.5 rounded-lg w-full">
                                <Info className="w-4 h-4 shrink-0" />
                                <span className="text-xs font-medium">Notulen ini telah melalui proses transkripsi, koreksi, dan verifikasi kehadiran.</span>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Kanan: Peserta Rapat & Info Review */}
                <div className="space-y-6">
                    {/* Peserta Rapat */}
                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-slate-900">Peserta Rapat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                        <span className="text-slate-700 font-medium">Hadir</span>
                                    </div>
                                    <span className="font-semibold text-slate-900">{hadir} ({getPct(hadir)}%)</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                        <span className="text-slate-700 font-medium">Terlambat</span>
                                    </div>
                                    <span className="font-semibold text-slate-900">{terlambat} ({getPct(terlambat)}%)</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                        <span className="text-slate-700 font-medium">Tidak Hadir</span>
                                    </div>
                                    <span className="font-semibold text-slate-900">{tidakHadir} ({getPct(tidakHadir)}%)</span>
                                </div>
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                        <span className="text-slate-700 font-bold">Total Peserta</span>
                                    </div>
                                    <span className="font-bold text-slate-900">{participants.length} Orang</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 text-xs h-8 mt-2" asChild>
                                <Link href={`/meetings/${meeting.id}/attendance`}>
                                    <Users className="w-3 h-3 mr-2" /> Lihat Detail Absensi
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Informasi Review */}
                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-slate-900">Informasi Review</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div>
                                <p className="text-[11px] text-slate-500 mb-2">Direview oleh</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center text-xs uppercase">
                                        {auth?.user?.name?.substring(0, 2) || 'BU'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{auth?.user?.name || 'Bag. Umum'}</p>
                                        <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-600 mt-0.5 h-5">{auth?.user?.department || 'Operator'}</Badge>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <p className="text-[11px] text-slate-500 mb-1">Tanggal Review</p>
                                <p className="text-sm font-semibold text-slate-900">4 Juni 2026 11:35 WIB</p>
                            </div>

                            <div>
                                <p className="text-[11px] text-slate-500 mb-1">Status</p>
                                <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 shadow-none text-xs font-medium border-0">Siap Dikirim</Badge>
                            </div>

                            <div>
                                <p className="text-[11px] text-slate-500 mb-1.5">Catatan (Opsional)</p>
                                <textarea 
                                    className="w-full min-h-[80px] p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                    placeholder="Notulen sudah lengkap dan siap dikirim ke pimpinan untuk persetujuan."
                                    disabled={!canManageReview}
                                ></textarea>
                                <p className="text-[10px] text-slate-400 text-right mt-1">68 / 500 karakter</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Langkah Selanjutnya Alert */}
                    {canManageReview && (
                        <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-xl p-4 flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-yellow-800">Langkah Selanjutnya</h4>
                                <p className="text-xs text-yellow-700 mt-1 leading-relaxed">Klik tombol "Kirim ke Pimpinan" untuk mengirim notulen ini ke pimpinan untuk persetujuan.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Tambahkan Info icon mock
function Info(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    )
}
