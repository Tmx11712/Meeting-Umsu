import { Head, Link, router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter, Eye, PenLine, Trash2, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { RoleData } from '@/types/configuration';
import { useState } from 'react';

type Props = {
    roles: {
        data: RoleData[];
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

export default function RolesIndex({ roles, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/configuration/roles',
            { search },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Role Management" />
            
            <div className="flex h-full flex-1 flex-col p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Roles</h1>
                        <p className="text-slate-500">Daftar semua role sistem</p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white transition">
                        <Link href="/configuration/roles/create">
                            <Plus className="mr-2 size-4" />
                            Add Role
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
                                    placeholder="Cari role..."
                                    className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 w-full"
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
                                    <th className="py-3 px-4 font-medium">Nama Role</th>
                                    <th className="py-3 px-4 font-medium">Deskripsi</th>
                                    <th className="py-3 px-4 font-medium text-center">Jumlah User</th>
                                    <th className="py-3 px-4 font-medium text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.data.length > 0 ? roles.data.map((role, index) => (
                                    <tr key={role.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-4 text-center text-slate-500">
                                            {(roles.from ?? ((roles.current_page - 1) * 10 + 1)) + index}
                                        </td>
                                        <td className="py-4 px-4 font-bold text-slate-900">
                                            {role.name}
                                        </td>
                                        <td className="py-4 px-4 text-slate-500">
                                            {role.description || '-'}
                                        </td>
                                        <td className="py-4 px-4 text-center text-slate-500">
                                            {role.users_count || 0}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <Link href={`/configuration/roles/${role.id}`} className="text-slate-400 hover:text-slate-600 transition">
                                                    <Eye className="size-4" />
                                                </Link>
                                                <Link href={`/configuration/roles/${role.id}/edit`} className="text-slate-400 hover:text-slate-600 transition">
                                                    <PenLine className="size-4" />
                                                </Link>
                                                {role.name !== 'Super Admin' && role.name !== 'Administrator' ? (
                                                    <button 
                                                        type="button"
                                                        className="text-slate-400 hover:text-red-600 transition"
                                                        onClick={() => {
                                                            if (window.confirm(`Yakin ingin menghapus role ${role.name}?`)) {
                                                                router.delete(`/configuration/roles/${role.id}`, {
                                                                    preserveScroll: true,
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                ) : (
                                                    <div className="size-4" /> // Empty placeholder for alignment
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-500">
                                            Tidak ada data role yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {roles.data.length > 0 && (
                        <div className="pt-4 flex items-center justify-between text-sm border-t border-slate-100">
                            <div className="text-slate-500">
                                Showing {roles.from || 0} to {roles.to || 0} of {roles.total || roles.data.length} results
                            </div>
                            <div className="flex items-center gap-1">
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="size-8 rounded-md border-slate-200 text-slate-500"
                                    disabled={!roles.prev_page_url}
                                    onClick={() => roles.prev_page_url && router.get(roles.prev_page_url)}
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>
                                
                                {roles.links ? roles.links.filter(l => !l.label.includes('Next') && !l.label.includes('Previous') && !l.label.includes('&laquo;') && !l.label.includes('&raquo;')).map((link, i) => (
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
                                )) : (
                                    <Button
                                        variant="default"
                                        size="icon"
                                        className="size-8 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        {roles.current_page}
                                    </Button>
                                )}

                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="size-8 rounded-md border-slate-200 text-slate-500"
                                    disabled={!roles.next_page_url}
                                    onClick={() => roles.next_page_url && router.get(roles.next_page_url)}
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
