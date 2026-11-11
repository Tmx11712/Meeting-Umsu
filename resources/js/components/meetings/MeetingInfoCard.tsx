import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Meeting {
    title: string;
    date: string;
    start_time?: string;
    end_time?: string;
    location: string;
    participants?: any[];
    attendances?: any[];
    minutes?: any[];
}

interface MeetingInfoCardProps {
    meeting: Meeting;
    totalParticipants?: number;
    showDetailButton?: boolean;
    className?: string;
}

export function MeetingInfoCard({
    meeting,
    totalParticipants,
    showDetailButton = false,
    className = '',
}: MeetingInfoCardProps) {
    /**
     * [EDUKASI ARSITEKTUR: REUSABLE UI COMPONENT]
     * Komponen ini merender kotak informasi rapat (Judul, Waktu, Tempat).
     * Dengan menjadikannya komponen terpisah (`MeetingInfoCard`), kita bisa menggunakannya kembali di halaman
     * Recording, Correction, Review, maupun Approval tanpa menulis ulang kode HTML yang sama.
     */

    // Hitung peserta dari DB (internal + eksternal)
    const dbParticipantCount =
        (meeting.participants?.length || 0) +
        (meeting.attendances?.filter((a: any) => !a.user_id).length || 0);

    // Hitung peserta dari input manual di notulen (jika ada)
    const manualParticipantCount =
        meeting.minutes?.[0]?.content?.peserta_rapat?.length || 0;

    // Gunakan nilai terbesar antara DB dan manual (karena rapat manual mungkin DB pesertanya kosong)
    const defaultParticipantCount = Math.max(
        dbParticipantCount,
        manualParticipantCount,
    );

    const participantCount =
        totalParticipants !== undefined
            ? totalParticipants
            : defaultParticipantCount;

    return (
        <Card
            className={`shadow-soft flex flex-col overflow-hidden rounded-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 ${className}`}
        >
            <CardHeader className="border-b border-blue-100/50 bg-blue-50/50 pb-3 dark:border-blue-800/30 dark:bg-blue-900/20">
                <CardTitle className="flex items-center text-sm font-bold text-blue-900 dark:text-blue-100">
                    <div className="mr-2.5 rounded-lg bg-blue-100 p-1.5 text-blue-600 shadow-sm dark:bg-blue-800 dark:text-blue-300">
                        <Calendar className="h-3.5 w-3.5" />
                    </div>
                    Informasi Rapat
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div>
                    <p className="mb-0.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                        Judul Rapat
                    </p>
                    <p className="text-base leading-tight font-bold text-slate-900 dark:text-white">
                        {meeting.title}
                    </p>
                </div>
                <div className="grid flex-1 grid-cols-2 gap-3">
                    <div>
                        <p className="mb-0.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                            Tanggal
                        </p>
                        <p className="flex items-center text-xs font-medium text-slate-700 dark:text-slate-300">
                            <Calendar className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
                            {meeting.date || '-'}
                        </p>
                    </div>
                    <div className="min-w-0">
                        <p className="mb-0.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                            Ruangan
                        </p>
                        <div className="flex items-center text-xs font-medium text-slate-700 dark:text-slate-300">
                            <MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                            <span
                                className="truncate"
                                title={meeting.location || '-'}
                            >
                                {meeting.location || '-'}
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="mb-0.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                            Peserta
                        </p>
                        <div className="flex items-center text-xs font-medium text-slate-700 dark:text-slate-300">
                            <Users className="mr-1.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                            <span className="truncate">
                                {participantCount} Orang
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="mb-0.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                            Waktu
                        </p>
                        <p className="flex items-center text-xs font-medium text-slate-700 dark:text-slate-300">
                            <Clock className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
                            {meeting.start_time
                                ? `${meeting.start_time.substring(0, 5)} - ${meeting.end_time?.substring(0, 5)}`
                                : '-'}{' '}
                            WIB
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
