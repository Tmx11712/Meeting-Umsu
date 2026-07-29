import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden flex flex-col">
                <div className="w-full max-w-[1400px] mx-auto flex flex-col flex-1 px-6">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    <div className="flex-1 pb-6">
                        {children}
                    </div>
                </div>
            </AppContent>
        </AppShell>
    );
}
