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
                <div className="w-full max-w-7xl mx-auto flex flex-col flex-1">
                    {breadcrumbs.length > 0 && (
                        <div className="px-6 pt-6 pb-1">
                            <AppSidebarHeader breadcrumbs={breadcrumbs} />
                        </div>
                    )}
                    <div className={`flex-1 ${breadcrumbs.length > 0 ? '-mt-2' : 'pt-6'}`}>
                        {children}
                    </div>
                </div>
            </AppContent>
        </AppShell>
    );
}
