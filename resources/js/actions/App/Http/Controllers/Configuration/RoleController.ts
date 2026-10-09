import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Configuration\RoleController::index
 * @see app/Http/Controllers/Configuration/RoleController.php:22
 * @route 'http://100.107.175.84/configuration/roles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\RoleController::index
 * @see app/Http/Controllers/Configuration/RoleController.php:22
 * @route 'http://100.107.175.84/configuration/roles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\RoleController::index
 * @see app/Http/Controllers/Configuration/RoleController.php:22
 * @route 'http://100.107.175.84/configuration/roles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\RoleController::index
 * @see app/Http/Controllers/Configuration/RoleController.php:22
 * @route 'http://100.107.175.84/configuration/roles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Configuration\RoleController::create
 * @see app/Http/Controllers/Configuration/RoleController.php:45
 * @route 'http://100.107.175.84/configuration/roles/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration/roles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\RoleController::create
 * @see app/Http/Controllers/Configuration/RoleController.php:45
 * @route 'http://100.107.175.84/configuration/roles/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\RoleController::create
 * @see app/Http/Controllers/Configuration/RoleController.php:45
 * @route 'http://100.107.175.84/configuration/roles/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\RoleController::create
 * @see app/Http/Controllers/Configuration/RoleController.php:45
 * @route 'http://100.107.175.84/configuration/roles/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Configuration\RoleController::store
 * @see app/Http/Controllers/Configuration/RoleController.php:50
 * @route 'http://100.107.175.84/configuration/roles'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/configuration/roles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Configuration\RoleController::store
 * @see app/Http/Controllers/Configuration/RoleController.php:50
 * @route 'http://100.107.175.84/configuration/roles'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\RoleController::store
 * @see app/Http/Controllers/Configuration/RoleController.php:50
 * @route 'http://100.107.175.84/configuration/roles'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Configuration\RoleController::show
 * @see app/Http/Controllers/Configuration/RoleController.php:69
 * @route 'http://100.107.175.84/configuration/roles/{role}'
 */
export const show = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration/roles/{role}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\RoleController::show
 * @see app/Http/Controllers/Configuration/RoleController.php:69
 * @route 'http://100.107.175.84/configuration/roles/{role}'
 */
show.url = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\RoleController::show
 * @see app/Http/Controllers/Configuration/RoleController.php:69
 * @route 'http://100.107.175.84/configuration/roles/{role}'
 */
show.get = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\RoleController::show
 * @see app/Http/Controllers/Configuration/RoleController.php:69
 * @route 'http://100.107.175.84/configuration/roles/{role}'
 */
show.head = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Configuration\RoleController::edit
 * @see app/Http/Controllers/Configuration/RoleController.php:99
 * @route 'http://100.107.175.84/configuration/roles/{role}/edit'
 */
export const edit = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration/roles/{role}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\RoleController::edit
 * @see app/Http/Controllers/Configuration/RoleController.php:99
 * @route 'http://100.107.175.84/configuration/roles/{role}/edit'
 */
edit.url = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\RoleController::edit
 * @see app/Http/Controllers/Configuration/RoleController.php:99
 * @route 'http://100.107.175.84/configuration/roles/{role}/edit'
 */
edit.get = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\RoleController::edit
 * @see app/Http/Controllers/Configuration/RoleController.php:99
 * @route 'http://100.107.175.84/configuration/roles/{role}/edit'
 */
edit.head = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Configuration\RoleController::update
 * @see app/Http/Controllers/Configuration/RoleController.php:113
 * @route 'http://100.107.175.84/configuration/roles/{role}'
 */
export const update = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: 'http://100.107.175.84/configuration/roles/{role}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Configuration\RoleController::update
 * @see app/Http/Controllers/Configuration/RoleController.php:113
 * @route 'http://100.107.175.84/configuration/roles/{role}'
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
* @see \App\Http\Controllers\Configuration\RoleController::update
 * @see app/Http/Controllers/Configuration/RoleController.php:113
 * @route 'http://100.107.175.84/configuration/roles/{role}'
 */
update.put = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Configuration\RoleController::update
 * @see app/Http/Controllers/Configuration/RoleController.php:113
 * @route 'http://100.107.175.84/configuration/roles/{role}'
 */
update.patch = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Configuration\RoleController::destroy
 * @see app/Http/Controllers/Configuration/RoleController.php:132
 * @route 'http://100.107.175.84/configuration/roles/{role}'
 */
export const destroy = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: 'http://100.107.175.84/configuration/roles/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Configuration\RoleController::destroy
 * @see app/Http/Controllers/Configuration/RoleController.php:132
 * @route 'http://100.107.175.84/configuration/roles/{role}'
 */
destroy.url = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\RoleController::destroy
 * @see app/Http/Controllers/Configuration/RoleController.php:132
 * @route 'http://100.107.175.84/configuration/roles/{role}'
 */
destroy.delete = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const RoleController = { index, create, store, show, edit, update, destroy }

export default RoleController