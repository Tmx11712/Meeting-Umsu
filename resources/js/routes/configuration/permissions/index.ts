import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Configuration\PermissionController::index
 * @see app/Http/Controllers/Configuration/PermissionController.php:23
 * @route 'http://100.107.175.84/configuration/permissions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration/permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\PermissionController::index
 * @see app/Http/Controllers/Configuration/PermissionController.php:23
 * @route 'http://100.107.175.84/configuration/permissions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\PermissionController::index
 * @see app/Http/Controllers/Configuration/PermissionController.php:23
 * @route 'http://100.107.175.84/configuration/permissions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\PermissionController::index
 * @see app/Http/Controllers/Configuration/PermissionController.php:23
 * @route 'http://100.107.175.84/configuration/permissions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Configuration\PermissionController::store
 * @see app/Http/Controllers/Configuration/PermissionController.php:57
 * @route 'http://100.107.175.84/configuration/permissions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/configuration/permissions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Configuration\PermissionController::store
 * @see app/Http/Controllers/Configuration/PermissionController.php:57
 * @route 'http://100.107.175.84/configuration/permissions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\PermissionController::store
 * @see app/Http/Controllers/Configuration/PermissionController.php:57
 * @route 'http://100.107.175.84/configuration/permissions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Configuration\PermissionController::update
 * @see app/Http/Controllers/Configuration/PermissionController.php:78
 * @route 'http://100.107.175.84/configuration/permissions/{permission}'
 */
export const update = (args: { permission: string | number | { id: string | number } } | [permission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: 'http://100.107.175.84/configuration/permissions/{permission}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Configuration\PermissionController::update
 * @see app/Http/Controllers/Configuration/PermissionController.php:78
 * @route 'http://100.107.175.84/configuration/permissions/{permission}'
 */
update.url = (args: { permission: string | number | { id: string | number } } | [permission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { permission: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    permission: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        permission: typeof args.permission === 'object'
                ? args.permission.id
                : args.permission,
                }

    return update.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\PermissionController::update
 * @see app/Http/Controllers/Configuration/PermissionController.php:78
 * @route 'http://100.107.175.84/configuration/permissions/{permission}'
 */
update.put = (args: { permission: string | number | { id: string | number } } | [permission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Configuration\PermissionController::update
 * @see app/Http/Controllers/Configuration/PermissionController.php:78
 * @route 'http://100.107.175.84/configuration/permissions/{permission}'
 */
update.patch = (args: { permission: string | number | { id: string | number } } | [permission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Configuration\PermissionController::destroy
 * @see app/Http/Controllers/Configuration/PermissionController.php:98
 * @route 'http://100.107.175.84/configuration/permissions/{permission}'
 */
export const destroy = (args: { permission: string | number | { id: string | number } } | [permission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: 'http://100.107.175.84/configuration/permissions/{permission}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Configuration\PermissionController::destroy
 * @see app/Http/Controllers/Configuration/PermissionController.php:98
 * @route 'http://100.107.175.84/configuration/permissions/{permission}'
 */
destroy.url = (args: { permission: string | number | { id: string | number } } | [permission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { permission: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    permission: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        permission: typeof args.permission === 'object'
                ? args.permission.id
                : args.permission,
                }

    return destroy.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\PermissionController::destroy
 * @see app/Http/Controllers/Configuration/PermissionController.php:98
 * @route 'http://100.107.175.84/configuration/permissions/{permission}'
 */
destroy.delete = (args: { permission: string | number | { id: string | number } } | [permission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const permissions = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default permissions