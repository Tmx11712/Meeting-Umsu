import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Search, Plus, Filter, Eye, PenLine, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { confirmDelete } from '@/lib/sweetalert';
import type { PermissionData } from '@/types/configuration';

type Props = {
    permissions: {
        data: (PermissionData & { roles_count?: number })[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        from?: number;
        to?: number;
        total?: number;
        links?: { url: string | null; label: string; active: boolean }[];
    };
    groups: string[];
    filters: {
        search?: string;
    };
};

export default function PermissionsIndex({ permissions, groups, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState<PermissionData | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        group: '',
        description: '',
    });

    const openCreateModal = () => {
        setEditingPermission(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (permission: PermissionData) => {
        setEditingPermission(permission);
        setData({
            name: permission.name,
            group: permission.group || '',
            description: permission.description || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingPermission) {
            put(`/configuration/permissions/${editingPermission.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/configuration/permissions', {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/configuration/permissions',
            { search },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Permissions" />
            
            <div className="flex h-full flex-1 flex-col p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Permissions</h1>
                        <p className="text-slate-500">Daftar semua permission sistem</p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white transition">
                        <Plus className="mr-2 size-4" />
                        Add Permission
                    </Button>
                </div>

                <Card className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row gap-3 pb-6">
                        <form onSubmit={handleSearch} className="flex flex-1 items-center">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="search"
                                    placeholder="Cari permission..."
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
                                    <th className="py-3 px-4 font-medium">Nama Permission</th>
                                    <th className="py-3 px-4 font-medium">Deskripsi</th>
                                    <th className="py-3 px-4 font-medium text-center">Jumlah Role</th>
                                    <th className="py-3 px-4 font-medium text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.data.length > 0 ? permissions.data.map((permission, index) => (
                                    <tr key={permission.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-4 text-center text-slate-500">
                                            {(permissions.from ?? ((permissions.current_page - 1) * 10 + 1)) + index}
                                        </td>
                                        <td className="py-4 px-4 font-bold text-slate-900">
                                            {permission.name}
                                        </td>
                                        <td className="py-4 px-4 text-slate-500">
                                            {permission.description || '-'}
                                        </td>
                                        <td className="py-4 px-4 text-center text-slate-500">
                                            {permission.roles_count || 0}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="size-8 text-slate-400 hover:text-slate-600 transition"
                                                >
                                                    <Eye className="size-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="size-8 text-slate-400 hover:text-slate-600 transition"
                                                    onClick={() => openEditModal(permission)}
                                                >
                                                    <PenLine className="size-4" />
                                                </Button>
                                                <Button 
                                                    type="button"
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="size-8 text-slate-400 hover:text-red-600 transition"
                                                    onClick={async () => {
                                                        if (await confirmDelete(`Yakin ingin menghapus permission ${permission.name}?`)) {
                                                            router.delete(`/configuration/permissions/${permission.id}`, {
                                                                preserveScroll: true,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-500">
                                            Tidak ada data permission yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {permissions.data.length > 0 && (
                        <div className="pt-4 flex items-center justify-between text-sm border-t border-slate-100">
                            <div className="text-slate-500">
                                Showing {permissions.from || 0} to {permissions.to || 0} of {permissions.total || permissions.data.length} results
                            </div>
                            <div className="flex items-center gap-1">
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="size-8 rounded-md border-slate-200 text-slate-500"
                                    disabled={!permissions.prev_page_url}
                                    onClick={() => permissions.prev_page_url && router.get(permissions.prev_page_url)}
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>
                                
                                {permissions.links ? permissions.links.filter(l => !l.label.includes('Next') && !l.label.includes('Previous') && !l.label.includes('&laquo;') && !l.label.includes('&raquo;')).map((link, i) => (
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
                                        {permissions.current_page}
                                    </Button>
                                )}

                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="size-8 rounded-md border-slate-200 text-slate-500"
                                    disabled={!permissions.next_page_url}
                                    onClick={() => permissions.next_page_url && router.get(permissions.next_page_url)}
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingPermission ? 'Edit Permission' : 'Tambah Permission'}</DialogTitle>
                            <DialogDescription>
                                {editingPermission 
                                    ? 'Ubah informasi permission yang sudah ada.' 
                                    : 'Tambahkan permission baru untuk modul sistem.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Permission</Label>
                                    <Input
                                        id="name"
                                        placeholder="Contoh: users.create"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="border-slate-200 focus-visible:ring-blue-600 rounded-md"
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="group">Modul / Grup (Opsional)</Label>
                                    <Input
                                        id="group"
                                        placeholder="Contoh: Users Management"
                                        value={data.group}
                                        onChange={(e) => setData('group', e.target.value)}
                                        list="group-options"
                                        className="border-slate-200 focus-visible:ring-blue-600 rounded-md"
                                    />
                                    <datalist id="group-options">
                                        {groups?.map((group) => (
                                            <option key={group} value={group} />
                                        ))}
                                    </datalist>
                                    {errors.group && <p className="text-sm text-red-500">{errors.group}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Deskripsi (Opsional)</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Penjelasan fungsi permission ini..."
                                        value={data.description}
                                        onChange={(e: any) => setData('description', e.target.value)}
                                        className="border-slate-200 focus-visible:ring-blue-600 rounded-md resize-none"
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>
                            </div>
                            <DialogFooter className="mt-4 gap-2">
                                <Button type="button" variant="outline" className="border-slate-200" onClick={() => setIsModalOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
