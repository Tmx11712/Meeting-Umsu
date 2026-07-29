import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { RoleData } from '@/types/configuration';

type Props = {
    user: {
        id: string;
        name: string;
        email: string;
        status: string;
        role_id?: string;
    };
    roles: Pick<RoleData, 'id' | 'name' | 'description'>[];
};

export default function UsersEdit({ user, roles }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        username: user.email?.split('@')[0] || '',
        password: '',
        role_id: user.role_id?.toString() || '',
        status: user.status || 'aktif',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/configuration/users/${user.id}`);
    };

    const selectedRole = roles.find(r => r.id.toString() === data.role_id);

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Edit User" />
            
            <div className="flex h-full flex-1 flex-col p-8 max-w-7xl mx-auto w-full">
                <div className="mb-6 flex items-center text-sm text-slate-500">
                    <Link href="/configuration/users" className="hover:text-slate-900 transition-colors">Users</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-slate-900 font-medium">Edit User</span>
                </div>

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit User</h1>
                    <p className="text-slate-500">Edit informasi pengguna dan role</p>
                </div>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Column - Form */}
                    <Card className="flex-1 w-full rounded-xl border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg font-bold text-slate-900">Informasi User</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-700">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    placeholder="Masukkan nama lengkap"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="border-slate-200 focus-visible:ring-blue-500 rounded-lg"
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Masukkan email"
                                    value={data.email}
                                    onChange={e => {
                                        setData('email', e.target.value);

                                        if (!data.username) {
                                            setData('username', e.target.value.split('@')[0]);
                                        }
                                    }}
                                    className="border-slate-200 focus-visible:ring-blue-500 rounded-lg"
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-slate-700">Username</Label>
                                <Input
                                    id="username"
                                    placeholder="Masukkan username"
                                    value={data.username}
                                    onChange={e => setData('username', e.target.value)}
                                    className="border-slate-200 focus-visible:ring-blue-500 rounded-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700">Password (Opsional)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Kosongkan jika tidak ingin mengubah"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="border-slate-200 focus-visible:ring-blue-500 rounded-lg"
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-slate-700">Status</Label>
                                <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                    <SelectTrigger className="border-slate-200 focus:ring-blue-500 rounded-lg">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="aktif">Aktif</SelectItem>
                                        <SelectItem value="nonaktif">Nonaktif</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column - Role Selection */}
                    <div className="flex flex-col gap-6 w-full lg:w-[400px]">
                        <Card className="rounded-xl border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg font-bold text-slate-900">Role</CardTitle>
                                <CardDescription className="text-slate-500">Pilih role untuk user ini</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-700">Role</Label>
                                    <Select value={data.role_id} onValueChange={(val) => setData('role_id', val)}>
                                        <SelectTrigger className="border-slate-200 focus:ring-blue-500 rounded-lg">
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map(role => (
                                                <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role_id && <p className="text-sm text-red-500">{errors.role_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700">Deskripsi</Label>
                                    <Textarea 
                                        readOnly 
                                        value={selectedRole?.description || 'Silakan pilih role untuk melihat deskripsi.'}
                                        className="resize-none h-24 bg-slate-50 border-slate-200 text-slate-600 rounded-lg" 
                                    />
                                </div>
                                
                                <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Dibuatkan oleh</span>
                                        <span className="font-bold text-slate-900">Super Admin</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Dibuatkan pada</span>
                                        <span className="font-bold text-slate-900">4 Juni 2025, 10:30</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-end gap-3 mt-2">
                            <Button type="button" variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900" asChild>
                                <Link href="/configuration/users">Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                                Simpan Perubahan
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
