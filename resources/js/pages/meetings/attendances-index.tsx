import { Head, Link, usePage, router } from '@inertiajs/react';
import { Search, Calendar } from 'lucide-react';
import { useState, useRef } from 'react';
import { MeetingStatusBadge } from '@/components/meetings/MeetingStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usePermissions } from '@/hooks/use-permissions';

export default function MeetingIndex({ meetings, filters }: any) {
    const { auth } = usePage().props as any;
    const [syncing, setSyncing] = useState(false);
    const { guardAction, canEdit } = usePermissions();
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilter = (key: string, value: string) => {
        const currentFilters = { ...filters, [key]: value };
        router.get('/attendances', currentFilters, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            only: ['meetings', 'filters'],
        });
    };

    const handleSearchChange = (value: string) => {
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

    const handleSync = () => {
        if (!guardAction('meeting')) {
            return;
        }

        setSyncing(true);
        router.post('/meetings/sync', {}, {
            onFinish: () => setSyncing(false),
            preserveScroll: true,
        });
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 py-2 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title="Kelola Absensi" />
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                        Kelola Absensi
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Daftar rapat yang memerlukan pengelolaan absensi</p>
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
                                className="pl-9 w-75 bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-sm focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg h-10 text-slate-900 dark:text-slate-100 placeholder:dark:text-slate-400"
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
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                                <select 
                                    className="h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 pl-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-500 appearance-none text-slate-700 dark:text-slate-200 w-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    value={filters?.status || 'all'}
                                    onChange={(e) => applyFilter('status', e.target.value)}
                                >
                                    <option value="all" className="dark:bg-slate-900">Semua Status</option>
                                    <option value="terjadwal" className="dark:bg-slate-900">Terjadwal</option>
                                    <option value="berlangsung" className="dark:bg-slate-900">Berlangsung</option>
                                    <option value="review" className="dark:bg-slate-900">Review</option>
                                    <option value="selesai" className="dark:bg-slate-900">Selesai</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                </div>
                                <select 
                                    className="h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 pl-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-500 appearance-none text-slate-700 dark:text-slate-200 w-44 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    value={filters?.month || 'all'}
                                    onChange={(e) => applyFilter('month', e.target.value)}
                                >
                                    <option value="all" className="dark:bg-slate-900">Semua Bulan</option>
                                    {monthOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value} className="dark:bg-slate-900">
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60">
                                <tr>
                                    <th className="px-4 py-4 font-medium">No</th>
                                    <th className="px-4 py-4 font-medium">Judul Rapat</th>
                                    <th className="px-4 py-4 font-medium">Tanggal</th>
                                    <th className="px-4 py-4 font-medium">Waktu</th>
                                    <th className="px-4 py-4 font-medium">Ruangan</th>
                                    <th className="px-4 py-4 font-medium text-center">Peserta</th>
                                    <th className="px-4 py-4 font-medium text-center">Status</th>
                                    <th className="px-4 py-4 font-medium text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {meetings?.data && meetings.data.length > 0 ? (
                                    meetings.data.map((meeting: any, index: number) => (
                                        <tr key={meeting.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                                            <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                                                {(meetings.from ?? 1) + index}
                                            </td>
                                            <td className="px-4 py-4">
                                                <Link href={`/meetings/${meeting.id}/attendance`} className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {meeting.title}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{meeting.date || '-'}</td>
                                            <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                                                {meeting.start_time ? `${meeting.start_time.substring(0, 5)}${meeting.end_time ? ` - ${meeting.end_time.substring(0, 5)}` : ''}` : '-'}
                                            </td>
                                            <td className="px-4 py-4 text-slate-600 dark:text-slate-300 max-w-50"><span className="block truncate" title={meeting.location || '-'}>{meeting.location || '-'}</span></td>
                                            <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300">{meeting.participants_count ?? 0}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <MeetingStatusBadge status={meeting.status} category={meeting.category} />
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {canEdit('attendance') ? (
                                                    <Button asChild variant="outline" size="sm" className="h-8">
                                                        <Link href={`/meetings/${meeting.id}/attendance`}>
                                                            Kelola Absensi
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button asChild variant="secondary" size="sm" className="h-8">
                                                        <Link href={`/meetings/${meeting.id}/attendance`}>
                                                            Lihat Absensi
                                                        </Link>
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                                            Belum ada data rapat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-5 border-t border-slate-100 dark:border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <div>
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
                                        className={`w-8 h-8 rounded-md text-xs font-semibold transition-all ${
                                            link.active
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, filters, {
                                            preserveState: true,
                                            preserveScroll: true,
                                            only: ['meetings', 'filters'],
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
