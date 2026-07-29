import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, Users, Key, LayoutGrid, CheckSquare, ShieldBan, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

type Props = {
    stats: {
        usersCount: number;
        rolesCount: number;
        permissionsCount: number;
        menusCount: number;
        rolePermissionsCount: number;
        userPermissionsCount: number;
    };
};

export default function ConfigurationIndex({ stats }: Props) {
    const modules = [
        {
            title: 'Users',
            icon: Users,
            count: stats.usersCount,
            href: '/configuration/users',
            description: 'Kelola pengguna sistem',
            color: 'text-blue-600',
            bg: 'bg-blue-100'
        },
        {
            title: 'Roles',
            icon: ShieldCheck,
            count: stats.rolesCount,
            href: '/configuration/roles',
            description: 'Kelola role pengguna',
            color: 'text-indigo-600',
            bg: 'bg-indigo-100'
        },
        {
            title: 'Permissions',
            icon: Key,
            count: stats.permissionsCount,
            href: '/configuration/permissions',
            description: 'Kelola permission sistem',
            color: 'text-amber-600',
            bg: 'bg-amber-100'
        },
        {
            title: 'Menus',
            icon: LayoutGrid,
            count: stats.menusCount,
            href: '/configuration/menus',
            description: 'Kelola menu navigasi',
            color: 'text-emerald-600',
            bg: 'bg-emerald-100'
        },
        {
            title: 'Role Permissions',
            icon: CheckSquare,
            count: stats.rolePermissionsCount,
            href: '/configuration/role-permissions',
            description: 'Atur permission untuk setiap role',
            color: 'text-purple-600',
            bg: 'bg-purple-100'
        },
        {
            title: 'User Permissions',
            icon: ShieldBan,
            count: stats.userPermissionsCount,
            href: '/configuration/user-permissions',
            description: 'Hak akses spesifik pengguna',
            color: 'text-rose-600',
            bg: 'bg-rose-100'
        },
    ];

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Configuration" />
            
            <div className="flex h-full flex-1 flex-col p-8 max-w-7xl mx-auto w-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configuration</h1>
                    <p className="text-slate-500">Kelola pengguna, role, permission dan menu sistem</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {modules.map((module) => (
                        <Link key={module.title} href={module.href} className="block">
                            <Card className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-slate-300">
                                <div className="p-6">
                                    <div className={`mb-4 inline-flex size-12 items-center justify-center rounded-lg ${module.bg} ${module.color}`}>
                                        <module.icon className="size-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{module.title}</h3>
                                    <p className="text-sm text-slate-500">
                                        {module.description}
                                    </p>
                                </div>
                                <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{module.count}</span> {module.title}
                                    </div>
                                    <ChevronRight className="size-4" />
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
