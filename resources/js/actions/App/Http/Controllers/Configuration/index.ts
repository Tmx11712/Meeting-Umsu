import ConfigurationController from './ConfigurationController'
import UserManagementController from './UserManagementController'
import RoleController from './RoleController'
import PermissionController from './PermissionController'
import MenuController from './MenuController'
import MeetingTypeController from './MeetingTypeController'
import MeetingRoomController from './MeetingRoomController'
import RolePermissionController from './RolePermissionController'
import UserPermissionController from './UserPermissionController'
const Configuration = {
    ConfigurationController: Object.assign(ConfigurationController, ConfigurationController),
UserManagementController: Object.assign(UserManagementController, UserManagementController),
RoleController: Object.assign(RoleController, RoleController),
PermissionController: Object.assign(PermissionController, PermissionController),
MenuController: Object.assign(MenuController, MenuController),
MeetingTypeController: Object.assign(MeetingTypeController, MeetingTypeController),
MeetingRoomController: Object.assign(MeetingRoomController, MeetingRoomController),
RolePermissionController: Object.assign(RolePermissionController, RolePermissionController),
UserPermissionController: Object.assign(UserPermissionController, UserPermissionController),
}

export default Configuration
