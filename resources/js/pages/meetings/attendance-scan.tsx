import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AttendanceScan({
    meeting,
    message,
}: {
    meeting: any;
    message: string;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Head title="Konfirmasi Absensi" />

            <Card className="w-full max-w-md rounded-2xl border-slate-200 bg-white shadow-lg">
                <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                    {/* Success icon */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>

                    <div>
                        <h1 className="mb-1 text-2xl font-bold text-slate-900">
                            Absensi Berhasil
                        </h1>
                        <p className="text-sm text-slate-500">{message}</p>
                    </div>

                    {/* Meeting info */}
                    <div className="w-full space-y-3 rounded-xl bg-slate-50 p-4 text-left">
                        <p className="text-base font-semibold text-slate-800">
                            {meeting.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>{meeting.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>
                                {meeting.start_time?.substring(0, 5)} –{' '}
                                {meeting.end_time?.substring(0, 5)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span>{meeting.location}</span>
                        </div>
                    </div>

                    <Button
                        asChild
                        className="w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Link href={`/meetings/${meeting.id}`}>
                            Masuk ke Detail Rapat
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
