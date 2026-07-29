import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

type Props = {
    role: {
        id: string;
        name: string;
        description: string;
        users_count: number;
        permissions_count: number;
        created_at: string;
    };
};

export default function RolesEdit({ role }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name || '',
        description: role.description || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/configuration/roles/${role.id}`);
    };

    const isSystemRole = role.name === 'Super Admin' || role.name === 'Administrator';

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Edit Role" />
            
            <div className="flex h-full flex-1 flex-col p-8 max-w-7xl mx-auto w-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Role</h1>
                    <p className="text-slate-500">Edit informasi role</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                            {/* Left Column - Form */}
                            <div className="flex-1 p-8 border-b lg:border-b-0 lg:border-r border-slate-100 space-y-8">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-900 font-medium">Nama Role</Label>
                                    <Input
                                        id="name"
                                        placeholder="Masukkan nama role"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        disabled={isSystemRole}
                                        className={`rounded-md border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-11 ${isSystemRole ? 'bg-slate-50 text-slate-500' : ''}`}
                                    />
                                    {isSystemRole && (
                                        <p className="text-xs text-slate-500 mt-1">Nama role sistem bawaan tidak dapat diubah.</p>
                                    )}
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guard_name" className="text-slate-900 font-medium">Guard Name</Label>
                                    <Input
                                        id="guard_name"
                                        value="web"
                                        disabled
                                        className="rounded-md border-slate-200 bg-slate-50 text-slate-500 h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-slate-900 font-medium">Deskripsi</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Masukkan deskripsi role"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows={6}
                                        className="rounded-md border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 focus-visible:border-blue-600 resize-none"
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>
                            </div>

                            {/* Right Column - Summary */}
                            <div className="w-full lg:w-[400px] p-8 space-y-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-6">Ringkasan</h3>
                                
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-sm text-slate-900">Jumlah Permission</span>
                                    <span className="text-sm font-medium text-slate-900">{role.permissions_count}</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-sm text-slate-900">Jumlah User</span>
                                    <span className="text-sm font-medium text-slate-900">{role.users_count}</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-sm text-slate-900">Dibuat oleh</span>
                                    <span className="text-sm font-medium text-slate-900">-</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-sm text-slate-900">Dibuat pada</span>
                                    <span className="text-sm font-medium text-slate-900">
                                        {new Date(role.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex items-center justify-end gap-3 mt-4">
                        <Button type="button" variant="outline" className="border-slate-200 text-slate-900 font-medium hover:bg-slate-50 transition px-8 h-11" asChild>
                            <Link href="/configuration/roles">Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition px-8 h-11">
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
