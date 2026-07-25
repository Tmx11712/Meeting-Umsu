import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Calendar, FileText, Settings, Users, ShieldCheck, Mic, PenTool, CheckCircle, type LucideIcon } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const page = usePage<any>();
    const dashboardUrl = page.props.currentTeam
        ? dashboard(page.props.currentTeam.slug)
        : '/dashboard';

    const iconMap: Record<string, LucideIcon> = {
        'home': LayoutGrid,
        'calendar': Calendar,
        'file-text': FileText,
        'settings': Settings,
        'LayoutDashboard': LayoutGrid,
        'CalendarDays': Calendar,
        'FileText': FileText,
        'Users': Users,
        'BookOpen': BookOpen,
        'PieChart': Settings,
        'Settings': Settings,
    };

    const menus = page.props.menus || [];
    
    const roles = page.props.auth?.roles || [];
    const isAdmin = roles.includes('Super Admin') || roles.includes('Administrator');
    
    const dbMenus = menus.map((menu: any) => ({
        title: menu.name === 'Semua Rapat' ? 'Jadwal Rapat' : menu.name, // Override name just in case
        href: menu.url || '#',
        icon: iconMap[menu.icon] || LayoutGrid,
    }));

    const laporanMenu = dbMenus.find((m: any) => m.title.toLowerCase() === 'laporan');
    const otherMenus = dbMenus.filter((m: any) => m.title.toLowerCase() !== 'laporan');

    const mainNavItems: NavItem[] = [
        ...otherMenus,
        ...(laporanMenu ? [laporanMenu] : [])
    ];

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <TeamSwitcher />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {page.props.auth?.can_manage_configuration && (
                    <SidebarGroup className="px-2 py-0 mt-4">
                        <SidebarGroupLabel>Configuration</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url.startsWith('/configuration/users')}
                                    tooltip={{ children: 'Users' }}
                                >
                                    <Link href="/configuration/users" prefetch>
                                        <Users />
                                        <span>Users</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url.startsWith('/configuration/roles')}
                                    tooltip={{ children: 'Roles' }}
                                >
                                    <Link href="/configuration/roles" prefetch>
                                        <ShieldCheck />
                                        <span>Roles</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url.startsWith('/configuration/menus')}
                                    tooltip={{ children: 'Menus' }}
                                >
                                    <Link href="/configuration/menus" prefetch>
                                        <LayoutGrid />
                                        <span>Menus</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url.startsWith('/configuration/role-permissions')}
                                    tooltip={{ children: 'Role Permissions' }}
                                >
                                    <Link href="/configuration/role-permissions" prefetch>
                                        <ShieldCheck />
                                        <span>Role Permissions</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url.startsWith('/configuration/user-permissions')}
                                    tooltip={{ children: 'User Permissions' }}
                                >
                                    <Link href="/configuration/user-permissions" prefetch>
                                        <ShieldCheck />
                                        <span>User Permissions</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <div className="mt-auto"></div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
