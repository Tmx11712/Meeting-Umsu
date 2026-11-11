import { Head, router } from '@inertiajs/react';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

export default function MeetingTypesIndex({ types }: { types: any }) {
    const [name, setName] = useState('');
    const [isEditing, setIsEditing] = useState<any>(null);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (isEditing) {
            router.put(
                `/configuration/meeting-types/${isEditing.id}`,
                { name, is_active: true },
                {
                    onSuccess: () => {
                        setName('');
                        setIsEditing(null);
                    },
                },
            );
        } else {
            router.post(
                '/configuration/meeting-types',
                { name, is_active: true },
                {
                    onSuccess: () => {
                        setName('');
                    },
                },
            );
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

            <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.get('/configuration')}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Tipe Rapat
                        </h1>
                        <p className="text-sm text-slate-500">
                            Kelola daftar pilihan tipe rapat
                        </p>
                    </div>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
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
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(null);
                                    setName('');
                                }}
                            >
                                Batal
                            </Button>
                        )}
                    </form>

                    <div className="overflow-hidden rounded-lg border dark:border-border">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-slate-50 dark:border-border dark:bg-slate-900/60">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-slate-900 dark:text-slate-200">
                                        Nama Tipe Rapat
                                    </th>
                                    <th className="w-32 px-6 py-3 text-right font-medium text-slate-900 dark:text-slate-200">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-slate-800">
                                {types.data.map((type: any) => (
                                    <tr
                                        key={type.id}
                                        className="bg-white hover:bg-slate-50 dark:bg-card dark:hover:bg-slate-800/40"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                                            {type.name}
                                        </td>
                                        <td className="space-x-2 px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(type)}
                                                className="text-blue-600 dark:text-blue-400"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(type.id)
                                                }
                                                className="text-red-600 dark:text-red-400"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {types.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={2}
                                            className="px-6 py-8 text-center text-slate-500"
                                        >
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
