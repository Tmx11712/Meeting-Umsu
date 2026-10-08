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
            <AppContent variant="sidebar" className="overflow-x-auto min-w-0 flex flex-col">
                <div className="w-full flex flex-col flex-1 px-6 lg:px-8">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    <div className="flex-1 pb-6">
                        {children}
                    </div>
                </div>
            </AppContent>
        </AppShell>
    );
}
