import { Head } from '@inertiajs/react';
import { Download, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportIndex({ meetings, filters }: any) {
    return (
        <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
            <Head title="Laporan Notulen" />
            
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Laporan Notulen</h1>
                    <p className="text-muted-foreground">Unduh laporan dan rekap rapat.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filter & Download</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-wrap gap-4 items-end" action="/reports" method="GET">
                        <div className="space-y-2 flex-1 min-w-[200px]">
                            <label className="text-sm font-medium">Tanggal Mulai</label>
                            <input 
                                type="date" 
                                name="start_date"
                                className="w-full bg-background rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                defaultValue={filters.start_date || ''}
                            />
                        </div>
                        <div className="space-y-2 flex-1 min-w-[200px]">
                            <label className="text-sm font-medium">Tanggal Selesai</label>
                            <input 
                                type="date" 
                                name="end_date"
                                className="w-full bg-background rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                defaultValue={filters.end_date || ''}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" variant="secondary">
                                <Search className="mr-2 h-4 w-4" /> Tampilkan
                            </Button>
                            <Button asChild>
                                <a href={`/reports/download?start_date=${filters.start_date || ''}&end_date=${filters.end_date || ''}`}>
                                    <Download className="mr-2 h-4 w-4" /> Download PDF Rekap
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
                                <th className="p-4 font-medium text-center">Topik Bahasan</th>
                                <th className="p-4 font-medium text-center">Keputusan</th>
                                <th className="p-4 font-medium text-center">Kehadiran</th>
                                <th className="p-4 font-medium text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetings.map((meeting: any) => {
                                const minute = meeting.minutes?.length > 0 ? meeting.minutes[0] : null;

                                return (
                                    <tr key={meeting.id} className="border-b last:border-0 hover:bg-muted/20">
                                        <td className="p-4 font-medium">{meeting.title}</td>
                                        <td className="p-4 text-muted-foreground">{meeting.date}</td>
                                        <td className="p-4 text-center">{minute?.ai_topics_count || 0}</td>
                                        <td className="p-4 text-center">{minute?.ai_decisions_count || 0}</td>
                                        <td className="p-4 text-center">
                                            {meeting.participants?.length > 0 
                                                ? Math.round((meeting.attendances?.length || 0) / meeting.participants.length * 100) 
                                                : 0}%
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={`/meetings/${meeting.id}/review/pdf`}>
                                                    <FileText className="mr-2 h-4 w-4" /> PDF Notulen
                                                </a>
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {meetings.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">Tidak ada data rapat pada rentang tanggal ini.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
