import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import users from './users'
import roles from './roles'
import permissions from './permissions'
import menus from './menus'
import meetingTypes from './meeting-types'
import meetingRooms from './meeting-rooms'
import rolePermissions from './role-permissions'
import userPermissions from './user-permissions'
/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'http://100.107.175.84/configuration'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'http://100.107.175.84/configuration'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'http://100.107.175.84/configuration'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'http://100.107.175.84/configuration'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::openaiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'http://100.107.175.84/configuration/openai-status'
 */
export const openaiStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openaiStatus.url(options),
    method: 'get',
})

openaiStatus.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration/openai-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::openaiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'http://100.107.175.84/configuration/openai-status'
 */
openaiStatus.url = (options?: RouteQueryOptions) => {
    return openaiStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::openaiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'http://100.107.175.84/configuration/openai-status'
 */
openaiStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openaiStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::openaiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'http://100.107.175.84/configuration/openai-status'
 */
openaiStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: openaiStatus.url(options),
    method: 'head',
})
const configuration = {
    index: Object.assign(index, index),
openaiStatus: Object.assign(openaiStatus, openaiStatus),
users: Object.assign(users, users),
roles: Object.assign(roles, roles),
permissions: Object.assign(permissions, permissions),
menus: Object.assign(menus, menus),
meetingTypes: Object.assign(meetingTypes, meetingTypes),
meetingRooms: Object.assign(meetingRooms, meetingRooms),
rolePermissions: Object.assign(rolePermissions, rolePermissions),
userPermissions: Object.assign(userPermissions, userPermissions),
}

export default configuration