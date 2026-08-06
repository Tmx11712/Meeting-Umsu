import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Users, Eye, Send, FileText, Download, Edit3, Lightbulb, CheckCircle2, ChevronDown, RefreshCw, Sparkles, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { MeetingInfoCard } from '@/components/meetings/MeetingInfoCard';
import { useMeetingWebSocket } from '@/hooks/use-meeting-websocket';
import { AlertCircle, Info } from 'lucide-react';
import { useState } from 'react';
import { MeetingStepper } from '@/components/meeting-stepper';
import { Meeting } from '@/types/meeting';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { usePermissions } from '@/hooks/use-permissions';

export default function MeetingReview({ meeting, ...props }: { meeting: Meeting, [key: string]: any }) {
    const minutes = meeting.minutes && meeting.minutes.length > 0 ? meeting.minutes[0] : null;
    const { auth } = usePage<any>().props;
    const { canEdit, hasRole } = usePermissions();
    const canManageReview = canEdit('review');
    const isPimpinan = hasRole('Pimpinan');
    const participants = meeting.participants || [];

    useMeetingWebSocket(meeting?.id);

    const [sending, setSending] = useState(false);
    
    // Edit Modal States
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    const openEditModal = () => {
        if (minutes?.content) {
            setEditData(JSON.parse(JSON.stringify(minutes.content)));
        } else {
            setEditData({ latar_belakang: '', peserta_rapat: [], pembahasan: [], keputusan: [] });
        }
        setEditModalOpen(true);
    };

    const saveEdit = () => {
        setSending(true);
        router.put(`/meetings/${meeting.id}/review`, { content: editData }, {
            onSuccess: () => {
                setEditModalOpen(false);
            },
            onFinish: () => setSending(false)
        });
    };

    const sendToPimpinan = () => {
        setSending(true);
        router.post(`/meetings/${meeting.id}/review/send`, {}, {
            onFinish: () => setSending(false)
        });
    };

    const approveNotulen = () => {
        setSending(true);
        router.post(`/meetings/${meeting.id}/approval`, { decision: 'approved', notes: '' }, {
            onFinish: () => setSending(false)
        });
    };

    const downloadPdf = () => {
        window.location.href = `/meetings/${meeting.id}/review/pdf`;
    };

    // Document Handlers
    const [uploadingDoc, setUploadingDoc] = useState(false);
    
    const handleUploadDocument = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingDoc(true);
        const formData = new FormData();
        formData.append('document', file);

        router.post(`/meetings/${meeting.id}/documents`, formData, {
            onFinish: () => {
                setUploadingDoc(false);
                e.target.value = null; // reset input
            }
        });
    };

    const handleDeleteDocument = (id: string) => {
        if (!confirm('Hapus dokumen ini?')) return;
        router.delete(`/meetings/${meeting.id}/documents/${id}`);
    };

    // Dummy Attendance Logic
    const attendances = meeting.attendances || [];
    const total = participants.length > 0 ? participants.length : 12;
    const hadir = attendances.length > 0 ? attendances.filter((a: any) => a.status === 'hadir').length : (participants.length > 0 ? 0 : 10);
    const terlambat = attendances.length > 0 ? attendances.filter((a: any) => a.status === 'terlambat').length : (participants.length > 0 ? 0 : 1);
    const tidakHadir = total - hadir - terlambat;

    const getPct = (num: number) => total > 0 ? ((num / total) * 100).toFixed(2) : '0.00';

    if (!minutes) {
        return (
            <div className="flex flex-col gap-4 py-2 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Head title="Review Notulen" />
                
                {/* Header & Breadcrumb */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400 mb-2">
                            Review Notulen
                        </h1>
                        <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                            <span>Dashboard</span>
                            <span>›</span>
                            <Link href="/meetings" className="hover:text-blue-600 transition-colors">Jadwal Rapat</Link>
                            <span>›</span>
                            <span className="text-blue-900 dark:text-blue-300 font-bold">Review Notulen</span>
                        </div>
                    </div>
                    <Button variant="outline" asChild className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 shadow-sm h-11">
                        <Link href="/meetings">
                            Kembali ke Jadwal
                        </Link>
                    </Button>
                </div>

                {/* Stepper */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-4 rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-sm">
                    <MeetingStepper meeting={meeting} activeStage={6} />
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                    {/* Left side: Transcripts reference */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500" />
                            Referensi Transkrip ({meeting.recordings?.length || 0} File)
                        </h3>
                        
                        {meeting.recordings?.length === 0 ? (
                            <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
                                <CardContent className="py-10 text-center text-slate-500 text-sm">
                                    Belum ada rekaman audio untuk rapat ini.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {meeting.recordings?.map((rec: any, idx: number) => {
                                    const transcripts = rec.transcripts || [];
                                    const combinedText = transcripts.map((t: any) => {
                                        const latest = t.corrections?.length > 0 ? t.corrections[t.corrections.length - 1].corrected_text : t.text;
                                        return latest;
                                    }).join(' ');

                                    return (
                                        <Card key={rec.id} className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
                                            <CardHeader className="bg-slate-50/80 dark:bg-slate-900/50 py-3 px-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between space-y-0 backdrop-blur-sm">
                                                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                                    <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs">
                                                        {idx + 1}
                                                    </span>
                                                    {rec.label || `Rekaman #${idx + 1}`}
                                                </CardTitle>
                                                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 font-semibold tracking-wide">
                                                    {transcripts.length} SEGMEN
                                                </Badge>
                                            </CardHeader>
                                            <CardContent className="p-5 bg-white/40 dark:bg-slate-900/40 max-h-[400px] overflow-y-auto custom-scrollbar">
                                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                                                    {combinedText || <span className="text-slate-400 italic">Transkrip kosong atau belum diproses.</span>}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right side: Action card */}
                    <div className="flex flex-col">
                        <div className="text-center p-8 text-slate-500 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center sticky top-4">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-5 shadow-inner rotate-3">
                                <Lightbulb className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Notulen Belum Digenerate</h3>
                            <p className="text-sm mx-auto mb-8 leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                                AI akan membaca semua transkrip dari rekaman yang ada dan merangkumnya menjadi notulen resmi lengkap dengan keputusan dan tindak lanjut.
                            </p>
                            <Button 
                                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20 rounded-xl h-12 font-bold transition-all hover:-translate-y-0.5" 
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
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-2 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title="Review Notulen" />
            
            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400 mb-2">
                        Review Notulen
                    </h1>
                    <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                        <span>Dashboard</span>
                        <span>›</span>
                        <Link href="/meetings" className="hover:text-blue-600 transition-colors">Jadwal Rapat</Link>
                        <span>›</span>
                        <span className="text-blue-900 dark:text-blue-300 font-bold">Review Notulen</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" asChild className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 shadow-sm h-11">
                        <Link href="/meetings">
                            Kembali ke Jadwal
                        </Link>
                    </Button>
                    {canManageReview && meeting.current_stage === 5 && !isPimpinan && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all h-11 px-4 font-semibold" onClick={sendToPimpinan} disabled={sending}>
                            <Send className="w-4 h-4 mr-2" /> Kirim ke Pimpinan
                        </Button>
                    )}
                    {canManageReview && meeting.current_stage === 6 && isPimpinan && (
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all h-11 px-4 font-semibold" onClick={approveNotulen} disabled={sending}>
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Setujui Notulen
                        </Button>
                    )}
                </div>
            </div>

            {/* Stepper */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-4 rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-sm">
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

            <div className="grid md:grid-cols-[1fr_2fr_1fr] gap-4">
                
                {/* Kiri: Info, Ringkasan AI, Dokumen */}
                <div className="space-y-6">
                    {/* Informasi Rapat */}
                    <MeetingInfoCard 
                        meeting={meeting} 
                        totalParticipants={participants.length} 
                        showDetailButton={true} 
                        className="rounded-xl border-slate-200 shadow-sm"
                    />

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
                                <div className="bg-sky-50/50 rounded-lg p-3 text-center border border-sky-100">
                                    <p className="text-[11px] text-sky-700 font-medium mb-1">Durasi Rapat</p>
                                    <p className="text-xl font-bold text-sky-600 mt-1">{meeting.duration_formatted || "00:00:00"}</p>
                                    <p className="text-[10px] text-sky-500 mt-1">Jam:Menit:Detik</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                </div>

                {/* Tengah: Notulen Rapat */}
                <div className="flex flex-col">
                    <Card className="rounded-xl border-slate-200 shadow-sm flex-1 flex flex-col">
                        <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between flex-wrap gap-2">
                            <CardTitle className="text-lg font-bold text-slate-900">Notulen Rapat</CardTitle>
                            <div className="flex gap-2 flex-wrap">
                                {canManageReview && (
                                    <>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-8 text-xs text-sky-600 border-sky-200 hover:bg-sky-50"
                                            onClick={() => {
                                                if (confirm('Anda yakin ingin men-generate ulang notulen? Ini akan menimpa notulen yang ada saat ini dengan versi AI terbaru dari transkrip.')) {
                                                    setSending(true);
                                                    router.post(`/meetings/${meeting.id}/review/ai`, {}, {
                                                        onFinish: () => setSending(false),
                                                        onSuccess: () => window.location.reload()
                                                    });
                                                }
                                            }}
                                            disabled={sending}
                                        >
                                            {sending ? <RefreshCw className="w-3 h-3 mr-2 animate-spin" /> : <Sparkles className="w-3 h-3 mr-2" />}
                                            {sending ? 'Memproses...' : 'Regenerate AI'}
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 text-xs text-slate-600 hidden sm:flex" onClick={openEditModal}>
                                            <Edit3 className="w-3 h-3 mr-2" /> Edit Notulen
                                        </Button>
                                    </>
                                )}
                                {meeting.current_stage >= 7 && (
                                    <Button variant="outline" size="sm" className="h-8 text-xs text-slate-600" onClick={downloadPdf}>
                                        <Download className="w-3 h-3 mr-2" /> Unduh <ChevronDown className="w-3 h-3 ml-1" />
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 flex-1 text-sm text-slate-800 space-y-8">
                            {minutes.content && typeof minutes.content === 'object' && !Array.isArray(minutes.content) ? (
                                <div className="space-y-8">
                                    {/* Peserta Rapat */}
                                    {minutes.content.peserta_rapat && Array.isArray(minutes.content.peserta_rapat) && minutes.content.peserta_rapat.length > 0 && (
                                        <div>
                                            <h3 className="font-bold text-sm mb-2 text-slate-900">Peserta Rapat</h3>
                                            <ul className="list-disc pl-5 space-y-1.5">
                                                {minutes.content.peserta_rapat.map((peserta: string, idx: number) => (
                                                    <li key={idx} className="leading-relaxed text-slate-700">{peserta}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Latar Belakang */}
                                    {minutes.content.latar_belakang && (
                                        <div>
                                            <h3 className="font-bold text-sm mb-2 text-slate-900">Latar Belakang</h3>
                                            <p className="leading-relaxed text-slate-700">{minutes.content.latar_belakang}</p>
                                        </div>
                                    )}
                                    {minutes.content.pembukaan && !minutes.content.latar_belakang && (
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
                                    {minutes.action_items && minutes.action_items.length > 0 ? minutes.action_items.map((item: any) => (
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
                        </CardContent>
                    </Card>

                    {/* Dokumen Pendukung */}
                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-slate-100">
                            <CardTitle className="text-base font-semibold text-slate-900">Dokumen Pendukung</CardTitle>
                            {canManageReview && (
                                <div className="relative">
                                    <input 
                                        type="file" 
                                        id="document-upload" 
                                        className="hidden" 
                                        accept=".pdf,.txt"
                                        onChange={handleUploadDocument}
                                        disabled={uploadingDoc}
                                    />
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8 text-xs bg-white text-slate-700 hover:bg-slate-50"
                                        disabled={uploadingDoc}
                                        onClick={() => document.getElementById('document-upload')?.click()}
                                    >
                                        {uploadingDoc ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Upload className="w-3 h-3 mr-2" />}
                                        Upload
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            {meeting.documents && meeting.documents.length > 0 ? meeting.documents.map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-medium text-slate-900 truncate" title={doc.file_name}>{doc.file_name}</p>
                                            <p className="text-[10px] text-slate-500 uppercase">{doc.mime_type.split('/')[1] || 'FILE'} • {(doc.file_size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    {canManageReview && (
                                        <Button variant="ghost" size="icon" className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 h-8 w-8 shrink-0" onClick={() => handleDeleteDocument(doc.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center py-6 text-slate-500">
                                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-xs">Belum ada dokumen tambahan.</p>
                                </div>
                            )}
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
                                <p className="text-sm font-semibold text-slate-900">
                                    {minutes.reviewed_at ? new Date(minutes.reviewed_at).toLocaleString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).replace('.', ':') + ' WIB' : 'Belum direview'}
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] text-slate-500 mb-1">Status</p>
                                <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 shadow-none text-xs font-medium border-0">Siap Dikirim</Badge>
                            </div>


                        </CardContent>
                    </Card>

                    {/* Langkah Selanjutnya */}
                    {canManageReview && meeting.current_stage === 5 && !isPimpinan && (
                        <Alert className="bg-blue-50/80 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800/50 rounded-2xl backdrop-blur-sm">
                            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <AlertTitle className="text-blue-800 dark:text-blue-300 font-bold text-base ml-2">Langkah Selanjutnya</AlertTitle>
                            <AlertDescription className="text-blue-700 dark:text-blue-400/90 ml-2 mt-1 font-medium">
                                Jika notulen sudah sesuai, klik tombol <strong>"Kirim ke Pimpinan"</strong> di kanan atas untuk meminta persetujuan Pimpinan.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>

            {/* Edit Notulen Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Notulen Rapat</DialogTitle>
                    </DialogHeader>
                    {editData && (
                        <div className="space-y-6 py-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold">Peserta Rapat</Label>
                                    <Button variant="outline" size="sm" onClick={() => setEditData({...editData, peserta_rapat: [...(editData.peserta_rapat || []), '']})}>
                                        <Plus className="w-4 h-4 mr-2" /> Tambah Peserta
                                    </Button>
                                </div>
                                {editData.peserta_rapat?.map((peserta: string, idx: number) => (
                                    <div key={`p-${idx}`} className="flex gap-2 items-center">
                                        <div className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></div>
                                        <Input 
                                            value={peserta} 
                                            onChange={e => {
                                                const newData = [...editData.peserta_rapat];
                                                newData[idx] = e.target.value;
                                                setEditData({...editData, peserta_rapat: newData});
                                            }}
                                        />
                                        <Button variant="ghost" size="icon" className="text-rose-500 shrink-0" onClick={() => {
                                            const newData = [...editData.peserta_rapat];
                                            newData.splice(idx, 1);
                                            setEditData({...editData, peserta_rapat: newData});
                                        }}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label className="font-bold">Latar Belakang</Label>
                                <Textarea 
                                    value={editData.latar_belakang || editData.pembukaan || ''} 
                                    onChange={e => setEditData({...editData, latar_belakang: e.target.value, pembukaan: e.target.value})}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold">Pembahasan</Label>
                                    <Button variant="outline" size="sm" onClick={() => setEditData({...editData, pembahasan: [...(editData.pembahasan || []), {topik: '', narasi: ''}]})}>
                                        <Plus className="w-4 h-4 mr-2" /> Tambah Topik
                                    </Button>
                                </div>
                                {editData.pembahasan?.map((bahas: any, idx: number) => (
                                    <Card key={idx} className="p-4 relative">
                                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600" onClick={() => {
                                            const newBahas = [...editData.pembahasan];
                                            newBahas.splice(idx, 1);
                                            setEditData({...editData, pembahasan: newBahas});
                                        }}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <div className="space-y-3 pr-8">
                                            <div>
                                                <Label className="text-xs">Topik</Label>
                                                <Input 
                                                    value={bahas.topik || ''} 
                                                    onChange={e => {
                                                        const newBahas = [...editData.pembahasan];
                                                        newBahas[idx].topik = e.target.value;
                                                        setEditData({...editData, pembahasan: newBahas});
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Narasi</Label>
                                                <Textarea 
                                                    value={bahas.narasi || ''} 
                                                    onChange={e => {
                                                        const newBahas = [...editData.pembahasan];
                                                        newBahas[idx].narasi = e.target.value;
                                                        setEditData({...editData, pembahasan: newBahas});
                                                    }}
                                                    rows={3}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold">Keputusan</Label>
                                    <Button variant="outline" size="sm" onClick={() => setEditData({...editData, keputusan: [...(editData.keputusan || []), '']})}>
                                        <Plus className="w-4 h-4 mr-2" /> Tambah Keputusan
                                    </Button>
                                </div>
                                {editData.keputusan?.map((kep: string, idx: number) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <div className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></div>
                                        <Input 
                                            value={kep} 
                                            onChange={e => {
                                                const newKep = [...editData.keputusan];
                                                newKep[idx] = e.target.value;
                                                setEditData({...editData, keputusan: newKep});
                                            }}
                                        />
                                        <Button variant="ghost" size="icon" className="text-rose-500 shrink-0" onClick={() => {
                                            const newKep = [...editData.keputusan];
                                            newKep.splice(idx, 1);
                                            setEditData({...editData, keputusan: newKep});
                                        }}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditModalOpen(false)}>Batal</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={saveEdit} disabled={sending}>
                            {sending ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
