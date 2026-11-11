import { Head, router } from '@inertiajs/react';
import { Save, ChevronDown, ChevronRight, ShieldCheck } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import AppLayout from '@/layouts/app-layout';
import type { RoleData, PermissionGroup } from '@/types/configuration';

type Props = {
    roles: Pick<RoleData, 'id' | 'name'>[];
    selectedRoleId: string | null;
    permissionsGrouped: PermissionGroup[];
    rolePermissions: string[];
};

export default function RolePermissionsIndex({
    roles,
    selectedRoleId,
    permissionsGrouped,
    rolePermissions: initialRolePermissions,
}: Props) {
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
        new Set(initialRolePermissions),
    );
    const [isSaving, setIsSaving] = useState(false);

    const [openModules, setOpenModules] = useState<Record<string, boolean>>(
        permissionsGrouped.reduce(
            (acc, curr) => ({ ...acc, [curr.group]: true }),
            {},
        ),
    );

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            '/configuration/role-permissions',
            { role_id: e.target.value },
            { preserveState: false },
        );
    };

    const togglePermission = (permissionName: string) => {
        const newSet = new Set(selectedPermissions);

        if (newSet.has(permissionName)) {
            newSet.delete(permissionName);
        } else {
            newSet.add(permissionName);
        }

        setSelectedPermissions(newSet);
    };

    const toggleModule = (moduleGroup: string, forceState?: boolean) => {
        const modulePermissions =
            permissionsGrouped
                .find((g) => g.group === moduleGroup)
                ?.permissions.map((p) => p.name) || [];
        const allSelected = modulePermissions.every((p) =>
            selectedPermissions.has(p),
        );

        const newState = forceState !== undefined ? forceState : !allSelected;

        const newSet = new Set(selectedPermissions);

        if (!newState) {
            modulePermissions.forEach((p) => newSet.delete(p));
        } else {
            modulePermissions.forEach((p) => newSet.add(p));
        }

        setSelectedPermissions(newSet);
    };

    const toggleCollapse = (group: string) => {
        setOpenModules((prev) => ({ ...prev, [group]: !prev[group] }));
    };

    const savePermissions = () => {
        if (!selectedRoleId) {
            return;
        }

        setIsSaving(true);
        router.put(
            `/configuration/role-permissions/${selectedRoleId}`,
            { permissions: Array.from(selectedPermissions) },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const allPermissionsCount = useMemo(() => {
        return permissionsGrouped.reduce(
            (acc, g) => acc + g.permissions.length,
            0,
        );
    }, [permissionsGrouped]);

    const isAllSelectedGlobal =
        selectedPermissions.size === allPermissionsCount &&
        allPermissionsCount > 0;

    const toggleAllGlobal = (checked: boolean) => {
        const newSet = new Set<string>();

        if (checked) {
            permissionsGrouped.forEach((g) => {
                g.permissions.forEach((p) => newSet.add(p.name));
            });
        }

        setSelectedPermissions(newSet);
    };

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Role Permissions" />

            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col p-8">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Role Permissions
                        </h1>
                        <p className="text-slate-500">
                            Pemetaan hak akses sistem ke peran pengguna.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    {/* Role Selector Sidebar */}
                    <div className="md:col-span-1">
                        <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                                <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                                    <ShieldCheck className="size-5 text-blue-600" />
                                    Pilih Role
                                </h2>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-6 p-6">
                                <div className="space-y-2">
                                    <select
                                        className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                                        value={selectedRoleId || ''}
                                        onChange={handleRoleChange}
                                    >
                                        <option value="" disabled>
                                            Pilih Role...
                                        </option>
                                        {roles.map((role) => (
                                            <option
                                                key={role.id}
                                                value={role.id}
                                            >
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedRoleId && (
                                    <Button
                                        className="h-11 w-full bg-blue-600 font-medium text-white hover:bg-blue-700"
                                        onClick={savePermissions}
                                        disabled={isSaving}
                                    >
                                        <Save className="mr-2 size-4" />
                                        {isSaving
                                            ? 'Menyimpan...'
                                            : 'Simpan Perubahan'}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Permissions Matrix */}
                    <div className="md:col-span-3">
                        {!selectedRoleId ? (
                            <Card className="flex h-100 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                                <ShieldCheck className="mb-4 size-12 text-slate-300" />
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Pilih Role
                                </h3>
                                <p className="mt-2 max-w-sm text-slate-500">
                                    Silakan pilih role dari panel di sebelah
                                    kiri untuk melihat dan mengubah hak
                                    aksesnya.
                                </p>
                            </Card>
                        ) : (
                            <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Konfigurasi
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="selectAllGlobal"
                                            checked={isAllSelectedGlobal}
                                            onCheckedChange={(checked) =>
                                                toggleAllGlobal(
                                                    checked as boolean,
                                                )
                                            }
                                            className="rounded-sm border-slate-300 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                        />
                                        <label
                                            htmlFor="selectAllGlobal"
                                            className="cursor-pointer text-sm leading-none font-medium text-slate-700"
                                        >
                                            Select All
                                        </label>
                                    </div>
                                </div>
                                <div className="p-0">
                                    {permissionsGrouped.map((module) => {
                                        const allSelected =
                                            module.permissions.length > 0 &&
                                            module.permissions.every((p) =>
                                                selectedPermissions.has(p.name),
                                            );
                                        const someSelected =
                                            module.permissions.some((p) =>
                                                selectedPermissions.has(p.name),
                                            );
                                        const isOpen =
                                            openModules[module.group];

                                        return (
                                            <Collapsible
                                                key={module.group}
                                                open={isOpen}
                                                onOpenChange={() =>
                                                    toggleCollapse(module.group)
                                                }
                                                className="border-b border-slate-100 last:border-0"
                                            >
                                                <div
                                                    className={`flex items-center justify-between p-4 transition-colors ${isOpen ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/50'}`}
                                                >
                                                    <div
                                                        className="flex flex-1 cursor-pointer items-center gap-3"
                                                        onClick={() =>
                                                            toggleCollapse(
                                                                module.group,
                                                            )
                                                        }
                                                    >
                                                        <CollapsibleTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-6 p-0 text-slate-500 hover:bg-transparent"
                                                            >
                                                                {isOpen ? (
                                                                    <ChevronDown className="size-4" />
                                                                ) : (
                                                                    <ChevronRight className="size-4" />
                                                                )}
                                                            </Button>
                                                        </CollapsibleTrigger>
                                                        <div className="text-sm font-semibold tracking-wide text-slate-900 uppercase">
                                                            {module.group}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center space-x-2 rounded-md border border-slate-200 bg-white px-3 py-1.5">
                                                            <Checkbox
                                                                id={`selectAll-${module.group}`}
                                                                checked={
                                                                    allSelected
                                                                }
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    toggleModule(
                                                                        module.group,
                                                                        checked as boolean,
                                                                    )
                                                                }
                                                                className="rounded-sm border-slate-300 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                                            />
                                                            <label
                                                                htmlFor={`selectAll-${module.group}`}
                                                                className="cursor-pointer text-xs leading-none font-medium text-slate-700"
                                                            >
                                                                Select All
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <CollapsibleContent>
                                                    <div className="grid grid-cols-1 gap-4 bg-white p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                        {module.permissions.map(
                                                            (permission) => (
                                                                <div
                                                                    key={
                                                                        permission.name
                                                                    }
                                                                    className="flex items-start space-x-3"
                                                                >
                                                                    <Checkbox
                                                                        id={
                                                                            permission.name
                                                                        }
                                                                        checked={selectedPermissions.has(
                                                                            permission.name,
                                                                        )}
                                                                        onCheckedChange={() =>
                                                                            togglePermission(
                                                                                permission.name,
                                                                            )
                                                                        }
                                                                        className="mt-0.5 rounded-sm border-slate-300 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                                                    />
                                                                    <div className="space-y-1">
                                                                        <label
                                                                            htmlFor={
                                                                                permission.name
                                                                            }
                                                                            className="cursor-pointer text-sm leading-none font-medium text-slate-700"
                                                                        >
                                                                            {
                                                                                permission.name
                                                                            }
                                                                        </label>
                                                                        {permission.description && (
                                                                            <p className="text-xs leading-snug text-slate-500">
                                                                                {
                                                                                    permission.description
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        );
                                    })}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
