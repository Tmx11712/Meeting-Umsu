import React from 'react';

interface MeetingStatusBadgeProps {
    status: string | undefined;
    category?: string | null;
    currentStage?: number | null;
    className?: string;
}

export function MeetingStatusBadge({ status, category, currentStage, className = '' }: MeetingStatusBadgeProps) {
    const s = (status || 'terjadwal').toLowerCase();
    
    let colorClass = 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800';
    let text = 'Tidak Diketahui';
    let emoji = '⚪';

    switch (s) {
        case 'terjadwal':
            colorClass = 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
            text = 'Terjadwal';

            if (category === 'jadwal_mendatang') {
                text = 'Jadwal Mendatang';
                colorClass = 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
            } else if (category === 'action_item_mendesak') {
                text = 'Action Item Mendesak';
                colorClass = 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800';
            }

            break;
        case 'berlangsung':
            colorClass = 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 animate-pulse';
            text = 'Sedang Merekam';
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

    // Override based on currentStage if provided (and not cancelled)
    if (s !== 'dibatalkan' && category !== 'jadwal_mendatang' && currentStage !== undefined && currentStage !== null) {
        if (currentStage === 2) {
            text = 'Sedang Merekam';
            colorClass = 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 animate-pulse';
        } else if (currentStage === 3 || currentStage === 4) {
            text = 'Sedang Transkrip';
            colorClass = 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800 animate-pulse';
        } else if (currentStage === 5) {
            text = 'Menyusun Notulen';
            colorClass = 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 animate-pulse';
        } else if (currentStage === 6) {
            text = 'Menunggu Review';
            colorClass = 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
        } else if (currentStage >= 7) {
            text = 'Selesai';
            colorClass = 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
        }
    }

    return (
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm whitespace-nowrap ${colorClass} ${className}`}>
            {text}
        </span>
    );
}
