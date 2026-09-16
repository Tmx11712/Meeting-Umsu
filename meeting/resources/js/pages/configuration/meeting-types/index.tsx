import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';

export default function MeetingTypesIndex({ types }: { types: any }) {
    const [name, setName] = useState('');
    const [isEditing, setIsEditing] = useState<any>(null);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (isEditing) {
            router.put(`/configuration/meeting-types/${isEditing.id}`, { name, is_active: true }, {
                onSuccess: () => {
                    setName('');
                    setIsEditing(null);
                }
            });
        } else {
            router.post('/configuration/meeting-types', { name, is_active: true }, {
                onSuccess: () => {
                    setName('');
                }
            });
        }
    };

    const handleEdit = (type: any) => {
        setIsEditing(type);
        setName(type.name);
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus tipe rapat ini?')) {
            router.delete(`/configuration/meeting-types/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Tipe Rapat" />
            
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.get('/configuration')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tipe Rapat</h1>
                        <p className="text-sm text-slate-500">Kelola daftar pilihan tipe rapat</p>
                    </div>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
                        <Input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Nama tipe rapat" 
                            required 
                            className="max-w-sm"
                        />
                        <Button type="submit">
                            {isEditing ? 'Simpan' : 'Tambah'}
                        </Button>
                        {isEditing && (
                            <Button type="button" variant="outline" onClick={() => { setIsEditing(null); setName(''); }}>
                                Batal
                            </Button>
                        )}
                    </form>

                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-slate-900">Nama Tipe Rapat</th>
                                    <th className="px-6 py-3 font-medium text-slate-900 w-32 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {types.data.map((type: any) => (
                                    <tr key={type.id} className="bg-white hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{type.name}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(type)} className="text-blue-600">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(type.id)} className="text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {types.data.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-8 text-center text-slate-500">
                                            Belum ada tipe rapat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
