import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Users, Eye, QrCode, Fingerprint, Search, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MeetingStepper } from '@/components/meeting-stepper';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePermissions } from '@/hooks/use-permissions';
import { useMeetingWebSocket } from '@/hooks/use-meeting-websocket';
import { MeetingInfoCard } from '@/components/meetings/MeetingInfoCard';
import { Meeting } from '@/types/meeting';

export default function MeetingAttendance({ meeting, attendanceRecords, qrcode, signaturePath, hasSigned, total, present }: { meeting: Meeting, [key: string]: any }) {
    const { canEdit, hasRole } = usePermissions();
    const { flash } = usePage().props as any;
    const canManageAttendance = canEdit('attendance');

    useMeetingWebSocket(meeting?.id);
    const participants = meeting.participants || [];
    const attendances = meeting.attendances || [];
    const isIrvanCloud = meeting.source === 'irvan_cloud';
    const [qrCodeHtml, setQrCodeHtml] = useState<string | null>(null);
    const [loadingQr, setLoadingQr] = useState(false);

    // States for filtering
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [deptFilter, setDeptFilter] = useState('Semua Departemen');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Realtime polling specifically for IrvanCloud (UMSU Employee) QR Scans
    useEffect(() => {
        if (!isIrvanCloud) return;

        const interval = setInterval(async () => {
            try {
                // Use fetch to silently pull latest data from IrvanCloud without triggering Inertia loading bar
                await fetch(`/meetings/${meeting.id}/attendance/sync`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': (document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                    }
                });

                // Then reload the page data silently
                router.reload({ only: ['meeting'] });
            } catch (e) {
                console.error("Failed to sync attendance from IrvanCloud", e);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isIrvanCloud, meeting.id]);

    // Removed polling in favor of true real-time WebSockets via useMeetingWebSocket

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

    const totalParticipants = participants.length;
    const hadir = attendances.filter((a: any) => a.status === 'hadir').length;
    const terlambat = attendances.filter((a: any) => a.status === 'terlambat').length;
    const tidakHadir = totalParticipants - hadir - terlambat;

    const getHadirPct = () => totalParticipants > 0 ? ((hadir / totalParticipants) * 100).toFixed(2) : '0.00';
    const getTerlambatPct = () => totalParticipants > 0 ? ((terlambat / totalParticipants) * 100).toFixed(2) : '0.00';
    const getTidakHadirPct = () => totalParticipants > 0 ? ((tidakHadir / totalParticipants) * 100).toFixed(2) : '0.00';

    // Map table data and fix user_id & status bugs
    const tableData = participants.map((p: any) => {
        const att = attendances.find((a: any) => a.user_id === p.user_id);
        const statusLabel = att
            ? (att.status === 'hadir' ? 'Hadir' : att.status === 'terlambat' ? 'Terlambat' : 'Tidak Hadir')
            : 'Belum';

        return {
            id: p.id,
            user_id: p.user_id, // Fix Bug #1: Ensure user_id is mapped
            name: p.user?.name,
            dept: p.user?.department || '-',
            job: p.user?.roles?.[0]?.name || '-',
            nip: p.user?.nip || '-', // Added NIP
            status: statusLabel, // Fix Bug #2: Handle 'tidak_hadir'
            time_in: att?.check_in_time ? new Date(att.check_in_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
            time_out: att?.check_out_time ? new Date(att.check_out_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
            method: isIrvanCloud ? 'UMSU Employee App' : 'Manual'
        };
    });

    // Extract unique departments for filter
    const departments = ['Semua Departemen', ...Array.from(new Set<string>(tableData.map((d: any) => d.dept)))].filter(d => d !== '-');

    // Filter table data
    const filteredData = tableData.filter((row: any) => {
        const matchSearch = row.name?.toLowerCase().includes(searchQuery.toLowerCase()) || row.dept?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'Semua Status' || row.status === statusFilter;
        const matchDept = deptFilter === 'Semua Departemen' || row.dept === deptFilter;

        return matchSearch && matchStatus && matchDept;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);

    // Sidebar: Peserta Tidak Hadir/Belum
    const unrecordedParticipants = tableData.filter((r: any) => r.status === 'Belum' || r.status === 'Tidak Hadir');

    return (
        <div className="flex flex-col gap-4 py-2 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title="Absensi Peserta" />

            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400 mb-2">
                        Absensi Peserta
                    </h1>
                    <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                        <span>Dashboard</span>
                        <span>›</span>
                        <Link href="/meetings" className="hover:text-blue-600 transition-colors">Jadwal Rapat</Link>
                        <span>›</span>
                        <span className="text-blue-900 dark:text-blue-300 font-bold">Absensi Peserta</span>
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
                <MeetingStepper meeting={meeting} activeStage={5} />
            </div>

            {!canManageAttendance && (
                <Alert className="bg-rose-50/80 dark:bg-rose-900/30 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800/50 rounded-2xl backdrop-blur-sm">
                    <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    <AlertTitle className="text-rose-800 dark:text-rose-300 font-bold text-base ml-2">Mode Hanya Baca</AlertTitle>
                    <AlertDescription className="text-rose-700 dark:text-rose-400/90 ml-2 mt-1 font-medium">
                        Anda tidak memiliki izin untuk mengelola absensi rapat ini. Anda hanya dapat melihat data.
                    </AlertDescription>
                </Alert>
            )}

            {/* Success Banner (Fix Bug #7: Show only when there is flash success) */}
            {flash?.success && (
                <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-4 flex items-start gap-3 backdrop-blur-sm shadow-soft">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-emerald-800">Berhasil</h4>
                        <p className="text-xs text-emerald-700 mt-0.5">{flash.success}</p>
                    </div>
                </div>
            )}

            {/* Top Cards Row */}
            <div className={isIrvanCloud ? "grid md:grid-cols-[1.2fr_1.5fr] gap-4" : "grid md:grid-cols-[1.2fr_1.5fr_1fr] gap-4"}>

                {/* Informasi Rapat */}
                <MeetingInfoCard
                    meeting={meeting}
                    totalParticipants={totalParticipants}
                    showDetailButton={true}
                    className="border-white/50 bg-glass backdrop-blur-xl"
                />

                {/* Ringkasan Absensi */}
                <Card className="rounded-2xl border-white/50 shadow-soft bg-glass backdrop-blur-xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">Ringkasan Absensi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-4 gap-2">
                            <div className="bg-emerald-50/60 rounded-lg py-1.5 px-2 text-center border border-emerald-100/50 shadow-sm backdrop-blur-sm flex flex-col justify-center">
                                <p className="text-[10px] text-emerald-700 font-medium">Hadir</p>
                                <p className="text-lg font-bold text-emerald-600 leading-none mt-0.5">{hadir}</p>
                            </div>
                            <div className="bg-amber-50/60 rounded-lg py-1.5 px-2 text-center border border-amber-100/50 shadow-sm backdrop-blur-sm flex flex-col justify-center">
                                <p className="text-[10px] text-amber-700 font-medium">Terlambat</p>
                                <p className="text-lg font-bold text-amber-500 leading-none mt-0.5">{terlambat}</p>
                            </div>
                            <div className="bg-rose-50/60 rounded-lg py-1.5 px-2 text-center border border-rose-100/50 shadow-sm backdrop-blur-sm flex flex-col justify-center">
                                <p className="text-[10px] text-rose-700 font-medium">Tidak Hadir</p>
                                <p className="text-lg font-bold text-rose-500 leading-none mt-0.5">{tidakHadir}</p>
                            </div>
                            <div className="bg-blue-50/60 rounded-lg py-1.5 px-2 text-center border border-blue-100/50 shadow-sm backdrop-blur-sm flex flex-col justify-center">
                                <p className="text-[10px] text-blue-700 font-medium">Total</p>
                                <p className="text-lg font-bold text-blue-600 leading-none mt-0.5">{totalParticipants}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-start gap-6 px-2 mt-2">
                            {/* Fake Donut Chart */}
                            <div className="relative w-24 h-24 drop-shadow-sm shrink-0">
                                <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                                    <circle cx="50" cy="50" r="40" stroke="rgba(241, 245, 249, 0.5)" strokeWidth="20" fill="none" />
                                    <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="20" fill="none" strokeDasharray={`${hadir / totalParticipants * 251 || 0} 251`} />
                                    <circle cx="50" cy="50" r="40" stroke="#f59e0b" strokeWidth="20" fill="none" strokeDasharray={`${terlambat / totalParticipants * 251 || 0} 251`} strokeDashoffset={`-${hadir / totalParticipants * 251 || 0}`} />
                                    <circle cx="50" cy="50" r="40" stroke="#f43f5e" strokeWidth="20" fill="none" strokeDasharray={`${tidakHadir / totalParticipants * 251 || 0} 251`} strokeDashoffset={`-${(hadir + terlambat) / totalParticipants * 251 || 0}`} />
                                    <circle cx="50" cy="50" r="25" fill="rgba(255, 255, 255, 0.5)" />
                                </svg>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-2 w-24">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div>
                                        <span className="text-slate-700 dark:text-slate-300">Hadir</span>
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-white">{hadir} ({getHadirPct()}%)</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-2 w-24">
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-200"></div>
                                        <span className="text-slate-700 dark:text-slate-300">Terlambat</span>
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-white">{terlambat} ({getTerlambatPct()}%)</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-2 w-24">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200"></div>
                                        <span className="text-slate-700 dark:text-slate-300">Tidak Hadir</span>
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-white">{tidakHadir} ({getTidakHadirPct()}%)</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Metode Absensi */}
                {!isIrvanCloud && (
                    <Card className="rounded-2xl border-white/50 shadow-soft bg-glass backdrop-blur-xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">Metode Absensi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-sm relative">
                                <Badge className="absolute top-4 right-4 bg-emerald-50/80 text-emerald-600 hover:bg-emerald-100/80 border border-emerald-200/50 shadow-none backdrop-blur-sm">Aktif</Badge>
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="p-2 bg-slate-100/80 text-slate-600 rounded-lg shadow-sm">
                                        <QrCode className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white">QR Code</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Peserta dapat melakukan scan QR code untuk absensi.</p>
                                    </div>
                                </div>
                                {qrCodeHtml ? (
                                    <div className="mt-4 flex flex-col items-center">
                                        <div className="p-2 bg-white rounded-xl border border-slate-200/60 shadow-sm mb-2">
                                            <img src={qrCodeHtml} alt="QR Code Absensi" className="w-32 h-32" />
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={generateQrCode} disabled={loadingQr || !canManageAttendance} className="text-xs">
                                            {loadingQr ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null} Perbarui
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="w-max text-blue-600 border-blue-200/60 hover:bg-blue-50/50 bg-white/50 backdrop-blur-sm text-xs h-8 mt-2 rounded-lg"
                                        onClick={generateQrCode}
                                        disabled={loadingQr || !canManageAttendance}
                                    >
                                        {loadingQr ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : null}
                                        Tampilkan QR Code
                                    </Button>
                                )}
                            </div>

                            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-sm">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="p-2 bg-slate-100/80 text-slate-600 rounded-lg shadow-sm">
                                        <Fingerprint className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Manual</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Absensi dilakukan secara manual oleh operator.</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-max text-blue-600 border-blue-200/60 hover:bg-blue-50/50 bg-white/50 backdrop-blur-sm text-xs h-8 rounded-lg" disabled={!canManageAttendance}>
                                    Input Manual
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Bottom Section */}
            <div className="grid md:grid-cols-[1fr_300px] gap-4">

                {/* Table Area */}
                <div className="flex flex-col gap-4">
                    {/* Filters (Fix Bug #6: Make filters work) */}
                    <div className="flex flex-wrap md:flex-nowrap gap-4">
                        <div className="relative flex-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-xl border border-white/50 shadow-soft">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama atau departemen..."
                                className="w-full h-10 pl-9 pr-4 text-sm bg-transparent border-0 focus:ring-0 outline-none rounded-xl"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <select
                            className="h-10 px-3 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 shadow-soft rounded-xl text-sm text-slate-700 outline-none w-40"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option>Semua Status</option>
                            <option>Belum</option>
                            <option>Hadir</option>
                            <option>Terlambat</option>
                            <option>Tidak Hadir</option>
                        </select>
                        <select
                            className="h-10 px-3 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 shadow-soft rounded-xl text-sm text-slate-700 outline-none w-48"
                            value={deptFilter}
                            onChange={(e) => {
                                setDeptFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            {departments.map((d, i) => <option key={i}>{d}</option>)}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="bg-glass rounded-2xl border border-white/50 shadow-soft backdrop-blur-xl overflow-hidden flex-1 flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white/40 dark:bg-slate-800/40 border-b border-white/20 text-slate-500 font-medium backdrop-blur-md">
                                    <tr>
                                        <th className="py-4 px-4 font-medium">No</th>
                                        <th className="py-4 px-4 font-medium">Nama Peserta</th>
                                        <th className="py-4 px-4 font-medium">Departemen</th>
                                        <th className="py-4 px-4 font-medium">NIP</th>
                                        <th className="py-4 px-4 font-medium">Masuk</th>
                                        <th className="py-4 px-4 font-medium">Keluar</th>
                                        <th className="py-4 px-4 font-medium">Status</th>
                                        <th className="py-4 px-4 font-medium">Metode</th>
                                        {!isIrvanCloud && <th className="py-4 px-4 font-medium text-right">Aksi</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/20">
                                    {currentData.length > 0 ? currentData.map((row: any, i: number) => (
                                        <tr key={row.id} className="hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{startIndex + i}</td>
                                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{row.name}</td>
                                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.dept}</td>
                                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs">{row.nip}</td>
                                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.time_in}</td>
                                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.time_out}</td>
                                            <td className="py-3 px-4">
                                                <Badge variant="outline" className={`font-medium border shadow-sm backdrop-blur-sm ${row.status === 'Hadir' ? 'bg-emerald-50/80 text-emerald-600 border-emerald-200/60' :
                                                        row.status === 'Terlambat' ? 'bg-amber-50/80 text-amber-600 border-amber-200/60' :
                                                            row.status === 'Tidak Hadir' ? 'bg-rose-50/80 text-rose-600 border-rose-200/60' :
                                                                'bg-slate-100/80 text-slate-600 border-slate-200/60'
                                                    }`}>
                                                    {row.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.method}</td>
                                            {!isIrvanCloud && (
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 text-emerald-600 border-emerald-200/60 hover:bg-emerald-50/80 bg-white/50 backdrop-blur-sm shadow-sm rounded-lg"
                                                            onClick={() => handleManualAttendance(row.user_id, 'hadir')}
                                                            disabled={row.status === 'Hadir' || !canManageAttendance}
                                                        >
                                                            Hadir
                                                        </Button>
                                                        {/* Fix Bug #3: Disable Alpha if it's already 'Tidak Hadir' or 'Hadir' */}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 text-rose-500 border-rose-200/60 hover:bg-rose-50/80 bg-white/50 backdrop-blur-sm shadow-sm rounded-lg"
                                                            onClick={() => handleManualAttendance(row.user_id, 'tidak_hadir')}
                                                            disabled={row.status === 'Tidak Hadir' || row.status === 'Hadir' || !canManageAttendance}
                                                        >
                                                            Alpha
                                                        </Button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400">
                                                Tidak ada data yang sesuai filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination (Fix Bug #5: Dynamic calculations) */}
                        {filteredData.length > 0 && (
                            <div className="p-4 border-t border-white/20 flex items-center justify-between mt-auto bg-white/20 dark:bg-slate-800/20 backdrop-blur-md">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    Menampilkan {startIndex} - {endIndex} dari {filteredData.length} peserta
                                </span>
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline" size="icon"
                                        className="w-8 h-8 rounded-lg bg-white/60 border-slate-200/50 text-slate-600"
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>

                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <Button
                                            key={i}
                                            variant="outline" size="icon"
                                            className={`w-8 h-8 rounded-lg ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/60 border-slate-200/50 text-slate-600 hover:bg-slate-50/80'}`}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline" size="icon"
                                        className="w-8 h-8 rounded-lg bg-white/60 border-slate-200/50 text-slate-600"
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-4">

                    {/* Action Buttons */}
                    {canManageAttendance && meeting.current_stage === 4 && (
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-xl transition-all h-12 font-bold text-base mt-2 shadow-blue-200 dark:shadow-blue-900/20" onClick={handleFinish}>
                            <CheckCircle2 className="w-5 h-5 mr-2" /> Simpan Absensi & Lanjut
                        </Button>
                    )}
                    {canManageAttendance && meeting.current_stage > 4 && (
                        <Button asChild className="w-full bg-slate-800 hover:bg-slate-900 text-white shadow-lg rounded-xl transition-all h-12 font-bold text-base mt-2">
                            <Link href={`/meetings/${meeting.id}/review`}>
                                Lanjut ke Review Notulen
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
