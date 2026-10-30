import { useEffect } from 'react';
import { useFlashToast } from '@/hooks/use-flash-toast';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    useFlashToast();
    
    useEffect(() => {
        // Lakukan auto-sync secara background setelah halaman selesai dirender (idle)
        // agar tidak menghambat Largest Contentful Paint (LCP) saat Soft Navigation.
        const lastSync = sessionStorage.getItem('enotulen_last_autosync');
        const now = Date.now();

        if (lastSync && now - Number(lastSync) < 60_000) {
            return;
        }

        const timer = window.setTimeout(() => {
            sessionStorage.setItem('enotulen_last_autosync', String(Date.now()));

            const getXsrfToken = () => {
                const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));

                return match ? decodeURIComponent(match[2]) : '';
            };

            fetch('/meetings/auto-sync', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': getXsrfToken(),
                    'Content-Type': 'application/json',
                },
            }).catch(() => {});
        }, 2500);

        return () => window.clearTimeout(timer);
    }, []);
    
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
