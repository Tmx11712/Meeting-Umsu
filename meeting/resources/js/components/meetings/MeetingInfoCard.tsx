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
        <Card className={`rounded-2xl border-0 shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col overflow-hidden ${className}`}>
            <CardHeader className="pb-3 bg-blue-50/50 dark:bg-blue-900/20 border-b border-blue-100/50 dark:border-blue-800/30">
                <CardTitle className="text-sm font-bold flex items-center text-blue-900 dark:text-blue-100">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-lg mr-2.5 shadow-sm">
                        <Calendar className="w-3.5 h-3.5" />
                    </div>
                    Informasi Rapat
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-0.5 uppercase tracking-wider">Judul Rapat</p>
                    <p className="font-bold text-slate-900 dark:text-white text-base leading-tight">{meeting.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 flex-1">
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 mb-0.5 uppercase tracking-wider">Tanggal</p>
                        <p className="text-xs font-medium flex items-center text-slate-700 dark:text-slate-300">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                            {meeting.date || '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 mb-0.5 uppercase tracking-wider">Waktu</p>
                        <p className="text-xs font-medium flex items-center text-slate-700 dark:text-slate-300">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                            {meeting.start_time ? `${meeting.start_time.substring(0,5)} - ${meeting.end_time?.substring(0,5)}` : '-'} WIB
                        </p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-slate-500 mb-0.5 uppercase tracking-wider">Ruangan</p>
                        <div className="text-xs font-medium flex items-center text-slate-700 dark:text-slate-300">
                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-400 shrink-0" />
                            <span className="truncate" title={meeting.location || '-'}>{meeting.location || '-'}</span>
                        </div>
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-slate-500 mb-0.5 uppercase tracking-wider">Peserta</p>
                        <div className="text-xs font-medium flex items-center text-slate-700 dark:text-slate-300">
                            <Users className="w-3.5 h-3.5 mr-1.5 text-blue-400 shrink-0" />
                            <span className="truncate">{participantCount} Orang</span>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
