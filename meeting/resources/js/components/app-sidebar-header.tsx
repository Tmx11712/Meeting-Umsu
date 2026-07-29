import { Link, usePage } from '@inertiajs/react';
import { Sun, Moon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

function useAppearance() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggle = useCallback(() => {
        const html = document.documentElement;
        const newMode = html.classList.contains('dark') ? 'light' : 'dark';
        html.classList.toggle('dark');
        setIsDark(newMode === 'dark');
        localStorage.setItem('appearance', newMode);
    }, []);

    return { isDark, toggle };
}

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<any>().props;
    const getInitials = useInitials();
    const { isDark, toggle } = useAppearance();
    const roles: string[] = auth?.roles || [];
    const primaryRole = roles[0] || 'User';

    /** Get role abbreviation */
    function getRoleAbbr(role: string): string {
        if (!role) {
return '??';
}

        const parts = role.replace(/\./g, '').split(/\s+/);

        if (parts.length >= 2) {
return (parts[0][0] + parts[1][0]).toUpperCase();
}

        return role.substring(0, 2).toUpperCase();
    }

    return (
        <header className="flex h-14 items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
                <SidebarTrigger className="-ml-1" />
                {breadcrumbs.length > 0 && (
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                )}
            </div>

            {/* Right side: Theme toggle + User */}
            <div className="flex items-center gap-2 shrink-0">
                {/* Theme toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggle}
                    className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
                    aria-label="Toggle theme"
                >
                    {isDark ? (
                        <Sun className="h-[18px] w-[18px]" />
                    ) : (
                        <Moon className="h-[18px] w-[18px]" />
                    )}
                </Button>

                {/* Role name + Avatar */}
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                        {primaryRole}
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-9 w-9 rounded-full p-0"
                            >
                                <Avatar className="h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20">
                                    <AvatarImage
                                        src={auth.user.avatar}
                                        alt={auth.user.name}
                                    />
                                    <AvatarFallback className="rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                        {getRoleAbbr(primaryRole)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
