import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Calendar,
    PenLine,
    Users2,
    FileText,
    BarChart3,
    Users,
    ShieldCheck,
    KeyRound,
    LayoutList,
    UserCog,
    FileKey,
    LogOut
    
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { usePermissions } from '@/hooks/use-permissions';
import { dashboard } from '@/routes';

/** Main menu items matching the mockup design */
interface MenuItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

const MAIN_MENU_ITEMS: MenuItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Jadwal Rapat', href: '/meetings', icon: Calendar },
    { title: 'Koreksi Transkrip', href: '/transcripts', icon: PenLine },
    { title: 'Absensi', href: '/attendances', icon: Users2 },
    { title: 'Notulen', href: '/minutes', icon: FileText },
    { title: 'Laporan', href: '/reports', icon: BarChart3 },
];

const CONFIG_MENU_ITEMS: MenuItem[] = [
    { title: 'Users', href: '/configuration/users', icon: Users },
    { title: 'Roles', href: '/configuration/roles', icon: ShieldCheck },
    { title: 'Permissions', href: '/configuration/permissions', icon: KeyRound },
    { title: 'Menus', href: '/configuration/menus', icon: LayoutList },
    { title: 'Role Permissions', href: '/configuration/role-permissions', icon: UserCog },
    { title: 'User Permissions', href: '/configuration/user-permissions', icon: FileKey },
];

/** Get role abbreviation for avatar badge (e.g., "Bag. Umum" → "BU") */
function getRoleAbbreviation(role: string): string {
    if (!role) {
return '??';
}

    const parts = role.replace(/\./g, '').split(/\s+/);

    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return role.substring(0, 2).toUpperCase();
}

/** Get role color class based on role name */
function getRoleBadgeColor(role: string): string {
    switch (role) {
        case 'Super Admin':
            return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
        case 'Administrator':
            return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
        case 'Bag. Umum':
            return 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300';
        case 'Bag. Humas':
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
        case 'Pimpinan':
            return 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300';
        case 'Viewer':
            return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
        default:
            return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
    }
}

export function AppSidebar() {
    const page = usePage<any>();
    const { isCurrentUrl } = useCurrentUrl();
    const getInitials = useInitials();
    const { isAdmin, guardAction } = usePermissions();

    const user = page.props.auth?.user;
    const roles: string[] = page.props.auth?.roles || [];
    const primaryRole = roles[0] || 'User';

    // Try to resolve menu URLs from database menus, fallback to static
    const dbMenus = page.props.menus || [];
    const resolvedMainMenu = MAIN_MENU_ITEMS.map((item) => {
        const dbMatch = dbMenus.find(
            (m: any) =>
                m.name?.toLowerCase() === item.title.toLowerCase() ||
                m.route?.includes(item.href.replace('/', ''))
        );

        return {
            ...item,
            href: (dbMatch?.url && dbMatch?.url !== '#') ? dbMatch.url : item.href,
        };
    });

    const dashboardUrl = page.props.currentTeam
        ? dashboard(page.props.currentTeam.slug)
        : '/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-glass border-r-0 shadow-soft z-50">
            {/* ── Header: Logo ── */}
            <SidebarHeader className="pt-6 pb-2 px-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-primary/5 transition-all duration-300 rounded-xl">
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* ── Content: Menu + Configuration ── */}
            <SidebarContent className="px-3 gap-0">
                {/* Main Menu */}
                <SidebarGroup className="py-2">
                    <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-2">
                        Menu Utama
                    </SidebarGroupLabel>
                    <SidebarMenu className="gap-1.5">
                        {resolvedMainMenu.map((item) => {
                            const active = isCurrentUrl(item.href);

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={active}
                                        tooltip={{ children: item.title }}
                                        className={`rounded-xl transition-all duration-300 group ${
                                            active 
                                            ? 'bg-primary/10 text-primary font-semibold shadow-sm' 
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/80'
                                        }`}
                                    >
                                        <Link href={item.href} prefetch className="flex items-center gap-3">
                                            <item.icon className={`size-5 transition-transform duration-300 ${active ? 'scale-110 text-primary' : 'group-hover:scale-110 group-hover:text-primary/80'}`} />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>

                {isAdmin && (
                    <>
                        <SidebarSeparator className="mx-4 my-2 opacity-50" />
                        
                        <SidebarGroup className="py-2">
                            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-2">
                                Konfigurasi
                            </SidebarGroupLabel>
                            <SidebarMenu className="gap-1.5">
                                {CONFIG_MENU_ITEMS.map((item) => {
                                    const active = page.url.startsWith(item.href);

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={active}
                                                tooltip={{ children: item.title }}
                                                className={`rounded-xl transition-all duration-300 group ${
                                                    active 
                                                    ? 'bg-primary/10 text-primary font-semibold shadow-sm' 
                                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/80'
                                                }`}
                                            >
                                                <Link 
                                                    href={item.href} 
                                                    prefetch
                                                    className="flex items-center gap-3"
                                                >
                                                    <item.icon className={`size-5 transition-transform duration-300 ${active ? 'scale-110 text-primary' : 'group-hover:scale-110 group-hover:text-primary/80'}`} />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroup>
                    </>
                )}
            </SidebarContent>

            {/* ── Footer: User Role + Account ── */}
            <SidebarFooter className="p-4 pb-6">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white dark:hover:bg-slate-800 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-none">
                            <Avatar className="h-10 w-10 shrink-0 rounded-xl shadow-sm">
                                <AvatarFallback
                                    className={`rounded-xl text-sm font-bold ${getRoleBadgeColor(primaryRole)}`}
                                >
                                    {getRoleAbbreviation(primaryRole)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                <span className="truncate font-bold text-slate-800 dark:text-slate-200">
                                    {primaryRole}
                                </span>
                                <span className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {user?.name || 'Admin Rapat'}
                                </span>
                            </div>
                        </div>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="mt-2">
                        <SidebarMenuButton
                            asChild
                            tooltip={{ children: 'Keluar' }}
                            className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all duration-300 flex justify-center"
                        >
                            <Link href="/logout" method="post" as="button" className="w-full justify-center group">
                                <LogOut className="size-4 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold">Keluar Aplikasi</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

