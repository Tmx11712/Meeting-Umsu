import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, Users, Key, LayoutGrid, CheckSquare, ShieldBan, ChevronRight, List, MapPin, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { useState, useEffect } from 'react';

type Props = {
    stats: {
        usersCount: number;
        rolesCount: number;
        permissionsCount: number;
        menusCount: number;
        rolePermissionsCount: number;
        userPermissionsCount: number;
        meetingTypesCount: number;
        meetingRoomsCount: number;
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
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50'
        },
        {
            title: 'Roles',
            icon: ShieldCheck,
            count: stats.rolesCount,
            href: '/configuration/roles',
            description: 'Kelola role pengguna',
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50'
        },
        {
            title: 'Permissions',
            icon: Key,
            count: stats.permissionsCount,
            href: '/configuration/permissions',
            description: 'Kelola permission sistem',
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/50'
        },
        {
            title: 'Menus',
            icon: LayoutGrid,
            count: stats.menusCount,
            href: '/configuration/menus',
            description: 'Kelola menu navigasi',
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50'
        },
        {
            title: 'Role Permissions',
            icon: CheckSquare,
            count: stats.rolePermissionsCount,
            href: '/configuration/role-permissions',
            description: 'Atur permission untuk setiap role',
            color: 'text-sky-600 dark:text-sky-400',
            bg: 'bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/50'
        },
        {
            title: 'User Permissions',
            icon: ShieldBan,
            count: stats.userPermissionsCount,
            href: '/configuration/user-permissions',
            description: 'Hak akses spesifik pengguna',
            color: 'text-rose-600 dark:text-rose-400',
            bg: 'bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/50'
        },
        {
            title: 'Tipe Rapat',
            icon: List,
            count: stats.meetingTypesCount,
            href: '/configuration/meeting-types',
            description: 'Kelola daftar pilihan tipe rapat',
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50'
        },
        {
            title: 'Ruangan',
            icon: MapPin,
            count: stats.meetingRoomsCount,
            href: '/configuration/meeting-rooms',
            description: 'Kelola daftar pilihan ruangan rapat',
            color: 'text-violet-600 dark:text-violet-400',
            bg: 'bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900/50'
        },
    ];

    const [aiStatus, setAiStatus] = useState<{status: string, message: string} | null>(null);
    const [loadingAi, setLoadingAi] = useState(true);

    useEffect(() => {
        fetch('/configuration/openai-status')
            .then(res => res.json())
            .then(data => {
                setAiStatus(data);
                setLoadingAi(false);
            })
            .catch(err => {
                setAiStatus({ status: 'error', message: 'Gagal mengecek status API' });
                setLoadingAi(false);
            });
    }, []);

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Configuration" />
            
            <div className="flex h-full flex-1 flex-col p-8 max-w-7xl mx-auto w-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Configuration</h1>
                    <p className="text-slate-500 dark:text-slate-400">Kelola pengguna, role, permission dan menu sistem</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* OpenAI Status Card */}
                    <Card className="group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card shadow-sm transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700">
                        <div className="p-6">
                            <div className={`mb-4 inline-flex size-12 items-center justify-center rounded-lg ${
                                loadingAi ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' :
                                aiStatus?.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50' :
                                'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50'
                            }`}>
                                <Activity className={`size-6 ${loadingAi ? 'animate-pulse' : ''}`} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">OpenAI Status (AI)</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Status kuota & token ChatGPT
                            </p>
                        </div>
                        <div className={`border-t px-6 py-4 flex items-center justify-between text-sm font-bold ${
                                loadingAi ? 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300' :
                                aiStatus?.status === 'active' ? 'border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30' :
                                'border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30'
                            }`}>
                            <div className="flex items-center gap-1">
                                {loadingAi ? 'Mengecek status...' : aiStatus?.message}
                            </div>
                        </div>
                    </Card>

                    {modules.map((module) => (
                        <Link key={module.title} href={module.href} className="block">
                            <Card className="group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card shadow-sm transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700">
                                <div className="p-6">
                                    <div className={`mb-4 inline-flex size-12 items-center justify-center rounded-lg ${module.bg} ${module.color}`}>
                                        <module.icon className="size-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{module.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {module.description}
                                    </p>
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 px-6 py-4 flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{module.count}</span> {module.title}
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
