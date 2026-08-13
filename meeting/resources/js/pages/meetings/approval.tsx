import { Head, Link, router, usePage } from '@inertiajs/react';
import { Download, FileText, CheckCircle2, Check, RotateCcw, Info, Edit3, Plus, Trash2 } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

import { MeetingInfoCard } from '@/components/meetings/MeetingInfoCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMeetingWebSocket } from '@/hooks/use-meeting-websocket';
import { usePermissions } from '@/hooks/use-permissions';
import type { Meeting } from '@/types/meeting';

export default function MeetingApproval({ meeting, ...props }: { meeting: Meeting, [key: string]: any }) {
    const minutes = meeting.minutes && meeting.minutes.length > 0 ? meeting.minutes[0] : null;
    const { auth } = usePage<any>().props;
    const { canEdit } = usePermissions();
    const canManageApproval = canEdit('approval');
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [notes, setNotes] = useState('');
    const participants = meeting.participants || [];
    
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [savingEdit, setSavingEdit] = useState(false);

    const [editActionModalOpen, setEditActionModalOpen] = useState(false);
    const [actionItemsData, setActionItemsData] = useState<any[]>([]);
    const [savingActionItems, setSavingActionItems] = useState(false);

    const formatReviewDate = (dateString?: string) => {
        if (!dateString) {
return '-';
}

        const d = new Date(dateString);
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');

        return `${day} ${month} ${year} ${hours}:${mins} WIB`;
    };

    useMeetingWebSocket(meeting?.id);

    const openEditModal = () => {
        if (minutes?.content) {
            setEditData(JSON.parse(JSON.stringify(minutes.content)));
        } else {
            setEditData({ pembukaan: '', pembahasan: [], keputusan: [] });
        }

        setEditModalOpen(true);
    };

    const saveEdit = () => {
        setSavingEdit(true);
        router.put(`/meetings/${meeting.id}/review`, { content: editData }, {
            onSuccess: () => {
                setEditModalOpen(false);
            },
            onFinish: () => setSavingEdit(false)
        });
    };

    const openActionItemsModal = () => {
        if (minutes?.action_items) {
            setActionItemsData(JSON.parse(JSON.stringify(minutes.action_items)));
        } else {
            setActionItemsData([]);
        }

        setEditActionModalOpen(true);
    };

    const saveActionItems = () => {
        setSavingActionItems(true);
        router.put(`/meetings/${meeting.id}/approval/action-items`, { action_items: actionItemsData }, {
            onSuccess: () => {
                setEditActionModalOpen(false);
            },
            onFinish: () => setSavingActionItems(false)
        });
    };

    const addActionItem = () => {
        setActionItemsData([...actionItemsData, { description: '', pic: '', deadline: '' }]);
    };

    const updateActionItem = (index: number, field: string, value: string) => {
        const newData = [...actionItemsData];
        newData[index][field] = value;
        setActionItemsData(newData);
    };

    const removeActionItem = (index: number) => {
        const newData = [...actionItemsData];
        newData.splice(index, 1);
        setActionItemsData(newData);
    };

    const handleApprove = () => {
        setApproving(true);
        router.post(`/meetings/${meeting.id}/approval`, { decision: 'approved', notes }, {
            onFinish: () => setApproving(false)
        });
    };

    const handleReject = () => {
        setRejecting(true);
        router.post(`/meetings/${meeting.id}/approval`, { decision: 'rejected', notes }, {
            onFinish: () => setRejecting(false)
        });
    };

    const total = participants.length > 0 ? participants.length : 12;
    const getPct = (num: number) => total > 0 ? ((num / total) * 100).toFixed(2) : '0.00';

    if (!minutes) {
        return (
            <div className="flex flex-col gap-4 py-2 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Head title="Pimpinan" />
                
                {/* Header & Breadcrumb */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                            Persetujuan Pimpinan
                        </h1>
                        <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                            <span>Dashboard</span>
                            <span>›</span>
                            <Link href="/meetings" className="hover:text-blue-600 transition-colors">Jadwal Rapat</Link>
                            <span>›</span>
                            <span className="text-blue-900 dark:text-blue-300 font-bold">Persetujuan Pimpinan</span>
                        </div>
                    </div>
                    <Button variant="outline" asChild className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 shadow-sm h-11">
                        <Link href="/meetings">
                            Kembali ke Jadwal
                        </Link>
                    </Button>
                </div>



                <div className="text-center py-20 text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    Notulen belum digenerate atau belum dikirim oleh operator.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-2 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title="Pimpinan" />
            
            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                        Persetujuan Pimpinan
                    </h1>
                    <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                        <span>Dashboard</span>
                        <span>›</span>
                        <Link href="/meetings" className="hover:text-blue-600 transition-colors">Jadwal Rapat</Link>
                        <span>›</span>
                        <span className="text-blue-900 dark:text-blue-300 font-bold">Persetujuan Pimpinan</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" asChild className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 shadow-sm h-11">
                        <Link href="/meetings">
                            Kembali ke Jadwal
                        </Link>
                    </Button>
                    {canManageApproval && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all h-11 px-4 font-semibold" onClick={handleApprove} disabled={approving || rejecting}>
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Setujui Notulen
                        </Button>
                    )}
                </div>
            </div>



            {!canManageApproval && (
                <Alert className="bg-rose-50/80 dark:bg-rose-900/30 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800/50 rounded-2xl backdrop-blur-sm">
                    <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    <AlertTitle className="text-rose-800 dark:text-rose-300 font-bold text-base ml-2">Mode Hanya Baca</AlertTitle>
                    <AlertDescription className="text-rose-700 dark:text-rose-400/90 ml-2 mt-1 font-medium">
                        Anda tidak memiliki izin untuk menyetujui notulen ini. Anda hanya dapat melihat data.
                    </AlertDescription>
                </Alert>
            )}

            {/* Top Row: 3 columns */}
            <div className="grid md:grid-cols-[1fr_1.5fr_1fr] gap-4">
                
                {/* Informasi Rapat */}
                <MeetingInfoCard 
                    meeting={meeting} 
                    totalParticipants={participants.length} 
                    showDetailButton={true} 
                    className="rounded-xl border-slate-200 shadow-sm"
                />

                {/* Status Notulen */}
                <Card className="rounded-xl border-slate-200 shadow-sm flex flex-col">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold text-slate-900">Status Notulen</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 flex gap-4 items-start">
                            <div className="bg-green-100 text-green-600 p-2 rounded-full shrink-0 mt-0.5">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-800 text-sm">Siap untuk Disetujui</h4>
                                <p className="text-xs text-green-700/80 mt-1 leading-relaxed">Notulen telah melalui proses lengkap dan siap untuk persetujuan.</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-auto px-4 py-2 border border-slate-100 rounded-lg bg-slate-50/50">
                            <div className="flex flex-col items-center">
                                <div className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center mb-1">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-900">Transkripsi</span>
                                <span className="text-[9px] text-green-600">Selesai</span>
                            </div>
                            <div className="h-px bg-slate-200 w-12"></div>
                            <div className="flex flex-col items-center">
                                <div className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center mb-1">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-900">Koreksi</span>
                                <span className="text-[9px] text-green-600">Selesai</span>
                            </div>
                            <div className="h-px bg-slate-200 w-12"></div>
                            <div className="flex flex-col items-center">
                                <div className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center mb-1">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-900">Absensi</span>
                                <span className="text-[9px] text-green-600">Selesai</span>
                            </div>
                            <div className="h-px bg-slate-200 w-12"></div>
                            <div className="flex flex-col items-center">
                                <div className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center mb-1">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-900">Review</span>
                                <span className="text-[9px] text-green-600">Selesai</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ringkasan Otomatis AI */}
                <Card className="rounded-xl border-slate-200 shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold text-slate-900">Ringkasan Otomatis (AI)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50/50 rounded-lg p-3 text-center border border-blue-100">
                                <p className="text-[11px] text-blue-700 font-medium mb-1">Topik Utama</p>
                                <p className="text-2xl font-bold text-blue-600">{minutes.ai_topics_count || 0}</p>
                                <p className="text-[10px] text-blue-500 mt-1">Topik</p>
                            </div>
                            <div className="bg-green-50/50 rounded-lg p-3 text-center border border-green-100">
                                <p className="text-[11px] text-green-700 font-medium mb-1">Keputusan</p>
                                <p className="text-2xl font-bold text-green-600">{minutes.ai_decisions_count || 0}</p>
                                <p className="text-[10px] text-green-500 mt-1">Keputusan Penting</p>
                            </div>
                            <div className="bg-yellow-50/50 rounded-lg p-3 text-center border border-yellow-100">
                                <p className="text-[11px] text-yellow-700 font-medium mb-1">Tindak Lanjut</p>
                                <p className="text-2xl font-bold text-yellow-600">{minutes.action_items?.length || 0}</p>
                                <p className="text-[10px] text-yellow-500 mt-1">Action Items</p>
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

            {/* Middle Row: 2 columns */}
            <div className="grid md:grid-cols-[1.5fr_1fr] gap-4">
                
                {/* Ringkasan Notulen */}
                <Card className="rounded-xl border-slate-200 shadow-sm flex flex-col">
                    <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base font-semibold flex items-center text-slate-900">
                            <FileText className="w-4 h-4 mr-2 text-slate-500" />
                            Ringkasan Notulen
                        </CardTitle>
                        {canManageApproval && (
                            <Button variant="outline" size="sm" onClick={openEditModal} className="h-8 shadow-sm">
                                <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Manual
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="p-4 flex-1 text-sm text-slate-800 space-y-6">
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

                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-sm text-slate-900">Tindak Lanjut</h3>
                                    {canManageApproval && (
                                        <Button variant="outline" size="sm" onClick={openActionItemsModal} className="h-7 text-xs shadow-sm">
                                            <Edit3 className="w-3 h-3 mr-1" /> Edit
                                        </Button>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {minutes.action_items && minutes.action_items.length > 0 ? minutes.action_items.map((item: any) => (
                                        <div className="flex gap-2" key={item.id}>
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            <p className="leading-relaxed text-sm">
                                                {item.description} (PIC: {item.pic}, Deadline: {item.deadline ? new Date(item.deadline).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'})
                                            </p>
                                        </div>
                                    )) : <div className="text-slate-500 italic text-sm">Tidak ada tindak lanjut.</div>}
                                </div>
                            </div>
                        </CardContent>
                </Card>

                {/* Right Column: Documents and Approval Box */}
                <div className="space-y-6">
                    
                    {/* Dokumen Notulen */}
                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold flex items-center text-slate-900">
                                <FileText className="w-4 h-4 mr-2 text-slate-500" />
                                Dokumen Notulen
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {meeting.documents && meeting.documents.length > 0 ? meeting.documents.map((doc: any) => (
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

                    {/* Persetujuan Pimpinan */}
                    <Card className="rounded-xl border-slate-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-slate-900">Persetujuan Pimpinan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                                <p className="text-[11px] text-green-700 leading-relaxed">
                                    Dengan menyetujui notulen ini, Anda menyatakan bahwa informasi dalam notulen telah sesuai dan dapat ditindaklanjuti.
                                </p>
                            </div>



                            {canManageApproval && (
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Button 
                                        variant="outline" 
                                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 h-10"
                                        onClick={handleReject}
                                        disabled={approving || rejecting}
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" /> Tolak & Kembalikan
                                    </Button>
                                    <Button 
                                        className="bg-green-600 hover:bg-green-700 text-white h-10"
                                        onClick={handleApprove}
                                        disabled={approving || rejecting}
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Setujui Notulen
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom Row Info Banner */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center px-4 mt-2">
                <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Info className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400">Dibuat oleh</p>
                        <p className="text-xs font-semibold text-slate-900 mt-0.5">{meeting.creator?.name || 'Sistem'} <span className="text-slate-500 font-normal">(Operator)</span></p>
                    </div>
                </div>
                
                <div className="w-px h-8 bg-slate-100"></div>
                
                <div>
                    <p className="text-[10px] text-slate-400">Tanggal Review</p>
                    <p className="text-xs font-semibold text-slate-900 mt-0.5">{formatReviewDate(minutes?.reviewed_at || minutes?.updated_at || meeting.updated_at)}</p>
                </div>
                
                <div className="w-px h-8 bg-slate-100"></div>
                
                <div className="pr-12">
                    <p className="text-[10px] text-slate-400">Versi</p>
                    <p className="text-xs font-semibold text-slate-900 mt-0.5">v1.0 (Final)</p>
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
                            <div className="space-y-2">
                                <Label className="font-bold">Pembukaan</Label>
                                <Textarea 
                                    value={editData.pembukaan || ''} 
                                    onChange={e => setEditData({...editData, pembukaan: e.target.value})}
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
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={saveEdit} disabled={savingEdit}>
                            {savingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Action Items Modal */}
            <Dialog open={editActionModalOpen} onOpenChange={setEditActionModalOpen}>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Tindak Lanjut</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {actionItemsData.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-3 items-start border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                                <div className="w-full space-y-3">
                                    <div>
                                        <Label className="text-xs">Tugas / Tindak Lanjut</Label>
                                        <Input 
                                            value={item.description || ''} 
                                            onChange={e => updateActionItem(index, 'description', e.target.value)}
                                            placeholder="Deskripsi tugas..."
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-xs">PIC</Label>
                                            <Input 
                                                value={item.pic || ''} 
                                                onChange={e => updateActionItem(index, 'pic', e.target.value)}
                                                placeholder="Nama PIC"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Deadline</Label>
                                            <Input 
                                                type="date"
                                                value={item.deadline ? item.deadline.substring(0,10) : ''} 
                                                onChange={e => updateActionItem(index, 'deadline', e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="text-red-500 hover:text-red-600 shrink-0 self-start mt-6"
                                    onClick={() => removeActionItem(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        {actionItemsData.length === 0 && (
                            <div className="text-center py-8 text-slate-500 italic border border-dashed rounded-lg">
                                Belum ada tindak lanjut.
                            </div>
                        )}
                        <Button variant="outline" onClick={addActionItem} className="w-full border-dashed border-2 py-6 text-slate-500 hover:text-slate-700">
                            <Plus className="w-4 h-4 mr-2" /> Tambah Tugas
                        </Button>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditActionModalOpen(false)}>Batal</Button>
                        <Button onClick={saveActionItems} disabled={savingActionItems} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {savingActionItems ? 'Menyimpan...' : 'Simpan Tindak Lanjut'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
