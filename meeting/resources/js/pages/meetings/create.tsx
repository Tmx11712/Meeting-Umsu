import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, X, GripVertical, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function CreateMeeting({ users }: { users: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        type: 'Rapat internal',
        date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '11:00',
        location: 'Ruang Rapat A',
        participants: [] as string[],
        agenda: [] as string[],
        auto_record: true,
    });

    const [searchUser, setSearchUser] = useState('');
    const [newAgenda, setNewAgenda] = useState('');

    const filteredUsers = users.filter(u => 
        (u.name.toLowerCase().includes(searchUser.toLowerCase()) || 
        (u.department && u.department.toLowerCase().includes(searchUser.toLowerCase()))) &&
        !data.participants.includes(u.id)
    );

    const toggleParticipant = (userId: string) => {
        if (data.participants.includes(userId)) {
            setData('participants', data.participants.filter(id => id !== userId));
        } else {
            setData('participants', [...data.participants, userId]);
            setSearchUser('');
        }
    };

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
        post('/meetings');
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-6 py-6 px-4 w-full max-w-5xl mx-auto">
            <Head title="Buat Jadwal Rapat Baru" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[22px] font-semibold text-slate-900 dark:text-white mb-1">
                        Buat jadwal rapat baru
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Lengkapi detail rapat dan undang peserta</p>
                </div>
                <div>
                    <Link href="/meetings">
                        <Button variant="outline" className="rounded-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-9 px-4 font-medium text-[13px]">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                        </Button>
                    </Link>
                </div>
            </div>

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
                        
                        <div className="flex flex-col gap-1.5 relative">
                            <label htmlFor="participants" className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Cari peserta</label>
                            <Input 
                                id="participants" 
                                value={searchUser}
                                onChange={e => setSearchUser(e.target.value)}
                                placeholder="Ketik nama atau departemen..."
                                className="h-10 border-slate-200 bg-white rounded-lg text-sm"
                            />
                            {searchUser && filteredUsers.length > 0 && (
                                <div className="absolute top-[68px] left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                    {filteredUsers.map(u => (
                                        <div 
                                            key={u.id} 
                                            className="px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                                            onClick={() => toggleParticipant(u.id)}
                                        >
                                            <div className="w-6 h-6 rounded bg-[#f3faf7] text-[#057a55] flex items-center justify-center text-[10px] font-bold shrink-0">{u.initials}</div>
                                            <div className="flex-1 truncate text-[13px]">{u.name}</div>
                                            <div className="text-[11px] text-slate-500">{u.department}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Peserta terpilih ({data.participants.length} orang)</label>
                        <div className="flex flex-wrap gap-2 min-h-[42px] p-2 bg-slate-50 border border-slate-100 rounded-lg">
                            {data.participants.map(id => {
                                const user = users.find(u => u.id === id);
                                return user ? (
                                    <div key={id} className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-[6px] text-[13px] shadow-sm">
                                        <span>{user.name}</span>
                                        <button type="button" onClick={() => toggleParticipant(id)} className="text-slate-400 hover:text-red-500 flex items-center justify-center">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : null;
                            })}
                            {data.participants.length === 0 && <span className="text-[13px] text-slate-400 p-1">Belum ada peserta</span>}
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

                    <div className="flex items-center gap-2 mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <Checkbox 
                            id="auto_record" 
                            checked={data.auto_record}
                            onCheckedChange={(checked) => setData('auto_record', checked as boolean)}
                            className="border-slate-300 text-blue-600 rounded-sm"
                        />
                        <label htmlFor="auto_record" className="text-[13px] text-slate-700 cursor-pointer">
                            Aktifkan rekaman & transkripsi otomatis saat rapat dimulai
                        </label>
                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Link href="/meetings">
                        <Button variant="ghost" type="button" className="text-[13px] font-medium text-slate-600 hover:bg-slate-100 h-9 px-4 rounded-lg">Batal</Button>
                    </Link>
                    <Button 
                        type="submit" 
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-[13px] h-9 px-5 rounded-lg shadow-sm"
                    >
                        Simpan draft
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-[13px] h-9 px-5 rounded-lg shadow-sm flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                        Simpan & kirim undangan
                    </Button>
                </div>
            </form>
        </div>
    );
}
