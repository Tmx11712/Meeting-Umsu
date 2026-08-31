import { MeetingStatusBadge } from '@/components/meetings/MeetingStatusBadge';
import { Head, Link } from '@inertiajs/react';
import { Search, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usePermissions } from '@/hooks/use-permissions';

export default function MeetingIndex({ meetings, filters }: any) {
    const { canEdit } = usePermissions();

    return (
        <div className="flex h-full flex-1 flex-col gap-4 py-2 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Head title="Koreksi Transkrip" />
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-sm backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                        Koreksi Transkrip
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Daftar rapat yang menunggu koreksi transkrip</p>
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
                                className="pl-9 w-75 bg-white border-slate-200 text-sm focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg h-10"
                                defaultValue={filters?.search || ''}
                            />
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <select 
                                    className="h-10 rounded-lg border border-slate-200 bg-white pl-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-500 appearance-none text-slate-700 w-40 cursor-pointer hover:bg-slate-50 transition-colors"
                                    defaultValue={filters?.status || 'all'}
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
                            
                            <div className="relative">
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                </div>
                                <select 
                                    className="h-10 rounded-lg border border-slate-200 bg-white pl-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-500 appearance-none text-slate-700 w-40 cursor-pointer hover:bg-slate-50 transition-colors"
                                    defaultValue="juni"
                                >
                                    <option value="juni">Juni 2026</option>
                                    <option value="mei">Mei 2026</option>
                                    <option value="april">April 2026</option>
                                </select>
                            </div>

                            <Button variant="outline" className="h-10 px-4 text-slate-700 border-slate-200 hover:bg-slate-50 font-medium">
                                <Filter className="w-4 h-4 mr-2 text-slate-500" /> Filter
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 bg-slate-50/50 border-b border-slate-100">
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
                            <tbody className="divide-y divide-slate-100">
                                {meetings?.data && meetings.data.length > 0 ? (
                                    meetings.data.map((meeting: any, index: number) => (
                                        <tr key={meeting.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-4 py-4 text-slate-500">{index + 1}</td>
                                            <td className="px-4 py-4">
                                                <Link href={`/meetings/${meeting.id}/correction`} className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {meeting.title}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4 text-slate-600">{meeting.date || '4 Jun 2026'}</td>
                                            <td className="px-4 py-4 text-slate-600">{meeting.start_time?.substring(0,5)} - {meeting.end_time?.substring(0,5)}</td>
                                            <td className="px-4 py-4 text-slate-600 max-w-50"><span className="block truncate" title={meeting.location || 'Rapat A - Lt. 3'}>{meeting.location || 'Rapat A - Lt. 3'}</span></td>
                                            <td className="px-4 py-4 text-center text-slate-600">{meeting.participants?.length || 12}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <MeetingStatusBadge status={meeting.status} category={meeting.category} />
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {canEdit('transcript') ? (
                                                    <Button asChild variant="outline" size="sm" className="h-8">
                                                        <Link href={`/meetings/${meeting.id}/correction`}>
                                                            Mulai Koreksi
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button asChild variant="secondary" size="sm" className="h-8">
                                                        <Link href={`/meetings/${meeting.id}/correction`}>
                                                            Lihat Transkrip
                                                        </Link>
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                                            Belum ada data rapat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-5 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                        <div>
                            Menampilkan 1 - {meetings?.data?.length || 0} dari {meetings?.total || 0} data
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-slate-200 text-slate-400 hover:text-slate-600" disabled>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                            </Button>
                            <Button variant="default" size="icon" className="w-8 h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white">
                                1
                            </Button>
                            <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-slate-200 text-slate-600 hover:bg-slate-50">
                                2
                            </Button>
                            <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-slate-200 text-slate-600 hover:bg-slate-50">
                                3
                            </Button>
                            <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-slate-200 text-slate-600 hover:bg-slate-50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </Button>
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
