import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Plus,
    Filter,
    PenLine,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { confirmDelete } from '@/lib/sweetalert';
import type { UserManagementData, RoleData } from '@/types/configuration';

type Props = {
    users: {
        data: UserManagementData[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        from: number | null;
        to: number | null;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    roles: Pick<RoleData, 'id' | 'name'>[];
    filters: {
        search?: string;
        role?: string;
    };
};

export default function UsersIndex({ users, roles, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/configuration/users',
            { search },
            { preserveState: true, preserveScroll: true },
        );
    };

    const getRoleStyles = (roleName: string) => {
        switch (roleName) {
            case 'Bag. Umum':
                return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50';
            case 'Bag. Humas':
                return 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50';
            case 'Pimpinan':
                return 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-900/50';
            case 'Administrator':
            case 'Super Admin':
                return 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50';
            default:
                return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';
        }
    };

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Users" />

            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col p-8">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Users
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Daftar semua pengguna sistem
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Link href="/configuration/users/create">
                            <Plus className="mr-2 size-4" />
                            Add User
                        </Link>
                    </Button>
                </div>

                <Card className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-card">
                    <div className="flex flex-col gap-3 pb-6 sm:flex-row">
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-1 items-center"
                        >
                            <div className="relative w-full">
                                <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                                <Input
                                    type="search"
                                    placeholder="Cari pengguna..."
                                    className="border-slate-200 bg-slate-50 pl-9 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900/60"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </form>
                        <Button
                            variant="outline"
                            className="dark:hover:bg-slate-850 gap-2 border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
                        >
                            <Filter className="size-4" />
                            Filter
                        </Button>
                    </div>

                    <div className="overflow-x-auto pb-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                    <th className="w-16 px-4 py-3 text-center font-medium">
                                        No
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Nama
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-center font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length > 0 ? (
                                    users.data.map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-800/80 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="px-4 py-4 text-center text-slate-500 dark:text-slate-400">
                                                {(users.current_page - 1) * 10 +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">
                                                {user.name}
                                            </td>
                                            <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.length > 0 ? (
                                                        user.roles.map((r) => (
                                                            <span
                                                                key={r.id}
                                                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleStyles(r.name)}`}
                                                            >
                                                                {r.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            No role
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === 'aktif' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'}`}
                                                >
                                                    {user.status === 'aktif'
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <Link
                                                        href={`/configuration/users/${user.id}/edit`}
                                                        className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                                                    >
                                                        <PenLine className="size-4" />
                                                    </Link>
                                                    {user.name !==
                                                        'Super Admin' && (
                                                        <button
                                                            type="button"
                                                            className="text-slate-400 transition hover:text-red-600 dark:hover:text-red-400"
                                                            onClick={async () => {
                                                                if (
                                                                    await confirmDelete(
                                                                        `Yakin ingin menghapus user ${user.name}?`,
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        `/configuration/users/${user.id}`,
                                                                        {
                                                                            preserveScroll: true,
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-8 text-center text-slate-500 dark:text-slate-400"
                                        >
                                            Tidak ada data pengguna yang
                                            ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.total > 0 && (
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
                            <div className="text-slate-500 dark:text-slate-400">
                                Showing {users.from} to {users.to} of{' '}
                                {users.total} results
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-8 rounded-md border-slate-200 text-slate-500"
                                    disabled={!users.prev_page_url}
                                    onClick={() =>
                                        users.prev_page_url &&
                                        router.get(users.prev_page_url)
                                    }
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>

                                {users.links
                                    .filter(
                                        (l) =>
                                            !l.label.includes('Next') &&
                                            !l.label.includes('Previous'),
                                    )
                                    .map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={
                                                link.active
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="icon"
                                            className={`size-8 rounded-md ${link.active ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                            disabled={!link.url}
                                            onClick={() =>
                                                link.url && router.get(link.url)
                                            }
                                        >
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </Button>
                                    ))}

                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-8 rounded-md border-slate-200 text-slate-500"
                                    disabled={!users.next_page_url}
                                    onClick={() =>
                                        users.next_page_url &&
                                        router.get(users.next_page_url)
                                    }
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
