import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, X, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateMeeting({ users, meeting }: { users: any[], meeting?: any }) {
    /**
     * [EDUKASI ARSITEKTUR: REACT & INERTIA.JS FORMS]
     * Komponen ini menggunakan `useForm` dari Inertia.js untuk mengelola state form (data, errors, processing).
     * Dengan Inertia.js, kita tidak perlu membuat fetch/axios request secara manual.
     * Fungsi `post('/meetings')` atau `put(...)` akan otomatis mengirim data ke Laravel, 
     * dan merender ulang halaman jika berhasil atau menampilkan error validasi tanpa refresh!
     */
    const { data, setData, post, put, processing, errors } = useForm({
        title: meeting?.title || '',
        type: meeting?.type || 'Rapat internal',
        category: meeting?.category || 'biasa',
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
        setData('agenda', data.agenda.filter((_: any, i: number) => i !== index));
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
        <div className="flex h-full flex-1 flex-col gap-6 py-6 px-4 w-full max-w-5xl mx-auto">
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
                            {errors.location && <div className="text-red-500 text-xs">{errors.location}</div>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="category" className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Kategori rapat</label>
                            <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                <SelectTrigger className="h-10 border-slate-200 bg-white rounded-lg text-sm">
                                    <SelectValue placeholder="Pilih kategori (Opsional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="biasa">Biasa</SelectItem>
                                    <SelectItem value="jadwal_mendatang">Jadwal Mendatang</SelectItem>
                                    <SelectItem value="action_item_mendesak">Action Items Mendesak</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.category && <div className="text-red-500 text-xs">{errors.category}</div>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Agenda rapat</label>
                        <div className="flex flex-col gap-2">
                            {data.agenda.map((item: string, index: number) => (
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
                                    onKeyDown={e => {
 if (e.key === 'Enter') {
 e.preventDefault(); addAgenda(); 
} 
}}
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
    );
}
