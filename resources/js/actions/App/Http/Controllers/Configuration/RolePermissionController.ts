import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Configuration\RolePermissionController::index
 * @see app/Http/Controllers/Configuration/RolePermissionController.php:26
 * @route 'https://enotulen.irvan.cloud/configuration/role-permissions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/configuration/role-permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\RolePermissionController::index
 * @see app/Http/Controllers/Configuration/RolePermissionController.php:26
 * @route 'https://enotulen.irvan.cloud/configuration/role-permissions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\RolePermissionController::index
 * @see app/Http/Controllers/Configuration/RolePermissionController.php:26
 * @route 'https://enotulen.irvan.cloud/configuration/role-permissions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\RolePermissionController::index
 * @see app/Http/Controllers/Configuration/RolePermissionController.php:26
 * @route 'https://enotulen.irvan.cloud/configuration/role-permissions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Configuration\RolePermissionController::index
 * @see app/Http/Controllers/Configuration/RolePermissionController.php:26
 * @route 'https://enotulen.irvan.cloud/configuration/role-permissions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Configuration\RolePermissionController::index
 * @see app/Http/Controllers/Configuration/RolePermissionController.php:26
 * @route 'https://enotulen.irvan.cloud/configuration/role-permissions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Configuration\RolePermissionController::index
 * @see app/Http/Controllers/Configuration/RolePermissionController.php:26
 * @route 'https://enotulen.irvan.cloud/configuration/role-permissions'
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
* @see \App\Http\Controllers\Configuration\RolePermissionController::update
 * @see app/Http/Controllers/Configuration/RolePermissionController.php:72
 * @route 'https://enotulen.irvan.cloud/configuration/role-permissions/{role}'
 */
export const update = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: 'https://enotulen.irvan.cloud/configuration/role-permissions/{role}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Configuration\RolePermissionController::update
 * @see app/Http/Controllers/Configuration/RolePermissionController.php:72
 * @route 'https://enotulen.irvan.cloud/configuration/role-permissions/{role}'
 */
update.url = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return update.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\RolePermissionController::update
 * @see app/Http/Controllers/Configuration/RolePermissionController.php:72
 * @route 'https://enotulen.irvan.cloud/configuration/role-permissions/{role}'
 */
update.put = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Configuration\RolePermissionController::update
 * @see app/Http/Controllers/Configuration/RolePermissionController.php:72
 * @route 'https://enotulen.irvan.cloud/configuration/role-permissions/{role}'
 */
    const updateForm = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Configuration\RolePermissionController::update
 * @see app/Http/Controllers/Configuration/RolePermissionController.php:72
 * @route 'https://enotulen.irvan.cloud/configuration/role-permissions/{role}'
 */
        updateForm.put = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const RolePermissionController = { index, update }

export default RolePermissionController
