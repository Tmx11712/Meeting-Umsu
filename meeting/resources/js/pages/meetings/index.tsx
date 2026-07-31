import { Head, Link, router } from '@inertiajs/react';
import { Search, Filter, Calendar, Edit3, Trash2 } from 'lucide-react';
import { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usePermissions } from '@/hooks/use-permissions';
import { confirmDelete } from '@/lib/sweetalert';

export default function MeetingIndex({ meetings, filters }: any) {
    const { canEdit, guardAction } = usePermissions();
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'berlangsung': return 'bg-emerald-100/50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 font-semibold';
            case 'selesai': return 'bg-emerald-100/50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 font-semibold';
            case 'terjadwal': return 'bg-indigo-100/50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800 font-semibold';
            case 'review': return 'bg-orange-100/50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800 font-semibold';
            default: return 'bg-slate-100/50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-semibold';
        }
    };

    const handleSync = useCallback(() => {
        if (!guardAction('meeting', '')) {
            return;
        }

        router.post('/meetings/sync', {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['meetings', 'flash']
        });
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

    const applyFilter = (key: string, value: string) => {
        router.get('/meetings', { ...filters, [key]: value }, { preserveState: true, replace: true });
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
        <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title="Jadwal Rapat" />
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 mb-1">
                        Jadwal Rapat
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Daftar dan kelola jadwal rapat instansi</p>
                </div>
            </div>

            <Card className="rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                    {/* Top Filters Bar */}
                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                type="search" 
                                placeholder="Cari judul rapat..." 
                                className="pl-9 w-full md:w-[320px] bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-xl h-11 transition-all"
                                defaultValue={filters?.search || ''}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        applyFilter('search', (e.target as HTMLInputElement).value);
                                    }
                                }}
                            />
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            <div className="relative shrink-0">
                                <select 
                                    className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 pl-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-indigo-500 appearance-none text-slate-700 dark:text-slate-300 w-[160px] cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors"
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
                                    className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 pl-9 pr-10 text-sm outline-none focus:ring-1 focus:ring-indigo-500 appearance-none text-slate-700 dark:text-slate-300 w-[180px] cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors"
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
                                    <th className="px-6 py-5 font-semibold">No</th>
                                    <th className="px-6 py-5 font-semibold">Judul Rapat</th>
                                    <th className="px-6 py-5 font-semibold">Tanggal</th>
                                    <th className="px-6 py-5 font-semibold">Waktu</th>
                                    <th className="px-6 py-5 font-semibold">Ruangan</th>
                                    <th className="px-6 py-5 font-semibold text-center">Peserta</th>
                                    <th className="px-6 py-5 font-semibold text-center">Status</th>
                                    <th className="px-6 py-5 font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {meetings?.data && meetings.data.length > 0 ? (
                                    meetings.data.map((meeting: any, index: number) => (
                                        <tr key={meeting.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                                            <td className="px-6 py-5 text-slate-500 dark:text-slate-400 font-medium">
                                                {((meetings.current_page - 1) * meetings.per_page) + index + 1}
                                            </td>
                                            <td className="px-6 py-5">
                                                <Link href={`/meetings/${meeting.id}`} className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {meeting.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-5 text-slate-600 dark:text-slate-300 font-medium">{meeting.date}</td>
                                            <td className="px-6 py-5 text-slate-600 dark:text-slate-300 font-medium bg-slate-50/50 dark:bg-slate-800/20">{meeting.start_time?.substring(0,5)} - {meeting.end_time?.substring(0,5)}</td>
                                            <td className="px-6 py-5 text-slate-600 dark:text-slate-300 max-w-[200px]">
                                                <span className="block truncate" title={meeting.location}>{meeting.location}</span>
                                            </td>
                                            <td className="px-6 py-5 text-center text-slate-600 dark:text-slate-300 font-medium">
                                                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{meeting.participants?.length ?? 0}</span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs border ${getStatusColor(meeting.status || 'terjadwal')} shadow-sm`}>
                                                    {(meeting.status || 'Terjadwal').charAt(0).toUpperCase() + (meeting.status || 'terjadwal').slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex items-center justify-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <Link 
                                                        href={`/meetings/${meeting.id}`} 
                                                        className="p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                                                        onClick={(e) => {
                                                            if (!guardAction('meeting')) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>
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
                                        <td colSpan={8} className="px-6 py-16 text-center">
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
                                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 bg-white/50 dark:bg-slate-800/50'
                                        } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, filters, { preserveState: true })}
                                    >
                                        {label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
