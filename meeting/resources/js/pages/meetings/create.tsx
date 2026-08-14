import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, X, GripVertical, Check, CalendarDays, Clock, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function CreateMeeting({ users, meeting, upcomingMeetings = [], actionItems = [] }: { users: any[], meeting?: any, upcomingMeetings?: any[], actionItems?: any[] }) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: meeting?.title || '',
        type: meeting?.type || 'Rapat internal',
        date: meeting?.date || new Date().toISOString().split('T')[0],
        start_time: meeting?.start_time ? meeting.start_time.substring(0, 5) : '09:00',
        end_time: meeting?.end_time ? meeting.end_time.substring(0, 5) : '11:00',
        location: meeting?.location || 'Ruang Rapat A',
        participants: meeting?.participants?.map((p: any) => p.user_id) || [] as string[],
        agenda: meeting?.agenda || [] as string[],
        auto_record: meeting?.auto_record ?? true,
    });

    const [newAgenda, setNewAgenda] = useState('');

    const addAgenda = () => {
        if (newAgenda.trim() !== '') {
            setData('agenda', [...data.agenda, newAgenda]);
            setNewAgenda('');
        }
    };

    const removeAgenda = (index: number) => {
        setData('agenda', data.agenda.filter((_, i) => i !== index));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (meeting) {
            put(`/meetings/${meeting.id}`);
        } else {
            post('/meetings');
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-6 py-6 px-4 w-full max-w-7xl mx-auto">
            <Head title={meeting ? "Edit Jadwal Rapat" : "Buat Jadwal Rapat Baru"} />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[22px] font-semibold text-slate-900 dark:text-white mb-1">
                        {meeting ? "Edit jadwal rapat" : "Buat jadwal rapat baru"}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Lengkapi detail rapat dan undang peserta</p>
                </div>
                <div>
                    <Link href={meeting ? `/meetings/${meeting.id}` : "/meetings"}>
                        <Button variant="outline" className="rounded-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-9 px-4 font-medium text-[13px]">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Bagian Kiri: Form Input (Memakan 2 Kolom) */}
                <div className="lg:col-span-2">
                    <form onSubmit={submit}>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
                                
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="title" className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Judul rapat <span className="text-red-500">*</span></label>
                            <Input 
                                id="title" 
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="h-10 border-slate-200 bg-white rounded-lg text-sm"
                                required
                            />
                            {errors.title && <div className="text-red-500 text-xs">{errors.title}</div>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="type" className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Tipe rapat</label>
                            <Input 
                                id="type" 
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                                className="h-10 border-slate-200 bg-white rounded-lg text-sm"
                            />
                            {errors.type && <div className="text-red-500 text-xs">{errors.type}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="date" className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Tanggal <span className="text-red-500">*</span></label>
                            <Input 
                                id="date" 
                                type="date"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                className="h-10 border-slate-200 bg-white rounded-lg text-sm"
                                required
                            />
                            {errors.date && <div className="text-red-500 text-xs">{errors.date}</div>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="start_time" className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Jam mulai <span className="text-red-500">*</span></label>
                            <Input 
                                id="start_time" 
                                type="time"
                                value={data.start_time}
                                onChange={e => setData('start_time', e.target.value)}
                                className="h-10 border-slate-200 bg-white rounded-lg text-sm"
                                required
                            />
                            {errors.start_time && <div className="text-red-500 text-xs">{errors.start_time}</div>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="end_time" className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Jam selesai <span className="text-red-500">*</span></label>
                            <Input 
                                id="end_time" 
                                type="time"
                                value={data.end_time}
                                onChange={e => setData('end_time', e.target.value)}
                                className="h-10 border-slate-200 bg-white rounded-lg text-sm"
                                required
                            />
                            {errors.end_time && <div className="text-red-500 text-xs">{errors.end_time}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="location" className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Ruangan</label>
                            <Input 
                                id="location" 
                                value={data.location}
                                onChange={e => setData('location', e.target.value)}
                                className="h-10 border-slate-200 bg-white rounded-lg text-sm"
                            />
                        </div>
                    </div>



                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Agenda rapat</label>
                        <div className="flex flex-col gap-2">
                            {data.agenda.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-lg">
                                    <GripVertical className="w-4 h-4 text-slate-400 cursor-move shrink-0 ml-1" />
                                    <span className="flex-1 text-[13px] text-slate-700">{item}</span>
                                    <button type="button" onClick={() => removeAgenda(index)} className="p-1.5 text-slate-400 hover:text-red-500">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <div className="flex items-center gap-2 mt-1">
                                <Input 
                                    value={newAgenda}
                                    onChange={e => setNewAgenda(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAgenda(); } }}
                                    placeholder="Ketik agenda lalu tekan Enter..."
                                    className="h-10 border-slate-200 bg-white rounded-lg text-sm flex-1"
                                />
                                <Button type="button" onClick={addAgenda} variant="outline" className="h-10 px-4 rounded-lg border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium text-[13px]">
                                    Tambahkan
                                </Button>
                            </div>
                        </div>
                    </div>



                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Link href={meeting ? `/meetings/${meeting.id}` : "/meetings"}>
                        <Button variant="ghost" type="button" className="text-[13px] font-medium text-slate-600 hover:bg-slate-100 h-9 px-4 rounded-lg">Batal</Button>
                    </Link>
                    <Button 
                        type="submit" 
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-[13px] h-9 px-5 rounded-lg shadow-sm flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                        {meeting ? "Simpan Perubahan" : "Simpan & kirim undangan"}
                    </Button>
                        </div>
                    </form>
                </div>

                {/* Bagian Kanan: Sidebar Informasi (Memakan 1 Kolom) */}
                <div className="flex flex-col gap-6">
                    
                    {/* Action Items Mendesak */}
                    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
                        <div className="bg-amber-50/50 dark:bg-amber-900/20 border-b border-amber-100/50 dark:border-amber-800/30 px-5 py-4">
                            <h3 className="font-semibold text-amber-900 dark:text-amber-100 flex items-center text-[14px]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-amber-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                Action items mendesak
                            </h3>
                        </div>
                        <CardContent className="p-0">
                            {actionItems.length > 0 ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {actionItems.map((item: any) => {
                                        const isUrgent = item.deadline ? new Date(item.deadline) <= new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) : false;
                                        
                                        return (
                                            <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex gap-2.5 items-start">
                                                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isUrgent ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                                                        <div>
                                                            <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100 leading-snug">{item.description}</p>
                                                            <p className="text-[11px] text-slate-500 mt-1 flex items-center">
                                                                PIC: <span className="font-medium text-slate-700 dark:text-slate-300 ml-1">{item.pic || '-'}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={`text-[11px] font-medium shrink-0 ${isUrgent ? 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-md' : 'text-slate-500'}`}>
                                                        {item.deadline ? new Date(item.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Tidak ada'}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-slate-500 text-sm">
                                    Tidak ada action items mendesak.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Jadwal Mendatang */}
                    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
                        <div className="bg-blue-50/50 dark:bg-blue-900/20 border-b border-blue-100/50 dark:border-blue-800/30 px-5 py-4">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center text-[14px]">
                                <CalendarDays className="w-4 h-4 mr-2 text-blue-500" />
                                Jadwal Mendatang
                            </h3>
                        </div>
                        <CardContent className="p-0">
                            {upcomingMeetings.length > 0 ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {upcomingMeetings.map((m: any) => (
                                        <Link key={m.id} href={`/meetings/${m.id}`} className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <h4 className="font-semibold text-[13px] text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors truncate pr-3">
                                                    {m.title}
                                                </h4>
                                            </div>
                                            <div className="flex items-center text-[11px] text-slate-500 dark:text-slate-400 gap-3">
                                                <span className="flex items-center">
                                                    <CalendarDays className="w-3 h-3 mr-1 text-slate-400" />
                                                    {new Date(m.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </span>
                                                <span className="flex items-center">
                                                    <Clock className="w-3 h-3 mr-1 text-slate-400" />
                                                    {m.start_time ? m.start_time.substring(0, 5) : ''}
                                                </span>
                                                <span className="flex items-center">
                                                    <Users className="w-3 h-3 mr-1 text-slate-400" />
                                                    {m.participants_count || 0}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-slate-500 text-sm">
                                    Tidak ada jadwal mendatang.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
