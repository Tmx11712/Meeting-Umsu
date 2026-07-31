import { usePage } from '@inertiajs/react';
import { useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Role-based permission mapping for the eNotulen system.
 * Defines which roles can perform write operations on each resource.
 */
const ROLE_PERMISSIONS: Record<string, string[]> = {
    meeting: ['Super Admin', 'Administrator', 'Bag. Umum'],
    recording: ['Super Admin', 'Administrator', 'Bag. Humas'],
    transcript: ['Super Admin', 'Administrator', 'Bag. Umum'],
    attendance: ['Super Admin', 'Administrator', 'Bag. Umum'],
    review: ['Super Admin', 'Administrator', 'Bag. Umum'],
    approval: ['Super Admin', 'Administrator', 'Pimpinan'],
    minutes: ['Super Admin', 'Administrator', 'Bag. Umum', 'Pimpinan'],
    report: ['Super Admin', 'Administrator', 'Bag. Umum', 'Pimpinan'],
    configuration: ['Super Admin', 'Administrator'],
};

/** Roles that have full admin capabilities */
const ADMIN_ROLES = ['Super Admin', 'Administrator'];

type PermissionResource = keyof typeof ROLE_PERMISSIONS;

export function usePermissions() {
    const page = usePage<any>();
    const roles: string[] = page.props.auth?.roles || [];

    /** Check if the current user has any of the specified roles */
    const hasRole = useCallback(
        (...checkRoles: string[]) => {
            return checkRoles.some((role) => roles.includes(role));
        },
        [roles],
    );

    /** Check if the user is a Super Admin or Administrator */
    const isAdmin = hasRole(...ADMIN_ROLES);

    /** Check if the current user can edit a specific resource */
    const canEdit = useCallback(
        (resource: PermissionResource) => {
            const allowedRoles = ROLE_PERMISSIONS[resource];

            if (!allowedRoles) {
return isAdmin;
} // Default: only admins

            return roles.some((role) => allowedRoles.includes(role));
        },
        [roles, isAdmin],
    );

    /** Check if the user can manage configuration */
    const canManageConfiguration = isAdmin;

    /**
     * Guard an action: if user doesn't have permission, show toast and return false.
     * Usage: if (!guardAction('meeting')) return;
     */
    const guardAction = useCallback(
        (resource: PermissionResource, customMessage?: string) => {
            if (canEdit(resource)) {
return true;
}

            toast.error(
                customMessage || 'Anda tidak memiliki akses untuk melakukan aksi ini.',
            );

            return false;
        },
        [canEdit],
    );

    return {
        roles,
        hasRole,
        isAdmin,
        canEdit,
        canManageConfiguration,
        guardAction,
    };
}
