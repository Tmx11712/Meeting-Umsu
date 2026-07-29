import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MeetingStepper } from '@/components/meeting-stepper';
import { Calendar, Clock, MapPin, Users, Eye, QrCode, Fingerprint, Search, Trash2, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

export default function MeetingAttendance({ meeting }: any) {
    const { canEdit } = usePermissions();
    const canManageAttendance = canEdit('attendance');
    const participants = meeting.participants || [];
    const attendances = meeting.attendances || [];
    const isIrvanCloud = meeting.source === 'irvan_cloud';
    const [qrCodeHtml, setQrCodeHtml] = useState<string | null>(null);
    const [loadingQr, setLoadingQr] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [deptFilter, setDeptFilter] = useState('Semua Departemen');

    const handleManualAttendance = (userId: string, status: string) => {
        router.post(`/meetings/${meeting.id}/attendance/manual`, {
            user_id: userId,
            status: status
        }, { preserveScroll: true });
    };

    const handleFinish = () => {
        router.post(`/meetings/${meeting.id}/attendance/finish`);
    };

    const generateQrCode = async () => {
        setLoadingQr(true);
        try {
            const res = await fetch(`/meetings/${meeting.id}/attendance/qr`);
            const data = await res.json();
            if (data.qr_code) {
                setQrCodeHtml(`data:image/svg+xml;base64,${data.qr_code}`);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingQr(false);
        }
    };

    const total = participants.length;
    const hadir = attendances.filter((a: any) => a.status === 'hadir').length;
    const terlambat = attendances.filter((a: any) => a.status === 'terlambat').length;
    const tidakHadir = total - hadir - terlambat;

    const getHadirPct = () => total > 0 ? ((hadir / total) * 100).toFixed(2) : '0.00';
    const getTerlambatPct = () => total > 0 ? ((terlambat / total) * 100).toFixed(2) : '0.00';
    const getTidakHadirPct = () => total > 0 ? ((tidakHadir / total) * 100).toFixed(2) : '0.00';

    const tableData = participants.map((p: any) => {
        const att = attendances.find((a: any) => a.user_id === p.user_id);
        return {
            id: p.id,
            name: p.user?.name,
            dept: p.user?.department || '-',
            job: p.user?.roles?.[0]?.name || '-',
            status: att ? (att.status === 'hadir' ? 'Hadir' : 'Terlambat') : 'Belum',
            time: att?.check_in_time ? new Date(att.check_in_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : '-',
            method: isIrvanCloud ? 'UMSU Employee App' : 'Manual'
        };
    });

    return (
        <div className="flex flex-col gap-6 p-8 max-w-[1400px] mx-auto w-full bg-[#f8fafc]">
            <Head title="Absensi" />
            
            {/* Header & Breadcrumb */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Absensi</h1>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                        <span>Dashboard</span>
                        <span>›</span>
                        <Link href="/meetings" className="hover:text-slate-900">Jadwal Rapat</Link>
                        <span>›</span>
                        <span className="text-slate-900">Absensi</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/meetings">Kembali ke Jadwal Rapat</Link>
                    </Button>
                    {canManageAttendance && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleFinish}>
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Simpan Absensi
                        </Button>
                    )}
                </div>
            </div>

            {/* Stepper */}
            <div className="bg-white px-2 py-1 rounded-xl">
                <MeetingStepper meeting={meeting} activeStage={5} />
            </div>

            {!canManageAttendance && (
                <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800 font-semibold">Mode Hanya Baca</AlertTitle>
                    <AlertDescription className="text-red-700">
                        Anda tidak memiliki izin untuk mengelola absensi rapat ini. Anda hanya dapat melihat data.
                    </AlertDescription>
                </Alert>
            )}

            {/* Top Cards Row */}
            <div className="grid md:grid-cols-[1.2fr_1.5fr_1fr] gap-6">
                
                {/* Informasi Rapat */}
                <Card className="rounded-xl border-slate-200 shadow-sm flex flex-col">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold flex items-center text-slate-900">
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md mr-2">
                                <Calendar className="w-4 h-4" />
                            </div>
                            Informasi Rapat
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 flex flex-col">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Judul Rapat</p>
                            <p className="font-semibold text-slate-900 text-base">{meeting.title}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 flex-1">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Tanggal</p>
                                <p className="text-sm font-medium flex items-center text-slate-700">
                                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                    {meeting.date || '4 Juni 2026'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Waktu</p>
                                <p className="text-sm font-medium flex items-center text-slate-700">
                                    <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                    {meeting.start_time ? `${meeting.start_time.substring(0,5)} - ${meeting.end_time?.substring(0,5)}` : '09:00 - 11:00'} WIB
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Ruangan / Lokasi</p>
                                <p className="text-sm font-medium flex items-center text-slate-700">
                                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                    {meeting.location || 'Rapat A - Lantai 3'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Total Peserta</p>
                                <p className="text-sm font-medium flex items-center text-slate-700">
                                    <Users className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                    {total} Orang
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 mt-auto">
                            <Eye className="w-4 h-4 mr-2" /> Lihat Detail Rapat
                        </Button>
                    </CardContent>
                </Card>

                {/* Ringkasan Absensi */}
                <Card className="rounded-xl border-slate-200 shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold text-slate-900">Ringkasan Absensi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-4 gap-3">
                            <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                                <p className="text-xs text-green-700 font-medium mb-1">Hadir</p>
                                <p className="text-2xl font-bold text-green-600">{hadir}</p>
                                <p className="text-[10px] text-green-600/80 mt-1">{getHadirPct()}%</p>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-100">
                                <p className="text-xs text-orange-700 font-medium mb-1">Terlambat</p>
                                <p className="text-2xl font-bold text-orange-500">{terlambat}</p>
                                <p className="text-[10px] text-orange-500/80 mt-1">{getTerlambatPct()}%</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
                                <p className="text-xs text-red-700 font-medium mb-1">Tidak Hadir</p>
                                <p className="text-2xl font-bold text-red-500">{tidakHadir}</p>
                                <p className="text-[10px] text-red-500/80 mt-1">{getTidakHadirPct()}%</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                                <p className="text-xs text-blue-700 font-medium mb-1">Total Peserta</p>
                                <p className="text-2xl font-bold text-blue-600">{total}</p>
                                <p className="text-[10px] text-transparent mt-1">-</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            {/* Fake Donut Chart */}
                            <div className="relative w-28 h-28">
                                <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                                    <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="20" fill="none" />
                                    <circle cx="50" cy="50" r="40" stroke="#22c55e" strokeWidth="20" fill="none" strokeDasharray={`${hadir/total*251} 251`} />
                                    <circle cx="50" cy="50" r="40" stroke="#f59e0b" strokeWidth="20" fill="none" strokeDasharray={`${terlambat/total*251} 251`} strokeDashoffset={`-${hadir/total*251}`} />
                                    <circle cx="50" cy="50" r="40" stroke="#ef4444" strokeWidth="20" fill="none" strokeDasharray={`${tidakHadir/total*251} 251`} strokeDashoffset={`-${(hadir+terlambat)/total*251}`} />
                                    <circle cx="50" cy="50" r="25" fill="white" />
                                </svg>
                            </div>

                            <div className="space-y-3 flex-1 ml-8">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                        <span className="text-slate-700">Hadir</span>
                                    </div>
                                    <span className="font-medium text-slate-900">{hadir} ({getHadirPct()}%)</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                                        <span className="text-slate-700">Terlambat</span>
                                    </div>
                                    <span className="font-medium text-slate-900">{terlambat} ({getTerlambatPct()}%)</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                        <span className="text-slate-700">Tidak Hadir</span>
                                    </div>
                                    <span className="font-medium text-slate-900">{tidakHadir} ({getTidakHadirPct()}%)</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Metode Absensi */}
                {!isIrvanCloud && (
                    <Card className="rounded-xl border-slate-200 shadow-sm bg-slate-50/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-slate-900">Metode Absensi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-white rounded-lg p-4 border border-slate-200 relative">
                                <Badge className="absolute top-4 right-4 bg-green-50 text-green-600 hover:bg-green-50 border-0 shadow-none">Aktif</Badge>
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="p-2 bg-slate-100 text-slate-600 rounded-md">
                                        <QrCode className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-slate-900">QR Code</h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Peserta dapat melakukan scan QR code untuk absensi.</p>
                                    </div>
                                </div>
                                {qrCodeHtml ? (
                                    <div className="mt-4 flex flex-col items-center">
                                        <div className="p-2 bg-white rounded border border-slate-200 mb-2">
                                            <img src={qrCodeHtml} alt="QR Code Absensi" className="w-32 h-32" />
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={generateQrCode} disabled={loadingQr || !canManageAttendance} className="text-xs">
                                            {loadingQr ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null} Perbarui
                                        </Button>
                                    </div>
                                ) : (
                                    <Button 
                                        variant="outline" 
                                        className="w-max text-blue-600 border-blue-200 hover:bg-blue-50 text-xs h-8 mt-2"
                                        onClick={generateQrCode}
                                        disabled={loadingQr || !canManageAttendance}
                                    >
                                        {loadingQr ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : null}
                                        Tampilkan QR Code
                                    </Button>
                                )}
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-slate-200">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="p-2 bg-slate-100 text-slate-600 rounded-md">
                                        <Fingerprint className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-slate-900">Manual</h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Absensi dilakukan secara manual oleh operator.</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-max text-blue-600 border-blue-200 hover:bg-blue-50 text-xs h-8" disabled={!canManageAttendance}>
                                    Input Manual
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Bottom Section */}
            <div className="grid md:grid-cols-[1fr_300px] gap-6">
                
                {/* Table Area */}
                <div className="flex flex-col gap-4">
                    {/* Filters */}
                    <div className="flex gap-4">
                        <div className="relative flex-1 bg-white rounded-lg border border-slate-200">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Cari nama atau departemen..." 
                                className="w-full h-10 pl-9 pr-4 text-sm bg-transparent border-0 focus:ring-0"
                            />
                        </div>
                        <select className="h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none w-40">
                            <option>Semua Status</option>
                            <option>Hadir</option>
                            <option>Terlambat</option>
                        </select>
                        <select className="h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none w-48">
                            <option>Semua Departemen</option>
                            <option>Direksi</option>
                            <option>Keuangan</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                                    <tr>
                                        <th className="py-3 px-4 font-medium">No</th>
                                        <th className="py-3 px-4 font-medium">Nama Peserta</th>
                                        <th className="py-3 px-4 font-medium">Departemen</th>
                                        <th className="py-3 px-4 font-medium">Jabatan</th>
                                        <th className="py-3 px-4 font-medium">Status</th>
                                        <th className="py-3 px-4 font-medium">Waktu Absensi</th>
                                        <th className="py-3 px-4 font-medium">Metode</th>
                                        {!isIrvanCloud && <th className="py-3 px-4 font-medium text-right">Aksi</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tableData.map((row: any, i: number) => (
                                        <tr key={row.id} className="hover:bg-slate-50/50">
                                            <td className="py-3 px-4 text-slate-600">{i+1}</td>
                                            <td className="py-3 px-4 font-semibold text-slate-900">{row.name}</td>
                                            <td className="py-3 px-4 text-slate-600">{row.dept}</td>
                                            <td className="py-3 px-4 text-slate-600">{row.job}</td>
                                            <td className="py-3 px-4">
                                                <Badge variant="outline" className={`font-medium ${
                                                    row.status === 'Hadir' ? 'bg-green-50 text-green-600 border-green-200' : 
                                                    row.status === 'Terlambat' ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                                                    'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                    {row.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">{row.time}</td>
                                            <td className="py-3 px-4 text-slate-600">{row.method}</td>
                                            {!isIrvanCloud && (
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                                                            onClick={() => handleManualAttendance(row.user_id, 'hadir')}
                                                            disabled={row.status === 'Hadir' || !canManageAttendance}
                                                        >
                                                            Hadir
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            className="h-8 text-red-500 border-red-200 hover:bg-red-50"
                                                            onClick={() => handleManualAttendance(row.user_id, 'tidak_hadir')}
                                                            disabled={row.status === 'Belum' || row.status === 'Tidak Hadir' || !canManageAttendance}
                                                        >
                                                            Alpha
                                                        </Button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div className="p-4 border-t border-slate-100 flex items-center justify-between mt-auto bg-slate-50/50">
                            <span className="text-sm text-slate-500">Menampilkan 1 - 5 dari 12 peserta</span>
                            <div className="flex gap-1">
                                <Button variant="outline" size="icon" className="w-8 h-8 rounded-md bg-white border-slate-200 text-slate-400">
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="w-8 h-8 rounded-md bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white">
                                    1
                                </Button>
                                <Button variant="outline" size="icon" className="w-8 h-8 rounded-md bg-white border-slate-200 text-slate-600 hover:bg-slate-50">
                                    2
                                </Button>
                                <Button variant="outline" size="icon" className="w-8 h-8 rounded-md bg-white border-slate-200 text-slate-600 hover:bg-slate-50">
                                    3
                                </Button>
                                <Button variant="outline" size="icon" className="w-8 h-8 rounded-md bg-white border-slate-200 text-slate-600 hover:bg-slate-50">
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl border-slate-200 shadow-sm bg-white">
                        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <Users className="w-4 h-4 text-red-500" />
                                Peserta Tidak Hadir (1)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                                        6
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Admin Utama</p>
                                        <p className="text-[11px] text-slate-500">IT Support</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-[10px] h-5">
                                    Tidak Hadir
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-slate-200 shadow-sm bg-white flex-1 flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-slate-900">Catatan (opsional)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                            {!canManageAttendance && (
                                <div className="mb-2 p-2 bg-amber-50 text-amber-700 text-xs rounded border border-amber-200">
                                    Mode read-only: Anda tidak memiliki akses untuk mengubah catatan.
                                </div>
                            )}
                            <textarea 
                                className="w-full flex-1 min-h-[120px] p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                placeholder="Tulis catatan absensi jika diperlukan..."
                                disabled={!canManageAttendance}
                            ></textarea>
                            <p className="text-[10px] text-slate-400 text-right mt-2">0 / 500 karakter</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Success Banner */}
            <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                    <h4 className="text-sm font-semibold text-green-800">Absensi berhasil diperbarui</h4>
                    <p className="text-xs text-green-700 mt-0.5">Terakhir diperbarui oleh {meeting?.attendances?.[0]?.user?.name || 'Sistem'}</p>
                </div>
            </div>

        </div>
    );
}
