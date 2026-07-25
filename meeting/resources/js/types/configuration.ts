export type RoleData = {
    id: string;
    name: string;
    description: string | null;
    guard_name: string;
    users_count?: number;
    permissions_count?: number;
};

export type PermissionData = {
    id: string;
    name: string;
    group: string | null;
    description: string | null;
    guard_name: string;
};

export type MenuData = {
    id: string;
    name: string;
    route: string | null;
    icon: string | null;
    order: number;
    status: boolean;
    parent_id: string | null;
    parent_name?: string | null;
};

export type UserManagementData = {
    id: string;
    name: string;
    email: string;
    initials: string;
    status: string;
    department: string;
    roles: Pick<RoleData, 'id' | 'name'>[];
};

export type PermissionGroup = {
    group: string;
    permissions: Pick<PermissionData, 'id' | 'name' | 'description'>[];
};
