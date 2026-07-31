import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface Meeting {
    title: string;
    date: string;
    start_time?: string;
    end_time?: string;
    location: string;
    participants?: any[];
}

interface MeetingInfoCardProps {
    meeting: Meeting;
    totalParticipants?: number;
    showDetailButton?: boolean;
    className?: string;
}

export function MeetingInfoCard({ meeting, totalParticipants, showDetailButton = false, className = '' }: MeetingInfoCardProps) {
    const participantCount = totalParticipants !== undefined ? totalParticipants : (meeting.participants?.length || 0);

    return (
        <Card className={`rounded-3xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col overflow-hidden ${className}`}>
            <CardHeader className="pb-4 bg-indigo-50/50 dark:bg-indigo-900/20 border-b border-indigo-100/50 dark:border-indigo-800/30">
                <CardTitle className="text-base font-bold flex items-center text-indigo-900 dark:text-indigo-100">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 rounded-xl mr-3 shadow-sm">
                        <Calendar className="w-4 h-4" />
                    </div>
                    Informasi Rapat
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
                <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Judul Rapat</p>
                    <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{meeting.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 flex-1">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Tanggal</p>
                        <p className="text-sm font-medium flex items-center text-slate-700 dark:text-slate-300">
                            <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                            {meeting.date || '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Waktu</p>
                        <p className="text-sm font-medium flex items-center text-slate-700 dark:text-slate-300">
                            <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                            {meeting.start_time ? `${meeting.start_time.substring(0,5)} - ${meeting.end_time?.substring(0,5)}` : '-'} WIB
                        </p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Ruangan</p>
                        <div className="text-sm font-medium flex items-center text-slate-700 dark:text-slate-300">
                            <MapPin className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                            <span className="truncate" title={meeting.location || '-'}>{meeting.location || '-'}</span>
                        </div>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Peserta</p>
                        <div className="text-sm font-medium flex items-center text-slate-700 dark:text-slate-300">
                            <Users className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                            <span className="truncate">{participantCount} Orang</span>
                        </div>
                    </div>
                </div>
                {showDetailButton && (
                    <Button variant="outline" asChild className="w-full text-indigo-600 border-indigo-200/60 hover:bg-indigo-50/50 bg-white/50 backdrop-blur-sm rounded-xl mt-auto transition-all">
                        <Link href={`/meetings/${meeting.id}`}>
                            <Eye className="w-4 h-4 mr-2" /> Lihat Detail Rapat
                        </Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
