import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Calendar, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AttendanceScan({ meeting, message }: { meeting: any; message: string }) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Head title="Konfirmasi Absensi" />

            <Card className="w-full max-w-md shadow-lg border-slate-200 bg-white rounded-2xl">
                <CardContent className="p-8 flex flex-col items-center gap-6 text-center">
                    {/* Success icon */}
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">Absensi Berhasil</h1>
                        <p className="text-slate-500 text-sm">{message}</p>
                    </div>

                    {/* Meeting info */}
                    <div className="w-full bg-slate-50 rounded-xl p-4 space-y-3 text-left">
                        <p className="font-semibold text-slate-800 text-base">{meeting.title}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>{meeting.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>
                                {meeting.start_time?.substring(0, 5)} – {meeting.end_time?.substring(0, 5)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{meeting.location}</span>
                        </div>
                    </div>

                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                        <Link href="/dashboard">Kembali ke Dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
