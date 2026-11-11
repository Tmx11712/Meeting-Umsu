import { usePage } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';
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

const RESOURCE_DIRECT_PERMISSIONS: Record<string, string[]> = {
    meeting: ['meeting.update', 'meeting.create'],
    recording: ['recording.create', 'recording.update'],
    transcript: ['transcript.update', 'transcript.create'],
    attendance: ['attendance.update', 'attendance.create'],
    review: ['minute.update', 'minute.create'],
    approval: ['minute.update'],
    minutes: ['minute.update'],
    report: ['report.read'],
};

/** Roles that have full admin capabilities */
const ADMIN_ROLES = ['Super Admin', 'Administrator'];
const STANDARD_ROLES = [
    'Super Admin',
    'Administrator',
    'Bag. Umum',
    'Bag. Humas',
    'Pimpinan',
    'Viewer',
];

type PermissionResource = keyof typeof ROLE_PERMISSIONS;

export function usePermissions() {
    const page = usePage<any>();
    const authRoles = page.props.auth?.roles;
    const authPermissions = page.props.auth?.permissions;
    const roles: string[] = useMemo(() => authRoles || [], [authRoles]);
    const permissions: string[] = useMemo(
        () => authPermissions || [],
        [authPermissions],
    );

    /** Check if the current user has any of the specified roles */
    const hasRole = useCallback(
        (...checkRoles: string[]) => {
            return checkRoles.some((role) => roles.includes(role));
        },
        [roles],
    );

    const hasPermission = useCallback(
        (permission: string) => permissions.includes(permission),
        [permissions],
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

            if (roles.some((role) => allowedRoles.includes(role))) {
                return true;
            }

            // Fallback untuk custom role / direct user permission di luar 6 role bawaan
            const hasStandardRole = roles.some((role) =>
                STANDARD_ROLES.includes(role),
            );

            if (!hasStandardRole) {
                const requiredPerms =
                    RESOURCE_DIRECT_PERMISSIONS[resource] || [];

                return requiredPerms.some((perm) => permissions.includes(perm));
            }

            return false;
        },
        [roles, permissions, isAdmin],
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
                customMessage ||
                    'Anda tidak memiliki akses untuk melakukan aksi ini.',
            );

            return false;
        },
        [canEdit],
    );

    return {
        roles,
        permissions,
        hasRole,
        hasPermission,
        isAdmin,
        canEdit,
        canManageConfiguration,
        guardAction,
    };
}
