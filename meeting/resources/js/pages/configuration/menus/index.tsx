import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter, Eye, PenLine, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { MenuData } from '@/types/configuration';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import * as Icons from 'lucide-react';

type Props = {
    menuData: {
        data: MenuData[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        from?: number;
        to?: number;
        total?: number;
        links?: { url: string | null; label: string; active: boolean }[];
    };
};

export default function MenusIndex({ menuData }: Props) {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState<MenuData | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        route: '',
        icon: '',
        order: '0',
        status: true,
        parent_id: '',
    });

    const handleToggleStatus = (menuId: string) => {
        router.post(`/configuration/menus/${menuId}/toggle`, {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const openCreateModal = () => {
        setEditingMenu(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (menu: MenuData) => {
        setEditingMenu(menu);
        setData({
            name: menu.name,
            route: menu.route || '',
            icon: menu.icon || '',
            order: menu.order?.toString() || '0',
            status: menu.status,
            parent_id: menu.parent_id?.toString() || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingMenu) {
            put(`/configuration/menus/${editingMenu.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post('/configuration/menus', {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/configuration/menus',
            { search },
            { preserveState: true, preserveScroll: true }
        );
    };

    const renderIcon = (iconName: string | null) => {
        if (!iconName) return null;
        // @ts-ignore
        const IconComponent = Icons[iconName];
        return IconComponent ? <IconComponent className="size-4" /> : null;
    };

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Menus" />
            
            <div className="flex h-full flex-1 flex-col p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Menus</h1>
                        <p className="text-slate-500">Daftar menu navigasi sistem</p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white transition">
                        <Plus className="mr-2 size-4" />
                        Add Menu
                    </Button>
                </div>

                <Card className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row gap-3 pb-6">
                        <form onSubmit={handleSearch} className="flex flex-1 items-center">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="search"
                                    placeholder="Cari menu..."
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
                                    <th className="py-3 px-4 font-medium">Nama Menu</th>
                                    <th className="py-3 px-4 font-medium">Route / URL</th>
                                    <th className="py-3 px-4 font-medium text-center">Icon</th>
                                    <th className="py-3 px-4 font-medium text-center">Urutan</th>
                                    <th className="py-3 px-4 font-medium text-center">Status</th>
                                    <th className="py-3 px-4 font-medium text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuData.data.length > 0 ? menuData.data.map((menu, index) => (
                                    <tr key={menu.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-4 text-center text-slate-500">
                                            {(menuData.from ?? ((menuData.current_page - 1) * 15 + 1)) + index}
                                        </td>
                                        <td className="py-4 px-4 font-bold text-slate-900">
                                            {menu.name}
                                            {menu.parent_name && (
                                                <span className="text-xs text-slate-500 font-normal ml-2">
                                                    (Sub: {menu.parent_name})
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-slate-600">
                                            {menu.route || '-'}
                                        </td>
                                        <td className="py-4 px-4 text-center text-slate-500 flex justify-center">
                                            {renderIcon(menu.icon)}
                                        </td>
                                        <td className="py-4 px-4 text-center text-slate-600">
                                            {menu.order}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {menu.status ? (
                                                <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full cursor-pointer" onClick={() => handleToggleStatus(menu.id)}>
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center text-xs font-medium text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full cursor-pointer" onClick={() => handleToggleStatus(menu.id)}>
                                                    Nonaktif
                                                </span>
                                            )}
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
                                                    onClick={() => openEditModal(menu)}
                                                >
                                                    <PenLine className="size-4" />
                                                </Button>
                                                <Button 
                                                    type="button"
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="size-8 text-slate-400 hover:text-red-600 transition"
                                                    onClick={() => {
                                                        if (window.confirm(`Yakin ingin menghapus menu ${menu.name}?`)) {
                                                            router.delete(`/configuration/menus/${menu.id}`, {
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
                                        <td colSpan={7} className="py-8 text-center text-slate-500">
                                            Tidak ada data menu yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {menuData.data.length > 0 && (
                        <div className="pt-4 flex items-center justify-between text-sm border-t border-slate-100">
                            <div className="text-slate-500">
                                Showing {menuData.from || 0} to {menuData.to || 0} of {menuData.total || menuData.data.length} results
                            </div>
                            <div className="flex items-center gap-1">
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="size-8 rounded-md border-slate-200 text-slate-500"
                                    disabled={!menuData.prev_page_url}
                                    onClick={() => menuData.prev_page_url && router.get(menuData.prev_page_url)}
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>
                                
                                {menuData.links ? menuData.links.filter(l => !l.label.includes('Next') && !l.label.includes('Previous') && !l.label.includes('&laquo;') && !l.label.includes('&raquo;')).map((link, i) => (
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
                                        {menuData.current_page}
                                    </Button>
                                )}

                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="size-8 rounded-md border-slate-200 text-slate-500"
                                    disabled={!menuData.next_page_url}
                                    onClick={() => menuData.next_page_url && router.get(menuData.next_page_url)}
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
                            <DialogTitle>{editingMenu ? 'Edit Menu' : 'Tambah Menu'}</DialogTitle>
                            <DialogDescription>
                                {editingMenu 
                                    ? 'Ubah konfigurasi menu yang sudah ada.' 
                                    : 'Tambahkan menu baru. Sistem akan secara otomatis membuat 4 permission dasar untuk menu ini.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Menu</Label>
                                    <Input
                                        id="name"
                                        placeholder="Contoh: Users Management"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="border-slate-200 focus-visible:ring-blue-600 rounded-md"
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="route">Route (URL Path)</Label>
                                    <Input
                                        id="route"
                                        placeholder="Contoh: /configuration/users"
                                        value={data.route}
                                        onChange={(e) => setData('route', e.target.value)}
                                        className="border-slate-200 focus-visible:ring-blue-600 rounded-md"
                                    />
                                    {errors.route && <p className="text-sm text-red-500">{errors.route}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="icon">Ikon (Lucide)</Label>
                                        <Input
                                            id="icon"
                                            placeholder="Contoh: Users"
                                            value={data.icon}
                                            onChange={(e) => setData('icon', e.target.value)}
                                            className="border-slate-200 focus-visible:ring-blue-600 rounded-md"
                                        />
                                        {errors.icon && <p className="text-sm text-red-500">{errors.icon}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="order">Urutan</Label>
                                        <Input
                                            id="order"
                                            type="number"
                                            min="0"
                                            value={data.order}
                                            onChange={(e) => setData('order', e.target.value)}
                                            className="border-slate-200 focus-visible:ring-blue-600 rounded-md"
                                        />
                                        {errors.order && <p className="text-sm text-red-500">{errors.order}</p>}
                                    </div>
                                </div>
                                {!editingMenu && (
                                    <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-md mt-2">
                                        <strong>Informasi:</strong> Permission otomatis akan menggunakan nama menu yang dikonversi (misal: "Users Management" menjadi "users_management.read").
                                    </div>
                                )}
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
