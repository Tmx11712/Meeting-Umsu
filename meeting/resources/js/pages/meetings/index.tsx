import { Head, Link, router } from '@inertiajs/react';
import { Search, Filter, Calendar, Edit3, Trash2, QrCode, Download } from 'lucide-react';
import { useEffect, useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { QRCodeCanvas } from 'qrcode.react';
import { usePermissions } from '@/hooks/use-permissions';
import { confirmDelete } from '@/lib/sweetalert';
import { MeetingStatusBadge } from '@/components/meetings/MeetingStatusBadge';

export default function MeetingIndex({ meetings, filters }: any) {
    const { canEdit, guardAction } = usePermissions();
    const [qrMeeting, setQrMeeting] = useState<any>(null);

    const handleDownloadQR = () => {
        const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
        if (!canvas) return;
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_Absensi_${qrMeeting?.title?.replace(/\s+/g, '_') || 'Meeting'}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const handleSync = useCallback(() => {
        if (!guardAction('meeting', '')) {
            return;
        }

        // Ambil token CSRF Laravel
        const getXsrfToken = () => {
            const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));

            return match ? decodeURIComponent(match[2]) : '';
        };

        // Gunakan native fetch agar request berjalan murni di latar belakang
        // tanpa membatalkan navigasi pengguna atau menimpa state halaman lain.
        fetch('/meetings/sync', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getXsrfToken(),
                'Content-Type': 'application/json'
            }
        }).then(() => {
            router.reload({ only: ['meetings'] });
        }).catch(() => {});
    }, [guardAction]);

    useEffect(() => {
        // Automatically sync on load if user has permission
        if (canEdit('meeting')) {
            handleSync();
        }
    }, [canEdit, handleSync]);

    useEffect(() => {
        const channel = (window as any).Echo?.channel('meetings');
        
        if (channel) {
            channel.listen('MeetingsListUpdated', (e: any) => {
                console.log('Meetings list updated:', e);
                router.reload({ only: ['meetings'] });
            });
        }

        return () => {
            if (channel) {
                channel.stopListening('MeetingsListUpdated');
                (window as any).Echo?.leaveChannel('meetings');
            }
        };
    }, []);

    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const applyFilter = (key: string, value: string) => {
        const currentFilters = { ...filters, [key]: value };
        
        /**
         * [EDUKASI ARSITEKTUR: PARTIAL RELOADS INERTIA]
         * Saat filter/search diubah, kita me-request data ke backend.
         * Dengan `only: ['meetings']`, backend TIDAK akan merender seluruh halaman (navbar, sidebar).
         * Backend hanya mengirimkan potongan data 'meetings' berupa JSON.
         * Ini menghemat bandwidth secara drastis (SPA Experience).
         */
        router.get('/meetings', currentFilters, { 
            preserveState: true, 
            replace: true,
            preserveScroll: true,
            only: ['meetings']
        });
    };

    const handleSearchChange = (value: string) => {
        /**
         * [EDUKASI ARSITEKTUR: DEBOUNCING]
         * Mencegah server dibombardir request (DDoS) setiap kali tombol keyboard ditekan.
         * Request ke server HANYA akan dikirim jika user berhenti mengetik selama 300 milidetik.
         */
        if (searchTimeout.current) {
clearTimeout(searchTimeout.current);
}

        searchTimeout.current = setTimeout(() => {
            applyFilter('search', value);
        }, 300);
    };

    const monthOptions = Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

        return { value, label };
    });

    return (
        <div className="flex h-full flex-1 flex-col gap-4 py-2 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title="Jadwal Rapat" />
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                        Jadwal Rapat
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Daftar dan kelola jadwal rapat instansi</p>
                </div>
                <div className="flex gap-2">
                    {canEdit('meeting') && (
                        <Link href="/meetings/create">
                            <Button className="rounded-xl shadow-sm bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 border-0 h-11 px-5 text-white font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                Buat Rapat
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <Card className="rounded-2xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                    {/* Top Filters Bar */}
                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                type="search" 
                                placeholder="Cari judul rapat..." 
                                className="pl-9 w-full md:w-[320px] bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-sm focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl h-11 transition-all"
                                defaultValue={filters?.search || ''}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (searchTimeout.current) {
clearTimeout(searchTimeout.current);
}

                                        applyFilter('search', (e.target as HTMLInputElement).value);
                                    }
                                }}
                            />
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            <div className="relative shrink-0">
                                <select 
                                    className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 pl-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-500 appearance-none text-slate-700 dark:text-slate-300 w-40 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors"
                                    value={filters?.status || 'all'}
                                    onChange={(e) => applyFilter('status', e.target.value)}
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="terjadwal">Terjadwal</option>
                                    <option value="berlangsung">Berlangsung</option>
                                    <option value="review">Review</option>
                                    <option value="selesai">Selesai</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            
                            <div className="relative shrink-0">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                </div>
                                <select 
                                    className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 pl-9 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-500 appearance-none text-slate-700 dark:text-slate-300 w-45 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors"
                                    value={filters?.month || ''}
                                    onChange={(e) => applyFilter('month', e.target.value)}
                                >
                                    <option value="">Semua Bulan</option>
                                    {monthOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            <Button 
                                variant="outline" 
                                className="h-11 px-4 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 bg-white/60 dark:bg-slate-800/60 font-medium rounded-xl shrink-0 transition-colors"
                                onClick={() => router.get('/meetings', {}, { preserveState: false })}
                            >
                                <Filter className="w-4 h-4 mr-2 text-slate-500" /> Reset
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800/50 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-5 font-semibold">No</th>
                                    <th className="px-4 py-5 font-semibold">Judul Rapat</th>
                                    <th className="px-4 py-5 font-semibold">Tanggal</th>
                                    <th className="px-4 py-5 font-semibold">Waktu</th>
                                    <th className="px-4 py-5 font-semibold">Ruangan</th>
                                    <th className="px-4 py-5 font-semibold text-center">Peserta</th>
                                    <th className="px-4 py-5 font-semibold text-center">Status</th>
                                    <th className="px-4 py-5 font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {meetings?.data && meetings.data.length > 0 ? (
                                    meetings.data.map((meeting: any, index: number) => (
                                        <tr key={meeting.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                                            <td className="px-4 py-5 text-slate-500 dark:text-slate-400 font-medium">
                                                {((meetings.current_page - 1) * meetings.per_page) + index + 1}
                                            </td>
                                            <td className="px-4 py-5">
                                                <Link href={`/meetings/${meeting.id}`} className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {meeting.title}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-5 text-slate-600 dark:text-slate-300 font-medium">{meeting.date}</td>
                                            <td className="px-4 py-5 text-slate-600 dark:text-slate-300 font-medium bg-slate-50/50 dark:bg-slate-800/20">{meeting.start_time?.substring(0,5)} - {meeting.end_time?.substring(0,5)}</td>
                                            <td className="px-4 py-5 text-slate-600 dark:text-slate-300 max-w-50">
                                                <span className="block truncate" title={meeting.location}>{meeting.location}</span>
                                            </td>
                                            <td className="px-4 py-5 text-center text-slate-600 dark:text-slate-300 font-medium">
                                                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{meeting.participants_count ?? 0}</span>
                                            </td>
                                            <td className="px-4 py-5 text-center">
                                                <MeetingStatusBadge status={meeting.status} />
                                            </td>
                                            <td className="px-4 py-5 text-center">
                                                <div className="flex items-center justify-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <Link 
                                                        href={`/meetings/${meeting.id}`} 
                                                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                                                        onClick={(e) => {
                                                            if (!guardAction('meeting')) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>
                                                    <button 
                                                        className="p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-all"
                                                        onClick={() => setQrMeeting(meeting)}
                                                        title="Tampilkan QR Code"
                                                    >
                                                        <QrCode className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
                                                        onClick={async () => {
                                                            if (!guardAction('meeting')) {
return;
}

                                                            if (await confirmDelete(`Yakin ingin menghapus rapat "${meeting.title}"?`)) {
                                                                router.delete(`/meetings/${meeting.id}`, {
                                                                    preserveScroll: true,
                                                                    onSuccess: () => {
                                                                        handleSync();
                                                                    }
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                                                <Calendar className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" />
                                                <p className="font-medium">Belum ada data rapat.</p>
                                                <p className="text-sm mt-1">Buat rapat baru untuk mulai.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-5 border-t border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-900/30">
                        <div className="font-medium">
                            Menampilkan {meetings?.from ?? 0} – {meetings?.to ?? 0} dari {meetings?.total ?? 0} data
                        </div>
                        <div className="flex items-center gap-2">
                            {meetings?.links?.map((link: any, i: number) => {
                                const label = link.label
                                    .replace('&laquo; Previous', '←')
                                    .replace('Next &raquo;', '→');

                                return (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="icon"
                                        className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                                            link.active
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 bg-white/50 dark:bg-slate-800/50'
                                        } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, filters, { 
                                            preserveState: true,
                                            preserveScroll: true,
                                            only: ['meetings']
                                        })}
                                    >
                                        {label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={!!qrMeeting} onOpenChange={(open) => !open && setQrMeeting(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">QR Code Absensi</DialogTitle>
                        <DialogDescription className="text-center">
                            Scan QR Code ini menggunakan aplikasi UMSU Employee untuk mencatat kehadiran pada rapat.
                        </DialogDescription>
                    </DialogHeader>
                    {qrMeeting && (
                        <div className="flex flex-col items-center justify-center py-6 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <QRCodeCanvas 
                                    id="qr-code-canvas"
                                    value={`http://192.168.100.98:8000/attend/${qrMeeting.id}`} 
                                    size={250}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>
                            <div className="text-center space-y-1">
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{qrMeeting.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {qrMeeting.date} • {qrMeeting.start_time?.substring(0,5)} - {qrMeeting.end_time?.substring(0,5)}
                                </p>
                            </div>
                            <Button onClick={handleDownloadQR} className="mt-2" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Download QR Code
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
MeetingIndex.layout = () => ({
    breadcrumbs: [
        {
            title: 'eNotulen',
            href: '/dashboard',
        },
    ],
});
