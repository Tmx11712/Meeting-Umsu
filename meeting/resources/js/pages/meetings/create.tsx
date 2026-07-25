import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Search, ChevronRight, ChevronLeft, Save, Users } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function MeetingCreate({ users, meeting }: any) {
    const isEdit = !!meeting;
    const { data, setData, post, put, processing, errors } = useForm({
        title: meeting?.title || '',
        description: meeting?.description || '',
        date: meeting?.date || '',
        start_time: meeting?.start_time ? meeting.start_time.substring(0,5) : '',
        end_time: meeting?.end_time ? meeting.end_time.substring(0,5) : '',
        location: meeting?.location || '',
        type: meeting?.type || 'internal',
        notes: meeting?.notes || '',
        participants: meeting?.participants ? meeting.participants.map((p: any) => p.user_id) : [],
    });

    const [searchLeft, setSearchLeft] = useState('');
    const [selectedLeft, setSelectedLeft] = useState<number[]>([]);
    const [selectedRight, setSelectedRight] = useState<number[]>([]);

    const allUsers = users || [];

    const availableUsers = useMemo(() => {
        return allUsers.filter((u: any) => !data.participants.includes(u.id) && 
            (u.name.toLowerCase().includes(searchLeft.toLowerCase()) || 
             (u.department && u.department.toLowerCase().includes(searchLeft.toLowerCase()))));
    }, [allUsers, data.participants, searchLeft]);

    const chosenUsers = useMemo(() => {
        return allUsers.filter((u: any) => data.participants.includes(u.id));
    }, [allUsers, data.participants]);

    const toggleLeft = (id: number) => {
        setSelectedLeft(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleRight = (id: number) => {
        setSelectedRight(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const moveToRight = () => {
        setData('participants', [...data.participants, ...selectedLeft]);
        setSelectedLeft([]);
    };

    const moveToLeft = () => {
        setData('participants', data.participants.filter((id: number) => !selectedRight.includes(id)));
        setSelectedRight([]);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/meetings/${meeting.id}`);
        } else {
            post('/meetings');
        }
    };

    // Calculate duration
    let durationStr = '--:--';
    if (data.start_time && data.end_time) {
        const start = new Date(`2000-01-01T${data.start_time}`);
        const end = new Date(`2000-01-01T${data.end_time}`);
        if (end > start) {
            const diffMs = end.getTime() - start.getTime();
            const diffHrs = Math.floor(diffMs / 3600000);
            const diffMins = Math.floor((diffMs % 3600000) / 60000);
            durationStr = `${diffHrs} Jam ${diffMins > 0 ? diffMins + ' Menit' : ''}`.trim();
        }
    }

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-8 max-w-[1400px] mx-auto w-full bg-[#f8fafc]">
            <Head title={isEdit ? "Edit Rapat" : "Buat Rapat"} />
            
            {/* Header & Breadcrumb */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">{isEdit ? "Edit Rapat" : "Buat Rapat"}</h1>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                        <span>Jadwal Rapat</span>
                        <span>›</span>
                        <span className="text-slate-900">{isEdit ? "Edit Rapat" : "Buat Rapat"}</span>
                    </div>
                </div>
                <Button variant="outline" asChild className="text-slate-600">
                    <Link href="/meetings">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Jadwal Rapat
                    </Link>
                </Button>
            </div>

            <form onSubmit={submit}>
                <Card className="rounded-xl border-slate-200 shadow-sm bg-white overflow-visible">
                    <CardContent className="p-8 space-y-8">
                        
                        {/* Informasi Rapat */}
                        <div>
                            <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center">
                                Informasi Rapat
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Judul Rapat <span className="text-red-500">*</span></Label>
                                    <Input 
                                        placeholder="Masukkan judul rapat" 
                                        className="h-10 border-slate-200"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        required
                                    />
                                    {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Deskripsi (opsional)</Label>
                                    <Textarea 
                                        placeholder="Masukkan deskripsi rapat" 
                                        className="h-[84px] resize-none border-slate-200"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-6 mt-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Tanggal <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Input 
                                            type="date" 
                                            className="h-10 border-slate-200 pr-10"
                                            value={data.date}
                                            onChange={e => setData('date', e.target.value)}
                                            required
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Waktu Mulai <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Input 
                                            type="time" 
                                            className="h-10 border-slate-200 pr-10"
                                            value={data.start_time}
                                            onChange={e => setData('start_time', e.target.value)}
                                            required
                                        />
                                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Waktu Selesai <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Input 
                                            type="time" 
                                            className="h-10 border-slate-200 pr-10"
                                            value={data.end_time}
                                            onChange={e => setData('end_time', e.target.value)}
                                            required
                                        />
                                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Durasi</Label>
                                    <Input 
                                        className="h-10 border-slate-200 bg-slate-50 text-slate-500"
                                        value={durationStr}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Ruangan / Lokasi <span className="text-red-500">*</span></Label>
                                    <Input 
                                        placeholder="Masukkan ruangan atau lokasi rapat" 
                                        className="h-10 border-slate-200"
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Tipe Rapat</Label>
                                    <select 
                                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                    >
                                        <option value="internal">Internal</option>
                                        <option value="eksternal">Eksternal</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Peserta Rapat */}
                        <div className="pt-2">
                            <Label className="text-slate-700 font-medium mb-3 block text-base">Peserta Rapat <span className="text-red-500">*</span></Label>
                            
                            <div className="flex flex-col md:flex-row items-stretch gap-4">
                                {/* Kiri: Pilih Peserta */}
                                <div className="flex-1 border border-slate-200 rounded-lg overflow-hidden flex flex-col h-[280px]">
                                    <div className="bg-slate-50 border-b border-slate-200 p-3 font-medium text-sm text-slate-700">
                                        Pilih Peserta
                                    </div>
                                    <div className="p-3 border-b border-slate-100">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input 
                                                placeholder="Cari nama atau departemen..." 
                                                className="h-9 pl-9 text-sm"
                                                value={searchLeft}
                                                onChange={e => setSearchLeft(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                        {availableUsers.map((u: any) => (
                                            <label key={u.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <input 
                                                        type="checkbox" 
                                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                        checked={selectedLeft.includes(u.id)}
                                                        onChange={() => toggleLeft(u.id)}
                                                    />
                                                    <span className="text-sm font-medium text-slate-700">{u.name}</span>
                                                </div>
                                                <span className="text-xs text-slate-500">{u.department || 'Umum'}</span>
                                            </label>
                                        ))}
                                        {availableUsers.length === 0 && (
                                            <div className="text-center py-8 text-sm text-slate-400">
                                                Semua pengguna telah dipilih atau tidak ditemukan.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tengah: Tombol Pindah */}
                                <div className="flex flex-col justify-center gap-3">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-9 w-9 text-slate-600"
                                        onClick={moveToRight}
                                        disabled={selectedLeft.length === 0}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-9 w-9 text-slate-600"
                                        onClick={moveToLeft}
                                        disabled={selectedRight.length === 0}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>
                                </div>

                                {/* Kanan: Peserta Terpilih */}
                                <div className="flex-1 border border-slate-200 rounded-lg overflow-hidden flex flex-col h-[280px]">
                                    <div className="bg-slate-50 border-b border-slate-200 p-3 font-medium text-sm text-slate-700 flex justify-between items-center">
                                        <span>Peserta Terpilih ({data.participants.length})</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                        {chosenUsers.length > 0 ? (
                                            chosenUsers.map((u: any) => (
                                                <label key={u.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <input 
                                                            type="checkbox" 
                                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                            checked={selectedRight.includes(u.id)}
                                                            onChange={() => toggleRight(u.id)}
                                                        />
                                                        <span className="text-sm font-medium text-slate-700">{u.name}</span>
                                                    </div>
                                                    <span className="text-xs text-slate-500">{u.department || 'Umum'}</span>
                                                </label>
                                            ))
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                                <div className="bg-slate-100 p-3 rounded-lg mb-3">
                                                    <Users className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <p className="text-sm font-semibold text-slate-600">Belum ada peserta terpilih</p>
                                                <p className="text-xs mt-1 text-slate-500">Pilih peserta dari daftar di samping</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Catatan Tambahan */}
                        <div className="pt-2">
                            <Label className="text-slate-700 font-medium mb-2 block text-base">Catatan Tambahan (opsional)</Label>
                            <Textarea 
                                placeholder="Masukkan catatan tambahan jika diperlukan" 
                                className="min-h-[100px] border-slate-200 resize-y"
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                            <Button type="button" variant="outline" className="border-slate-200" asChild>
                                <Link href="/meetings">Batal</Link>
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={processing}>
                                <Save className="w-4 h-4 mr-2" /> {isEdit ? "Simpan Perubahan" : "Simpan Rapat"}
                            </Button>
                        </div>
                        
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
