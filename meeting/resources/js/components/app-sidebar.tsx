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
    LogOut,
    type LucideIcon,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import { usePermissions } from '@/hooks/use-permissions';

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
    if (!role) return '??';
    // Handle "Bag. Umum" → "BU", "Bag. Humas" → "BH"
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
            return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300';
        case 'Administrator':
            return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
        case 'Bag. Umum':
            return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300';
        case 'Bag. Humas':
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
        case 'Pimpinan':
            return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300';
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
        <Sidebar collapsible="icon" variant="inset">
            {/* ── Header: Logo ── */}
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
            </SidebarHeader>

            {/* ── Content: Menu + Configuration ── */}
            <SidebarContent>
                {/* Main Menu */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                        Menu
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {resolvedMainMenu.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarSeparator className="mx-4" />
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                        Configuration
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {CONFIG_MENU_ITEMS.map((item) => {
                            // Hide Roles and Permissions for non-admins
                            if (!isAdmin && (item.title === 'Roles' || item.title === 'Permissions')) {
                                return null;
                            }
                            
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={page.url.startsWith(item.href)}
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link 
                                            href={item.href} 
                                            prefetch
                                            onClick={(e) => {
                                                if (!isAdmin) {
                                                    e.preventDefault();
                                                    guardAction('configuration', 'Akses Terbatas: Hanya Administrator yang dapat mengakses menu ini.');
                                                }
                                            }}
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* ── Footer: User Role + Account ── */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                            <Avatar className="h-9 w-9 shrink-0 rounded-lg">
                                <AvatarFallback
                                    className={`rounded-lg text-sm font-bold ${getRoleBadgeColor(primaryRole)}`}
                                >
                                    {getRoleAbbreviation(primaryRole)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                <span className="truncate font-semibold text-foreground">
                                    {primaryRole}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {user?.name || 'Admin Rapat'}
                                </span>
                            </div>
                        </div>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip={{ children: 'Ganti akun' }}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Link href="/logout" method="post" as="button" className="w-full">
                                <LogOut />
                                <span>Ganti akun</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
