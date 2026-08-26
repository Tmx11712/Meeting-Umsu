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
            colorClass = 'bg-blue-100/50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 font-semibold';
            text = 'Terjadwal';
            emoji = '🟡';
            break;
        case 'berlangsung':
            colorClass = 'bg-green-100/50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 font-semibold animate-pulse';
            text = 'Berlangsung';
            emoji = '🔴';
            break;
        case 'selesai':
            colorClass = 'bg-purple-100/50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800 font-semibold';
            text = 'Selesai';
            emoji = '🟢';
            break;
        case 'dibatalkan':
            colorClass = 'bg-red-100/50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 font-semibold';
            text = 'Rapat Dibatalkan';
            emoji = '⚫';
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
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs border shadow-sm whitespace-nowrap ${colorClass} ${className}`}>
            <span className="mr-1.5">{emoji}</span> {text}
        </span>
    );
}
