import { Head, useForm } from '@inertiajs/react';
import {
    Calendar,
    MapPin,
    Clock,
    Building,
    CheckCircle,
    Lock,
    AlertCircle,
} from 'lucide-react';
import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submit as submitRoute } from '@/routes/attend';

export default function PublicAttendance({
    meeting,
    flash,
    isOpen = true,
    closedReason,
}: any) {
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
    const errorMessage =
        flash?.error || (errors as any)?.general || errors?.guest_name;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-[#0b0f19]">
            <Head title={`Absensi: ${meeting.title}`} />

            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/60">
                        <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        eNotulen UMSU
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Sistem Manajemen Rapat & Notulensi
                    </p>
                </div>

                <Card className="border-blue-200/50 bg-white shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
                    <CardHeader className="border-b border-slate-200 pb-4 text-center dark:border-slate-800">
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                            {meeting.title}
                        </CardTitle>
                        <CardDescription className="font-semibold text-slate-600 dark:text-slate-300">
                            {!isOpen
                                ? 'Pemberitahuan Kehadiran'
                                : isSuccess
                                  ? 'Kehadiran Anda telah berhasil dicatat'
                                  : 'Silakan isi form absensi di bawah ini'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {!isOpen ? (
                            <div className="flex animate-in flex-col items-center justify-center space-y-4 py-4 text-center duration-500 fade-in zoom-in">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/60">
                                    <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Sesi Absensi Tidak Tersedia
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                        {closedReason ||
                                            'Sesi absensi untuk rapat ini tidak dapat menerima kehadiran saat ini.'}
                                    </p>
                                </div>
                                <div className="mt-2 w-full space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left text-sm dark:border-slate-800 dark:bg-slate-800/50">
                                    <div className="flex items-center gap-3 font-semibold text-slate-900 dark:text-slate-200">
                                        <Calendar className="h-4 w-4 shrink-0 text-blue-500" />
                                        <span>{meeting.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 font-semibold text-slate-900 dark:text-slate-200">
                                        <Clock className="h-4 w-4 shrink-0 text-blue-500" />
                                        <span>
                                            {meeting.start_time?.substring(
                                                0,
                                                5,
                                            )}{' '}
                                            -{' '}
                                            {meeting.end_time?.substring(0, 5)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 font-semibold text-slate-900 dark:text-slate-200">
                                        <MapPin className="h-4 w-4 shrink-0 text-blue-500" />
                                        <span>{meeting.location}</span>
                                    </div>
                                </div>
                            </div>
                        ) : isSuccess ? (
                            <div className="flex animate-in flex-col items-center justify-center space-y-4 py-6 text-center duration-500 fade-in zoom-in">
                                <CheckCircle className="h-16 w-16 text-emerald-500" />
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Absensi Berhasil!
                                    </h3>
                                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                                        Terima kasih sudah mengisi formulir
                                        absensi.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-800/50">
                                    <div className="flex items-center gap-3 font-semibold text-slate-900 dark:text-slate-200">
                                        <Calendar className="h-4 w-4 text-blue-500" />
                                        <span>{meeting.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 font-semibold text-slate-900 dark:text-slate-200">
                                        <Clock className="h-4 w-4 text-blue-500" />
                                        <span>
                                            {meeting.start_time?.substring(
                                                0,
                                                5,
                                            )}{' '}
                                            -{' '}
                                            {meeting.end_time?.substring(0, 5)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 font-semibold text-slate-900 dark:text-slate-200">
                                        <MapPin className="h-4 w-4 text-blue-500" />
                                        <span>{meeting.location}</span>
                                    </div>
                                </div>

                                {errorMessage && (
                                    <div className="mb-4 flex animate-in items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 fade-in dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="guest_name"
                                            className="font-semibold text-slate-900 dark:text-slate-200"
                                        >
                                            Nama (Lengkap dengan gelar)
                                        </Label>
                                        <Input
                                            id="guest_name"
                                            type="text"
                                            className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 placeholder:dark:text-slate-500"
                                            placeholder="Contoh: Dr. Budi Santoso, S.Kom., M.Kom."
                                            value={data.guest_name}
                                            onChange={(e) =>
                                                setData(
                                                    'guest_name',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors.guest_name && (
                                            <p className="text-sm text-red-500">
                                                {errors.guest_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="guest_unit_kerja"
                                            className="font-semibold text-slate-900 dark:text-slate-200"
                                        >
                                            Unit Kerja
                                        </Label>
                                        <Input
                                            id="guest_unit_kerja"
                                            type="text"
                                            className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 placeholder:dark:text-slate-500"
                                            placeholder="Contoh: Fakultas Teknik / Biro Administrasi"
                                            value={data.guest_unit_kerja}
                                            onChange={(e) =>
                                                setData(
                                                    'guest_unit_kerja',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors.guest_unit_kerja && (
                                            <p className="text-sm text-red-500">
                                                {errors.guest_unit_kerja}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="guest_institution"
                                            className="font-semibold text-slate-900 dark:text-slate-200"
                                        >
                                            Jabatan
                                        </Label>
                                        <Input
                                            id="guest_institution"
                                            type="text"
                                            className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 placeholder:dark:text-slate-500"
                                            placeholder="Contoh: Dosen / Staff IT"
                                            value={data.guest_institution}
                                            onChange={(e) =>
                                                setData(
                                                    'guest_institution',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors.guest_institution && (
                                            <p className="text-sm text-red-500">
                                                {errors.guest_institution}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Hadir / Submit'}
                                    </Button>
                                </form>
                            </>
                        )}
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} Universitas Muhammadiyah
                    Sumatera Utara
                </p>
            </div>
        </div>
    );
}

PublicAttendance.layout = (page: any) => <>{page}</>;
