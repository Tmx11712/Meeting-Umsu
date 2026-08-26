import React from 'react';

interface MeetingStatusBadgeProps {
    status: string | undefined;
    className?: string;
}

export function MeetingStatusBadge({ status, className = '' }: MeetingStatusBadgeProps) {
    const s = (status || 'terjadwal').toLowerCase();
    
    let colorClass = 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800';
    let text = 'Tidak Diketahui';
    let emoji = '⚪';

    switch (s) {
        case 'terjadwal':
            colorClass = 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
            text = 'Terjadwal';
            break;
        case 'berlangsung':
            colorClass = 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 animate-pulse';
            text = 'Berlangsung';
            break;
        case 'selesai':
            colorClass = 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
            text = 'Selesai';
            break;
        case 'dibatalkan':
            colorClass = 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700';
            text = 'Rapat Dibatalkan';
            break;
        case 'recording':
            colorClass = 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 animate-pulse';
            text = 'Merekam';
            emoji = '🔴';
            break;
        case 'recorded':
            colorClass = 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
            text = 'Selesai Merekam';
            emoji = '🟠';
            break;
        default:
            text = s.charAt(0).toUpperCase() + s.slice(1);
            break;
    }

    return (
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm whitespace-nowrap ${colorClass} ${className}`}>
            {text}
        </span>
    );
}
