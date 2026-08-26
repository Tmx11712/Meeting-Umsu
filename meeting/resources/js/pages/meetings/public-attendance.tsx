import { Head, useForm, usePage } from '@inertiajs/react';
import { Calendar, MapPin, Clock, Building, User, Mail, CheckCircle, Info } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submit as submitRoute } from '@/routes/attend';

export default function PublicAttendance({ meeting, flash }: any) {
    const { data, setData, post, processing, errors } = useForm({
        guest_name: '',
        guest_institution: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(submitRoute.url(meeting.id));
    };

    const isSuccess = flash?.success;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Head title={`Absensi: ${meeting.title}`} />
            
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-2">
                        <Building className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">eNotulen UMSU</h1>
                    <p className="text-slate-500 text-sm">Sistem Manajemen Rapat & Notulensi</p>
                </div>

                <Card className="border-blue-200/50 shadow-lg bg-white backdrop-blur">
                    <CardHeader className="text-center pb-4 border-b border-slate-200">
                        <CardTitle className="text-xl font-bold text-slate-900">{meeting.title}</CardTitle>
                        <CardDescription className="text-slate-900 font-semibold">Silakan isi form absensi di bawah ini</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-6">
                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                                <CheckCircle className="w-16 h-16 text-emerald-500" />
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Absensi Berhasil!</h3>
                                    <p className="text-slate-500 mt-1">Terima kasih sudah mengisi formulir absensi.</p>
                                </div>
                                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                                    Isi Absen Lagi
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-3 text-sm">
                                    <div className="flex items-center gap-3 text-slate-900 font-semibold">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span>{meeting.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-900 font-semibold">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <span>{meeting.start_time?.substring(0,5)} - {meeting.end_time?.substring(0,5)}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-900 font-semibold">
                                        <MapPin className="w-4 h-4 text-blue-500" />
                                        <span>{meeting.location}</span>
                                    </div>
                                </div>

                                <form onSubmit={submit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="guest_name" className="text-slate-900 font-semibold">Nama (Lengkap dengan gelar)</Label>
                                        <Input
                                            id="guest_name"
                                            type="text"
                                            className="text-slate-900 bg-white border-slate-300 placeholder:text-slate-400"
                                            placeholder="Contoh: Dr. Budi Santoso, S.Kom., M.Kom."
                                            value={data.guest_name}
                                            onChange={(e) => setData('guest_name', e.target.value)}
                                            required
                                        />
                                        {errors.guest_name && <p className="text-sm text-red-500">{errors.guest_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="guest_institution" className="text-slate-900 font-semibold">Jabatan</Label>
                                        <Input
                                            id="guest_institution"
                                            type="text"
                                            className="text-slate-900 bg-white border-slate-300 placeholder:text-slate-400"
                                            placeholder="Contoh: Dosen / Staff IT"
                                            value={data.guest_institution}
                                            onChange={(e) => setData('guest_institution', e.target.value)}
                                            required
                                        />
                                        {errors.guest_institution && <p className="text-sm text-red-500">{errors.guest_institution}</p>}
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11" 
                                        disabled={processing}
                                    >
                                        {processing ? 'Menyimpan...' : 'Hadir / Submit'}
                                    </Button>
                                </form>
                            </>
                        )}
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} Universitas Muhammadiyah Sumatera Utara
                </p>
            </div>
        </div>
    );
}

PublicAttendance.layout = (page: any) => <>{page}</>;
