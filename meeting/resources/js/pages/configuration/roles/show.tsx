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
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title={`Role Details - ${role.name}`} />
            
            <div className="flex h-full flex-1 flex-col p-8 max-w-7xl mx-auto w-full">
                <div className="mb-6 flex items-center text-sm text-slate-500">
                    <Link href="/configuration/roles" className="hover:text-slate-900 transition-colors">Roles</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-slate-900 font-medium">{role.name}</span>
                </div>

                {/* Role Information Card */}
                <Card className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{role.name}</h1>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                {role.users_count} Users
                            </Badge>
                        </div>
                        <p className="text-slate-500">
                            {role.description || 'Tidak ada deskripsi untuk role ini.'}
                        </p>
                    </div>
                </Card>

                {/* Assigned Users Section */}
                <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-4">Pengguna yang Ditetapkan</h2>
                
                <Card className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row gap-3 pb-6 border-b border-slate-100">
                        <form onSubmit={handleSearch} className="relative flex-1 sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <Input
                                placeholder="Cari user..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 border-slate-200 focus-visible:ring-blue-500 rounded-lg"
                            />
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-500 font-medium">
                                    <th className="py-4 px-4 font-medium">Nama User</th>
                                    <th className="py-4 px-4 font-medium">Email</th>
                                    <th className="py-4 px-4 font-medium w-32">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-medium text-xs">
                                                        {user.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-slate-900">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-slate-500">
                                                {user.email}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                    {user.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-12 text-center text-slate-500">
                                            <User className="size-10 mx-auto mb-3 text-slate-300" />
                                            <p className="text-base font-medium text-slate-900">Tidak ada user ditemukan</p>
                                            <p className="text-sm mt-1">Belum ada pengguna yang memiliki role ini atau tidak sesuai dengan kata kunci pencarian.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.total > 0 && (
                        <div className="flex items-center justify-between pt-6 mt-2 border-t border-slate-100">
                            <span className="text-sm text-slate-500">
                                Menampilkan {users.from} - {users.to} dari {users.total} pengguna
                            </span>
                            <div className="flex gap-1">
                                {users.links.map((link, i) => {
                                    const isPrevious = link.label.includes('Previous');
                                    const isNext = link.label.includes('Next');
                                    
                                    if (!link.url && (isPrevious || isNext)) {
                                        return (
                                            <div key={i} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-300 cursor-not-allowed">
                                                {isPrevious ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
                                            </div>
                                        );
                                    }

                                    if (isPrevious || isNext) {
                                        return (
                                            <Link
                                                key={i}
                                                href={link.url || '#'}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                            >
                                                {isPrevious ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
                                            </Link>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
                                                link.active 
                                                    ? 'bg-blue-600 text-white font-medium border border-blue-600' 
                                                    : 'border border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-600'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
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
