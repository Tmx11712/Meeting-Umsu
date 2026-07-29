import { Head, router } from '@inertiajs/react';
import { Search, Save, UserX, ShieldBan, Info, ChevronDown, ChevronRight, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { PermissionGroup } from '@/types/configuration';

type Props = {
    users: {
        id: string;
        name: string;
        email: string;
        initials: string;
        roles: string[];
    }[];
    searchQuery: string;
    selectedUserId: string | null;
    selectedUser: {
        id: string;
        name: string;
        email: string;
        initials: string;
        roles: string[];
    } | null;
    permissionsGrouped: PermissionGroup[];
    userDirectPermissions: string[];
    userRolePermissions: string[];
};

export default function UserPermissionsIndex({ 
    users, 
    searchQuery, 
    selectedUserId, 
    selectedUser, 
    permissionsGrouped, 
    userDirectPermissions,
    userRolePermissions
}: Props) {
    const [search, setSearch] = useState(searchQuery || '');
    const [directPermissions, setDirectPermissions] = useState<Set<string>>(new Set(userDirectPermissions));
    const [isSaving, setIsSaving] = useState(false);
    
    // Open all modules by default
    const [openModules, setOpenModules] = useState<Record<string, boolean>>(
        permissionsGrouped.reduce((acc, curr) => ({ ...acc, [curr.group]: true }), {})
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/configuration/user-permissions',
            { search, user_id: selectedUserId },
            { preserveState: true }
        );
    };

    const handleUserSelect = (userId: string) => {
        router.get(
            '/configuration/user-permissions',
            { search, user_id: userId },
            { preserveState: false }
        );
    };

    const togglePermission = (permissionName: string) => {
        // Can only toggle if it's not inherited from a role
        if (userRolePermissions.includes(permissionName)) {
return;
}

        const newSet = new Set(directPermissions);

        if (newSet.has(permissionName)) {
            newSet.delete(permissionName);
        } else {
            newSet.add(permissionName);
        }

        setDirectPermissions(newSet);
    };

    const toggleModule = (moduleGroup: string, forceState?: boolean) => {
        const modulePermissions = permissionsGrouped.find(g => g.group === moduleGroup)?.permissions.map(p => p.name) || [];
        
        // Exclude permissions already granted via roles
        const togglablePermissions = modulePermissions.filter(p => !userRolePermissions.includes(p));
        
        const allSelected = togglablePermissions.every(p => directPermissions.has(p));
        
        const newState = forceState !== undefined ? forceState : !allSelected;
        
        const newSet = new Set(directPermissions);

        if (!newState) {
            togglablePermissions.forEach(p => newSet.delete(p));
        } else {
            togglablePermissions.forEach(p => newSet.add(p));
        }

        setDirectPermissions(newSet);
    };

    const toggleCollapse = (group: string) => {
        setOpenModules(prev => ({ ...prev, [group]: !prev[group] }));
    };

    const savePermissions = () => {
        if (!selectedUserId) {
return;
}
        
        setIsSaving(true);
        router.put(
            `/configuration/user-permissions/${selectedUserId}`,
            { permissions: Array.from(directPermissions) },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            }
        );
    };

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="User Permissions" />
            
            <div className="flex h-full flex-1 flex-col p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Extra Permissions</h1>
                        <p className="text-slate-500">Berikan hak akses tambahan spesifik untuk pengguna tertentu di luar Role utamanya.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* User Selection Sidebar */}
                    <div className="md:col-span-1">
                        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-[calc(100vh-12rem)] flex flex-col">
                            <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50 flex-none">
                                <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                                    <UserCircle className="size-5 text-blue-600" />
                                    Pilih Pengguna
                                </h2>
                                <form onSubmit={handleSearch}>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="search"
                                            placeholder="Cari user..."
                                            className="pl-9 border-slate-200 focus-visible:ring-blue-600 rounded-md bg-white w-full h-10"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                </form>
                            </CardHeader>
                            <CardContent className="p-0 overflow-y-auto flex-1 bg-white">
                                <div className="divide-y divide-slate-100">
                                    {users.length > 0 ? users.map(user => (
                                        <div 
                                            key={user.id}
                                            onClick={() => handleUserSelect(user.id)}
                                            className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${selectedUserId === user.id ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : 'border-l-4 border-transparent'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium text-xs">
                                                    {user.initials}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="font-medium text-sm text-slate-900 truncate">{user.name}</div>
                                                    <div className="flex gap-1 mt-1">
                                                        {user.roles.length > 0 ? (
                                                            user.roles.map(r => (
                                                                <Badge key={r} variant="outline" className="text-[10px] px-1 py-0 h-4 border-slate-200 text-slate-600">
                                                                    {r}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400 italic">No Role</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                                            <UserX className="size-8 mb-2 opacity-20 text-slate-400" />
                                            <p className="text-sm">User tidak ditemukan</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Permissions Matrix */}
                    <div className="md:col-span-3 flex flex-col gap-4">
                        {!selectedUser ? (
                            <Card className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col items-center justify-center p-12 text-center flex-1 min-h-[400px]">
                                <ShieldBan className="size-12 text-slate-300 mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900">Pilih Pengguna</h3>
                                <p className="text-slate-500 mt-2 max-w-sm">
                                    Cari dan pilih pengguna dari daftar di sebelah kiri untuk mengelola extra permission-nya.
                                </p>
                            </Card>
                        ) : (
                            <>
                                {/* Selected User Info */}
                                <Card className="rounded-xl border border-blue-100 bg-blue-50/30 shadow-sm">
                                    <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg border border-blue-200">
                                                {selectedUser.initials}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg leading-tight text-slate-900">{selectedUser.name}</h3>
                                                <p className="text-sm text-slate-500">{selectedUser.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <div className="flex flex-wrap gap-1 justify-end items-center">
                                                <span className="text-xs text-slate-500 mr-1">Roles:</span>
                                                {selectedUser.roles.length > 0 ? selectedUser.roles.map(r => (
                                                    <Badge key={r} variant="secondary" className="bg-white border border-slate-200 text-slate-700">{r}</Badge>
                                                )) : <Badge variant="outline" className="border-slate-200 text-slate-500">None</Badge>}
                                            </div>
                                            <Button 
                                                onClick={savePermissions} 
                                                disabled={isSaving} 
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition"
                                            >
                                                <Save className="mr-2 size-4" />
                                                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="flex items-start gap-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm mb-2 shadow-sm">
                                    <Info className="size-5 text-blue-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-slate-600 leading-relaxed">
                                            Checkbox yang <span className="opacity-50 line-through text-slate-500">redup</span> menandakan hak akses sudah didapat dari <strong>Role</strong> pengguna. Anda hanya bisa menambah hak akses yang belum dimiliki (Extra Permission).
                                        </p>
                                    </div>
                                </div>

                                <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-12">
                                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                        <h3 className="text-lg font-semibold text-slate-900">Konfigurasi Hak Akses Tambahan</h3>
                                    </div>
                                    <div className="p-0">
                                        {permissionsGrouped.map((module) => {
                                            const togglablePermissions = module.permissions.filter(p => !userRolePermissions.includes(p.name));
                                            const allSelected = togglablePermissions.length > 0 && togglablePermissions.every(p => directPermissions.has(p.name));
                                            const isOpen = openModules[module.group];

                                            return (
                                                <Collapsible 
                                                    key={module.group} 
                                                    open={isOpen}
                                                    onOpenChange={() => toggleCollapse(module.group)}
                                                    className="border-b border-slate-100 last:border-0"
                                                >
                                                    <div className={`flex items-center justify-between p-4 transition-colors ${isOpen ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/50'}`}>
                                                        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleCollapse(module.group)}>
                                                            <CollapsibleTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="size-6 p-0 hover:bg-transparent text-slate-500">
                                                                    {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                                                </Button>
                                                            </CollapsibleTrigger>
                                                            <div className="font-semibold text-slate-900 text-sm uppercase tracking-wide">{module.group}</div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {togglablePermissions.length > 0 && (
                                                                <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-md border border-slate-200">
                                                                    <Checkbox 
                                                                        id={`selectAll-${module.group}`}
                                                                        checked={allSelected}
                                                                        onCheckedChange={(checked) => toggleModule(module.group, checked as boolean)}
                                                                        className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-sm"
                                                                    />
                                                                    <label 
                                                                        htmlFor={`selectAll-${module.group}`}
                                                                        className="text-xs font-medium text-slate-700 leading-none cursor-pointer"
                                                                    >
                                                                        Select All Extra
                                                                    </label>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <CollapsibleContent>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 bg-white">
                                                            {module.permissions.map((permission) => {
                                                                const isFromRole = userRolePermissions.includes(permission.name);
                                                                const isDirect = directPermissions.has(permission.name);
                                                                const isChecked = isFromRole || isDirect;

                                                                return (
                                                                    <div 
                                                                        key={permission.name} 
                                                                        className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
                                                                            isFromRole ? 'bg-slate-50 border-transparent opacity-60' :
                                                                            isDirect ? 'border-blue-200 bg-blue-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                                                                        }`}
                                                                    >
                                                                        <Checkbox 
                                                                            id={permission.name} 
                                                                            checked={isChecked}
                                                                            onCheckedChange={() => togglePermission(permission.name)}
                                                                            disabled={isFromRole}
                                                                            className={`mt-0.5 rounded-sm ${isFromRole ? 'border-slate-300 data-[state=checked]:bg-slate-400 data-[state=checked]:text-white' : 'border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600'}`}
                                                                        />
                                                                        <div className="space-y-1">
                                                                            <label 
                                                                                htmlFor={permission.name} 
                                                                                className={`text-sm leading-none ${isFromRole ? 'cursor-not-allowed text-slate-500' : 'cursor-pointer font-medium text-slate-700'}`}
                                                                            >
                                                                                {permission.name}
                                                                            </label>
                                                                            {isFromRole && (
                                                                                <div className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
                                                                                    Inherited from Role
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            );
                                        })}
                                    </div>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
