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

            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Create Role
                    </h1>
                    <p className="text-slate-500">Tambah role baru</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col lg:flex-row">
                            {/* Left Column - Form */}
                            <div className="flex-1 space-y-8 border-b border-slate-100 p-8 lg:border-r lg:border-b-0">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="name"
                                        className="font-medium text-slate-900"
                                    >
                                        Nama Role
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Masukkan nama role"
                                        className="h-11 rounded-md border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-blue-600"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="guard_name"
                                        className="font-medium text-slate-900"
                                    >
                                        Guard Name
                                    </Label>
                                    <Input
                                        id="guard_name"
                                        value="web"
                                        disabled
                                        className="h-11 rounded-md border-slate-200 bg-slate-50 text-slate-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="description"
                                        className="font-medium text-slate-900"
                                    >
                                        Deskripsi
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Masukkan deskripsi role"
                                        className="resize-none rounded-md border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-blue-600"
                                        value={data.description}
                                        onChange={(e: any) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        rows={6}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Summary */}
                            <div className="w-full space-y-6 p-8 lg:w-100">
                                <h3 className="mb-6 text-lg font-semibold text-slate-900">
                                    Ringkasan
                                </h3>

                                <div className="flex items-center justify-between py-3">
                                    <span className="text-sm text-slate-900">
                                        Jumlah Permission
                                    </span>
                                    <span className="text-sm font-medium text-slate-900">
                                        0
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-sm text-slate-900">
                                        Jumlah User
                                    </span>
                                    <span className="text-sm font-medium text-slate-900">
                                        0
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-sm text-slate-900">
                                        Dibuat oleh
                                    </span>
                                    <span className="text-sm font-medium text-slate-900">
                                        Super Admin
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-sm text-slate-900">
                                        Dibuat pada
                                    </span>
                                    <span className="text-sm font-medium text-slate-900">
                                        4 Juni 2025, 10:45
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="mt-4 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 border-slate-200 px-8 font-medium text-slate-900 transition hover:bg-slate-50"
                            asChild
                        >
                            <Link href="/configuration/roles">Batal</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 bg-blue-600 px-8 font-medium text-white transition hover:bg-blue-700"
                        >
                            Simpan
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
