import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, Filter, Eye, PenLine, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
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
            { preserveState: true, preserveScroll: true }
        );
    };

    const getRoleStyles = (roleName: string) => {
        switch (roleName) {
            case 'Bag. Umum':
                return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
            case 'Bag. Humas':
                return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
            case 'Pimpinan':
                return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
            case 'Administrator':
            case 'Super Admin':
                return 'bg-red-100 text-red-700 hover:bg-red-200';
            default:
                return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
        }
    };

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Users" />
            
            <div className="flex h-full flex-1 flex-col p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Users</h1>
                        <p className="text-slate-500">Daftar semua pengguna sistem</p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Link href="/configuration/users/create">
                            <Plus className="mr-2 size-4" />
                            Add User
                        </Link>
                    </Button>
                </div>

                <Card className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row gap-3 pb-6">
                        <form onSubmit={handleSearch} className="flex flex-1 items-center">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="search"
                                    placeholder="Cari pengguna..."
                                    className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </form>
                        <Button variant="outline" className="text-slate-600 border-slate-200 gap-2">
                            <Filter className="size-4" />
                            Filter
                        </Button>
                    </div>
                    
                    <div className="overflow-x-auto pb-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500 text-left">
                                    <th className="py-3 px-4 font-medium w-16 text-center">No</th>
                                    <th className="py-3 px-4 font-medium">Nama</th>
                                    <th className="py-3 px-4 font-medium">Email</th>
                                    <th className="py-3 px-4 font-medium">Role</th>
                                    <th className="py-3 px-4 font-medium">Status</th>
                                    <th className="py-3 px-4 font-medium text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length > 0 ? users.data.map((user, index) => (
                                    <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-4 text-center text-slate-500">
                                            {(users.current_page - 1) * 10 + index + 1}
                                        </td>
                                        <td className="py-4 px-4 font-bold text-slate-900">
                                            {user.name}
                                        </td>
                                        <td className="py-4 px-4 text-slate-500">
                                            {user.email}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.length > 0 ? (
                                                    user.roles.map(r => (
                                                        <span key={r.id} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleStyles(r.name)}`}>
                                                            {r.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">No role</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {user.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <Link 
                                                    href={`/configuration/users/${user.id}`}
                                                    className="text-slate-400 hover:text-slate-600 transition"
                                                >
                                                    <Eye className="size-4" />
                                                </Link>
                                                <Link 
                                                    href={`/configuration/users/${user.id}/edit`}
                                                    className="text-slate-400 hover:text-slate-600 transition"
                                                >
                                                    <PenLine className="size-4" />
                                                </Link>
                                                {user.name !== 'Super Admin' && (
                                                    <button 
                                                        type="button"
                                                        className="text-slate-400 hover:text-red-600 transition"
                                                        onClick={() => {
                                                            if (window.confirm(`Yakin ingin menghapus user ${user.name}?`)) {
                                                                router.delete(`/configuration/users/${user.id}`, {
                                                                    preserveScroll: true,
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500">
                                            Tidak ada data pengguna yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {users.total > 0 && (
                        <div className="pt-4 flex items-center justify-between text-sm border-t border-slate-100">
                            <div className="text-slate-500">
                                Showing {users.from} to {users.to} of {users.total} results
                            </div>
                            <div className="flex items-center gap-1">
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="size-8 rounded-md border-slate-200 text-slate-500"
                                    disabled={!users.prev_page_url}
                                    onClick={() => users.prev_page_url && router.get(users.prev_page_url)}
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>
                                
                                {users.links.filter(l => !l.label.includes('Next') && !l.label.includes('Previous')).map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? "default" : "outline"}
                                        size="icon"
                                        className={`size-8 rounded-md ${link.active ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </Button>
                                ))}

                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="size-8 rounded-md border-slate-200 text-slate-500"
                                    disabled={!users.next_page_url}
                                    onClick={() => users.next_page_url && router.get(users.next_page_url)}
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
