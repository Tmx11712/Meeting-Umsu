import { Head, Link, router } from '@inertiajs/react';
import { Search, Calendar } from 'lucide-react';
import { useRef } from 'react';
import { MeetingStatusBadge } from '@/components/meetings/MeetingStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usePermissions } from '@/hooks/use-permissions';

export default function MeetingIndex({ meetings, filters }: any) {
    const { canEdit } = usePermissions();
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilter = (key: string, value: string) => {
        const currentFilters = { ...filters, [key]: value };
        router.get('/minutes', currentFilters, {
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
        const label = d.toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric',
        });

        return { value, label };
    });

    return (
        <div className="flex h-full w-full flex-1 animate-in flex-col gap-4 py-2 duration-700 fade-in slide-in-from-bottom-4">
            <Head title="Review Notulen" />

            {/* Header Section */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center dark:border-slate-800/60 dark:bg-slate-900/40">
                <div>
                    <h1 className="mb-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Review Notulen
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Daftar rapat yang menunggu proses review notulen
                    </p>
                </div>
            </div>

            <Card className="shadow-soft overflow-hidden rounded-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
                <CardContent className="p-0">
                    {/* Top Filters Bar */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center dark:border-slate-800/50">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="search"
                                placeholder="Cari judul rapat..."
                                className="h-10 w-75 rounded-lg border-slate-200 bg-white pl-9 text-sm text-slate-900 focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 placeholder:dark:text-slate-400"
                                defaultValue={filters?.search || ''}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (searchTimeout.current) {
                                            clearTimeout(searchTimeout.current);
                                        }

                                        applyFilter(
                                            'search',
                                            (e.target as HTMLInputElement)
                                                .value,
                                        );
                                    }
                                }}
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                                <select
                                    className="h-10 w-40 cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 transition-colors outline-none hover:bg-slate-50 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800"
                                    value={filters?.status || 'all'}
                                    onChange={(e) =>
                                        applyFilter('status', e.target.value)
                                    }
                                >
                                    <option
                                        value="all"
                                        className="dark:bg-slate-900"
                                    >
                                        Semua Status
                                    </option>
                                    <option
                                        value="terjadwal"
                                        className="dark:bg-slate-900"
                                    >
                                        Terjadwal
                                    </option>
                                    <option
                                        value="berlangsung"
                                        className="dark:bg-slate-900"
                                    >
                                        Berlangsung
                                    </option>
                                    <option
                                        value="review"
                                        className="dark:bg-slate-900"
                                    >
                                        Review
                                    </option>
                                    <option
                                        value="selesai"
                                        className="dark:bg-slate-900"
                                    >
                                        Selesai
                                    </option>
                                </select>
                                <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                                    <svg
                                        className="h-4 w-4 text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        ></path>
                                    </svg>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                </div>
                                <select
                                    className="h-10 w-44 cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 transition-colors outline-none hover:bg-slate-50 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800"
                                    value={filters?.month || 'all'}
                                    onChange={(e) =>
                                        applyFilter('month', e.target.value)
                                    }
                                >
                                    <option
                                        value="all"
                                        className="dark:bg-slate-900"
                                    >
                                        Semua Bulan
                                    </option>
                                    {monthOptions.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                            className="dark:bg-slate-900"
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-100 bg-slate-50/50 text-xs text-slate-500 dark:border-slate-800/60 dark:bg-slate-800/40 dark:text-slate-400">
                                <tr>
                                    <th className="px-4 py-4 font-medium">
                                        No
                                    </th>
                                    <th className="px-4 py-4 font-medium">
                                        Judul Rapat
                                    </th>
                                    <th className="px-4 py-4 font-medium">
                                        Tanggal
                                    </th>
                                    <th className="px-4 py-4 font-medium">
                                        Waktu
                                    </th>
                                    <th className="px-4 py-4 font-medium">
                                        Ruangan
                                    </th>
                                    <th className="px-4 py-4 text-center font-medium">
                                        Peserta
                                    </th>
                                    <th className="px-4 py-4 text-center font-medium">
                                        Status
                                    </th>
                                    <th className="px-4 py-4 text-center font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {meetings?.data && meetings.data.length > 0 ? (
                                    meetings.data.map(
                                        (meeting: any, index: number) => (
                                            <tr
                                                key={meeting.id}
                                                className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                            >
                                                <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                                                    {(meetings.from ?? 1) +
                                                        index}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Link
                                                        href={`/meetings/${meeting.id}/review`}
                                                        className="font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                                                    >
                                                        {meeting.title}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                                                    {meeting.date || '-'}
                                                </td>
                                                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                                                    {meeting.start_time
                                                        ? `${meeting.start_time.substring(0, 5)}${meeting.end_time ? ` - ${meeting.end_time.substring(0, 5)}` : ''}`
                                                        : '-'}
                                                </td>
                                                <td className="max-w-50 px-4 py-4 text-slate-600 dark:text-slate-300">
                                                    <span
                                                        className="block truncate"
                                                        title={
                                                            meeting.location ||
                                                            '-'
                                                        }
                                                    >
                                                        {meeting.location ||
                                                            '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300">
                                                    {meeting.participants_count ??
                                                        0}
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                                    <MeetingStatusBadge
                                                        status={meeting.status}
                                                        currentStage={
                                                            meeting.current_stage
                                                        }
                                                        category={
                                                            meeting.category
                                                        }
                                                    />
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    {canEdit('minutes') ? (
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8"
                                                        >
                                                            <Link
                                                                href={`/meetings/${meeting.id}/review`}
                                                            >
                                                                Mulai Review
                                                            </Link>
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            asChild
                                                            variant="secondary"
                                                            size="sm"
                                                            className="h-8"
                                                        >
                                                            <Link
                                                                href={`/meetings/${meeting.id}`}
                                                            >
                                                                Lihat Detail
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ),
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-4 py-12 text-center text-slate-500 dark:text-slate-400"
                                        >
                                            Belum ada data rapat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-5 text-sm text-slate-500 md:flex-row dark:border-slate-800/60 dark:text-slate-400">
                        <div>
                            Menampilkan {meetings?.from ?? 0} –{' '}
                            {meetings?.to ?? 0} dari {meetings?.total ?? 0} data
                        </div>
                        <div className="flex items-center gap-2">
                            {meetings?.links?.map((link: any, i: number) => {
                                const label = link.label
                                    .replace('&laquo; Previous', '←')
                                    .replace('Next &raquo;', '→');

                                return (
                                    <Button
                                        key={i}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="icon"
                                        className={`h-8 w-8 rounded-md text-xs font-semibold transition-all ${
                                            link.active
                                                ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                                        } ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`}
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url &&
                                            router.get(link.url, filters, {
                                                preserveState: true,
                                                preserveScroll: true,
                                                only: ['meetings', 'filters'],
                                            })
                                        }
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
