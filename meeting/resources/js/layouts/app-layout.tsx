import { useFlashToast } from '@/hooks/use-flash-toast';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import { useEffect } from 'react';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    useFlashToast();
    
    useEffect(() => {
        // Lakukan auto-sync secara background saat aplikasi dimuat. 
        // Backend sudah memiliki proteksi Cache Lock 5 menit agar tidak membebani server.
        const getXsrfToken = () => {
            const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
            return match ? decodeURIComponent(match[2]) : '';
        };

        fetch('/meetings/auto-sync', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': getXsrfToken(),
                'Content-Type': 'application/json'
            }
        }).catch(() => {});
    }, []);
    
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
