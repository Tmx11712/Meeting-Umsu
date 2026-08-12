import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

export default function RolesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/configuration/roles');
    };

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Create Role" />
            
            <div className="flex h-full flex-1 flex-col p-8 max-w-7xl mx-auto w-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Role</h1>
                    <p className="text-slate-500">Tambah role baru</p>
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
                                        className="rounded-md border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 focus-visible:border-blue-600 h-11"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
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
                                        className="rounded-md border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 focus-visible:border-blue-600 resize-none"
                                        value={data.description}
                                        onChange={(e: any) => setData('description', e.target.value)}
                                        rows={6}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>
                            </div>

                            {/* Right Column - Summary */}
                            <div className="w-full lg:w-[400px] p-8 space-y-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-6">Ringkasan</h3>
                                
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-sm text-slate-900">Jumlah Permission</span>
                                    <span className="text-sm font-medium text-slate-900">0</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-sm text-slate-900">Jumlah User</span>
                                    <span className="text-sm font-medium text-slate-900">0</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-sm text-slate-900">Dibuat oleh</span>
                                    <span className="text-sm font-medium text-slate-900">Super Admin</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-sm text-slate-900">Dibuat pada</span>
                                    <span className="text-sm font-medium text-slate-900">4 Juni 2025, 10:45</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex items-center justify-end gap-3 mt-4">
                        <Button type="button" variant="outline" className="border-slate-200 text-slate-900 font-medium hover:bg-slate-50 transition px-8 h-11" asChild>
                            <Link href="/configuration/roles">Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition px-8 h-11">
                            Simpan
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
