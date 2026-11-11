import { Head, Link } from '@inertiajs/react';
import { Download, Search, FileText } from 'lucide-react';
import { MeetingStatusBadge } from '@/components/meetings/MeetingStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formatDate = (dateStr: string) => {
    if (!dateStr) {
        return '';
    }

    try {
        const d = new Date(dateStr);

        return d.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return dateStr;
    }
};

export default function ReportIndex({ meetings, filters }: any) {
    return (
        <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
            <Head title="Laporan Notulen" />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Laporan Notulen
                    </h1>
                    <p className="text-muted-foreground">
                        Unduh laporan dan rekap rapat.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filter & Download</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        className="flex flex-wrap items-end gap-4"
                        action="/reports"
                        method="GET"
                    >
                        <div className="min-w-50 flex-1 space-y-2">
                            <label className="text-sm font-medium">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                defaultValue={filters.start_date || ''}
                            />
                        </div>
                        <div className="min-w-50 flex-1 space-y-2">
                            <label className="text-sm font-medium">
                                Tanggal Selesai
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                defaultValue={filters.end_date || ''}
                            />
                        </div>
                        <div className="min-w-50 flex-1 space-y-2">
                            <label className="text-sm font-medium">
                                Cari Isi Notulen
                            </label>
                            <input
                                type="text"
                                name="search"
                                placeholder="Kata kunci..."
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                defaultValue={filters.search || ''}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" variant="secondary">
                                <Search className="mr-2 h-4 w-4" /> Tampilkan
                            </Button>
                            <Button asChild>
                                <a
                                    href={`/reports/download?start_date=${encodeURIComponent(filters.start_date || '')}&end_date=${encodeURIComponent(filters.end_date || '')}&search=${encodeURIComponent(filters.search || '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Download className="mr-2 h-4 w-4" />{' '}
                                    Download PDF Rekap
                                </a>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 text-left">
                                <th className="p-4 font-medium">Judul Rapat</th>
                                <th className="p-4 font-medium">Tanggal</th>
                                <th className="p-4 font-medium">Ruangan</th>
                                <th className="p-4 text-center font-medium">
                                    Kehadiran
                                </th>
                                <th className="p-4 text-right font-medium">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(meetings.data || []).map((meeting: any) => {
                                const minute =
                                    meeting.minutes?.length > 0
                                        ? meeting.minutes[0]
                                        : null;

                                return (
                                    <tr
                                        key={meeting.id}
                                        className="border-b last:border-0 hover:bg-muted/20"
                                    >
                                        <td className="p-4 font-medium">
                                            {meeting.title}
                                        </td>
                                        <td className="p-4 text-muted-foreground">
                                            {formatDate(meeting.date)}
                                        </td>
                                        <td className="p-4 text-muted-foreground">
                                            {meeting.location || '-'}
                                        </td>
                                        <td className="p-4 text-center">
                                            {meeting.participants?.length > 0
                                                ? Math.round(
                                                      ((meeting.attendances?.filter(
                                                          (a: any) =>
                                                              [
                                                                  'hadir',
                                                                  'terlambat',
                                                              ].includes(
                                                                  a.status,
                                                              ),
                                                      ).length || 0) /
                                                          meeting.participants
                                                              .length) *
                                                          100,
                                                  )
                                                : 0}
                                            %
                                        </td>
                                        <td className="p-4 text-right">
                                            {minute ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={`/meetings/${meeting.id}/review/pdf`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <FileText className="mr-2 h-4 w-4" />{' '}
                                                        PDF Notulen
                                                    </a>
                                                </Button>
                                            ) : (
                                                <MeetingStatusBadge
                                                    status={meeting.status}
                                                    currentStage={
                                                        meeting.current_stage
                                                    }
                                                />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!meetings.data || meetings.data.length === 0) && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        Tidak ada data rapat pada rentang
                                        tanggal ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Pagination */}
            {meetings.links && meetings.links.length > 3 && (
                <div className="flex justify-center gap-1">
                    {meetings.links.map((link: any, i: number) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            className={`rounded border px-3 py-1.5 text-sm transition-colors ${
                                link.active
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : link.url
                                      ? 'border-input bg-background hover:bg-muted'
                                      : 'cursor-not-allowed border-input bg-muted text-muted-foreground'
                            }`}
                            preserveScroll
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
ReportIndex.layout = () => ({
    breadcrumbs: [
        {
            title: 'eNotulen',
            href: '/dashboard',
        },
    ],
});
