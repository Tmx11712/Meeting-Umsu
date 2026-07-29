<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Create Permissions
        $modules = [
            'dashboard' => 'Dashboard',
            'meeting' => 'Rapat',
            'recording' => 'Rekaman',
            'transcript' => 'Transkrip',
            'attendance' => 'Absensi',
            'minute' => 'Notulen',
            'report' => 'Laporan',
            'user' => 'User',
            'role' => 'Role',
            'permission' => 'Permission',
            'menu' => 'Menu',
            'role_permission' => 'Role Permission',
            'user_permission' => 'User Permission'
        ];

        $actions = ['read', 'create', 'update', 'delete'];

        $allPermissions = [];
        $businessPermissions = [];
        
        foreach ($modules as $module => $moduleName) {
            foreach ($actions as $action) {
                $permissionName = "{$module}.{$action}";
                $permission = Permission::firstOrCreate([
                    'name' => $permissionName,
                    'group' => $moduleName,
                    'guard_name' => 'web'
                ]);

                $allPermissions[] = $permission;

                // Business modules + user for Administrator
                if (!in_array($module, ['role', 'permission', 'menu', 'role_permission', 'user_permission'])) {
                    $businessPermissions[] = $permission;
                }
            }
        }

        // 2. Create Roles & Assign Permissions
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        // Super Admin gets all permissions (though Gate usually bypasses, it's good to assign them or let Gate handle it)
        $superAdmin->syncPermissions($allPermissions);

        $administrator = Role::firstOrCreate(['name' => 'Administrator', 'guard_name' => 'web']);
        $administrator->syncPermissions($businessPermissions);

        $bagUmum = Role::firstOrCreate(['name' => 'Bag. Umum', 'guard_name' => 'web']);
        $bagUmum->syncPermissions([
            'meeting.read', 'meeting.create', 'meeting.update', 'meeting.delete',
            'transcript.read', 'transcript.create', 'transcript.update', 'transcript.delete',
            'attendance.read', 'attendance.create', 'attendance.update', 'attendance.delete',
            'minute.read', 'minute.create', 'minute.update', 'minute.delete',
            'report.read'
        ]);

        $bagHumas = Role::firstOrCreate(['name' => 'Bag. Humas', 'guard_name' => 'web']);
        $bagHumas->syncPermissions([
            'recording.read', 'recording.create', 'recording.update', 'recording.delete',
            'transcript.read',
            'attendance.read', 'attendance.create', 'attendance.update', 'attendance.delete'
        ]);

        $pimpinan = Role::firstOrCreate(['name' => 'Pimpinan', 'guard_name' => 'web']);
        $pimpinan->syncPermissions([
            'minute.read', 'minute.update' // review + approve
        ]);

        $viewer = Role::firstOrCreate(['name' => 'Viewer', 'guard_name' => 'web']);
        $viewer->syncPermissions([
            'minute.read'
        ]);
    }
}
