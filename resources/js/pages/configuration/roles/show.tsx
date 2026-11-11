import { Head, Link, router } from '@inertiajs/react';
import { Search, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

type Props = {
    role: {
        id: string;
        name: string;
        description: string | null;
        users_count: number;
    };
    users: {
        data: {
            id: string;
            name: string;
            email: string;
            status: string;
        }[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        from?: number;
        to?: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
    };
};

export default function RolesShow({ role, users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            `/configuration/roles/${role.id}`,
            { search },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title={`Role Details - ${role.name}`} />

            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col p-8">
                <div className="mb-6 flex items-center text-sm text-slate-500">
                    <Link
                        href="/configuration/roles"
                        className="transition-colors hover:text-slate-900"
                    >
                        Roles
                    </Link>
                    <span className="mx-2">&gt;</span>
                    <span className="font-medium text-slate-900">
                        {role.name}
                    </span>
                </div>

                {/* Role Information Card */}
                <Card className="mb-8 flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
                    <div>
                        <div className="mb-1 flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                {role.name}
                            </h1>
                            <Badge
                                variant="secondary"
                                className="bg-blue-50 text-blue-700"
                            >
                                {role.users_count} Users
                            </Badge>
                        </div>
                        <p className="text-slate-500">
                            {role.description ||
                                'Tidak ada deskripsi untuk role ini.'}
                        </p>
                    </div>
                </Card>

                {/* Assigned Users Section */}
                <h2 className="mb-4 text-lg font-bold tracking-tight text-slate-900">
                    Pengguna yang Ditetapkan
                </h2>

                <Card className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-slate-100 pb-6 sm:flex-row">
                        <form
                            onSubmit={handleSearch}
                            className="relative flex-1 sm:max-w-xs"
                        >
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Cari user..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="rounded-lg border-slate-200 pl-9 focus-visible:ring-blue-500"
                            />
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 font-medium text-slate-500">
                                    <th className="px-4 py-4 font-medium">
                                        Nama User
                                    </th>
                                    <th className="px-4 py-4 font-medium">
                                        Email
                                    </th>
                                    <th className="w-32 px-4 py-4 font-medium">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-slate-50/50"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                                                        {user.name
                                                            .substring(0, 2)
                                                            .toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-slate-900">
                                                        {user.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-slate-500">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                                                >
                                                    {user.status === 'aktif'
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="py-12 text-center text-slate-500"
                                        >
                                            <User className="mx-auto mb-3 size-10 text-slate-300" />
                                            <p className="text-base font-medium text-slate-900">
                                                Tidak ada user ditemukan
                                            </p>
                                            <p className="mt-1 text-sm">
                                                Belum ada pengguna yang memiliki
                                                role ini atau tidak sesuai
                                                dengan kata kunci pencarian.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.total > 0 && (
                        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-6">
                            <span className="text-sm text-slate-500">
                                Menampilkan {users.from} - {users.to} dari{' '}
                                {users.total} pengguna
                            </span>
                            <div className="flex gap-1">
                                {users.links.map((link, i) => {
                                    const isPrevious =
                                        link.label.includes('Previous');
                                    const isNext = link.label.includes('Next');

                                    if (!link.url && (isPrevious || isNext)) {
                                        return (
                                            <div
                                                key={i}
                                                className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-slate-200 text-slate-300"
                                            >
                                                {isPrevious ? (
                                                    <ChevronLeft className="size-4" />
                                                ) : (
                                                    <ChevronRight className="size-4" />
                                                )}
                                            </div>
                                        );
                                    }

                                    if (isPrevious || isNext) {
                                        return (
                                            <Link
                                                key={i}
                                                href={link.url || '#'}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                            >
                                                {isPrevious ? (
                                                    <ChevronLeft className="size-4" />
                                                ) : (
                                                    <ChevronRight className="size-4" />
                                                )}
                                            </Link>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
                                                link.active
                                                    ? 'border border-blue-600 bg-blue-600 font-medium text-white'
                                                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
