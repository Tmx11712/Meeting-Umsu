import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Configuration\UserPermissionController::index
 * @see app/Http/Controllers/Configuration/UserPermissionController.php:28
 * @route 'http://100.107.175.84/configuration/user-permissions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration/user-permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\UserPermissionController::index
 * @see app/Http/Controllers/Configuration/UserPermissionController.php:28
 * @route 'http://100.107.175.84/configuration/user-permissions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\UserPermissionController::index
 * @see app/Http/Controllers/Configuration/UserPermissionController.php:28
 * @route 'http://100.107.175.84/configuration/user-permissions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\UserPermissionController::index
 * @see app/Http/Controllers/Configuration/UserPermissionController.php:28
 * @route 'http://100.107.175.84/configuration/user-permissions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Configuration\UserPermissionController::index
 * @see app/Http/Controllers/Configuration/UserPermissionController.php:28
 * @route 'http://100.107.175.84/configuration/user-permissions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Configuration\UserPermissionController::index
 * @see app/Http/Controllers/Configuration/UserPermissionController.php:28
 * @route 'http://100.107.175.84/configuration/user-permissions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Configuration\UserPermissionController::index
 * @see app/Http/Controllers/Configuration/UserPermissionController.php:28
 * @route 'http://100.107.175.84/configuration/user-permissions'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Configuration\UserPermissionController::update
 * @see app/Http/Controllers/Configuration/UserPermissionController.php:100
 * @route 'http://100.107.175.84/configuration/user-permissions/{user}'
 */
export const update = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: 'http://100.107.175.84/configuration/user-permissions/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Configuration\UserPermissionController::update
 * @see app/Http/Controllers/Configuration/UserPermissionController.php:100
 * @route 'http://100.107.175.84/configuration/user-permissions/{user}'
 */
update.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return update.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\UserPermissionController::update
 * @see app/Http/Controllers/Configuration/UserPermissionController.php:100
 * @route 'http://100.107.175.84/configuration/user-permissions/{user}'
 */
update.put = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Configuration\UserPermissionController::update
 * @see app/Http/Controllers/Configuration/UserPermissionController.php:100
 * @route 'http://100.107.175.84/configuration/user-permissions/{user}'
 */
    const updateForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Configuration\UserPermissionController::update
 * @see app/Http/Controllers/Configuration/UserPermissionController.php:100
 * @route 'http://100.107.175.84/configuration/user-permissions/{user}'
 */
        updateForm.put = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const UserPermissionController = { index, update }

export default UserPermissionController