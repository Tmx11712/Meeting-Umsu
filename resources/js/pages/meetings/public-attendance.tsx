import { Head, useForm } from '@inertiajs/react';
import { Calendar, MapPin, Clock, Building, CheckCircle, Lock, AlertCircle } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submit as submitRoute } from '@/routes/attend';

export default function PublicAttendance({ meeting, flash, isOpen = true, closedReason }: any) {
    const { data, setData, post, processing, errors } = useForm({
        guest_name: '',
        guest_unit_kerja: '',
        guest_institution: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(submitRoute.url(meeting.id));
    };

    const isSuccess = flash?.success;
    const errorMessage = flash?.error || (errors as any)?.general || errors?.guest_name;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex flex-col items-center justify-center p-4">
            <Head title={`Absensi: ${meeting.title}`} />
            
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/60 mb-2">
                        <Building className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">eNotulen UMSU</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Sistem Manajemen Rapat & Notulensi</p>
                </div>

                <Card className="border-blue-200/50 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900/90 backdrop-blur">
                    <CardHeader className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">{meeting.title}</CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-300 font-semibold">
                            {!isOpen
                                ? 'Pemberitahuan Kehadiran'
                                : isSuccess
                                    ? 'Kehadiran Anda telah berhasil dicatat'
                                    : 'Silakan isi form absensi di bawah ini'}
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-6">
                        {!isOpen ? (
                            <div className="flex flex-col items-center justify-center py-4 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center">
                                    <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Sesi Absensi Tidak Tersedia</h3>
                                    <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm leading-relaxed max-w-xs mx-auto">
                                        {closedReason || 'Sesi absensi untuk rapat ini tidak dapat menerima kehadiran saat ini.'}
                                    </p>
                                </div>
                                <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mt-2 space-y-3 text-sm text-left border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-slate-200 font-semibold">
                                        <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                                        <span>{meeting.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-slate-200 font-semibold">
                                        <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                                        <span>{meeting.start_time?.substring(0, 5)} - {meeting.end_time?.substring(0, 5)}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-slate-200 font-semibold">
                                        <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                                        <span>{meeting.location}</span>
                                    </div>
                                </div>
                            </div>
                        ) : isSuccess ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                                <CheckCircle className="w-16 h-16 text-emerald-500" />
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Absensi Berhasil!</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Terima kasih sudah mengisi formulir absensi.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 space-y-3 text-sm border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-slate-200 font-semibold">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span>{meeting.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-slate-200 font-semibold">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <span>{meeting.start_time?.substring(0,5)} - {meeting.end_time?.substring(0,5)}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-slate-200 font-semibold">
                                        <MapPin className="w-4 h-4 text-blue-500" />
                                        <span>{meeting.location}</span>
                                    </div>
                                </div>

                                {errorMessage && (
                                    <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl p-3 flex items-start gap-2.5 text-sm text-red-700 dark:text-red-300 mb-4 animate-in fade-in">
                                        <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="guest_name" className="text-slate-900 dark:text-slate-200 font-semibold">Nama (Lengkap dengan gelar)</Label>
                                        <Input
                                            id="guest_name"
                                            type="text"
                                            className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 placeholder:text-slate-400 placeholder:dark:text-slate-500"
                                            placeholder="Contoh: Dr. Budi Santoso, S.Kom., M.Kom."
                                            value={data.guest_name}
                                            onChange={(e) => setData('guest_name', e.target.value)}
                                            required
                                        />
                                        {errors.guest_name && <p className="text-sm text-red-500">{errors.guest_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="guest_unit_kerja" className="text-slate-900 dark:text-slate-200 font-semibold">Unit Kerja</Label>
                                        <Input
                                            id="guest_unit_kerja"
                                            type="text"
                                            className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 placeholder:text-slate-400 placeholder:dark:text-slate-500"
                                            placeholder="Contoh: Fakultas Teknik / Biro Administrasi"
                                            value={data.guest_unit_kerja}
                                            onChange={(e) => setData('guest_unit_kerja', e.target.value)}
                                            required
                                        />
                                        {errors.guest_unit_kerja && <p className="text-sm text-red-500">{errors.guest_unit_kerja}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="guest_institution" className="text-slate-900 dark:text-slate-200 font-semibold">Jabatan</Label>
                                        <Input
                                            id="guest_institution"
                                            type="text"
                                            className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 placeholder:text-slate-400 placeholder:dark:text-slate-500"
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
