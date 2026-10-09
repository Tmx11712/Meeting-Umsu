import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Configuration\UserManagementController::index
 * @see app/Http/Controllers/Configuration/UserManagementController.php:29
 * @route 'http://100.107.175.84/configuration/users'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\UserManagementController::index
 * @see app/Http/Controllers/Configuration/UserManagementController.php:29
 * @route 'http://100.107.175.84/configuration/users'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\UserManagementController::index
 * @see app/Http/Controllers/Configuration/UserManagementController.php:29
 * @route 'http://100.107.175.84/configuration/users'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\UserManagementController::index
 * @see app/Http/Controllers/Configuration/UserManagementController.php:29
 * @route 'http://100.107.175.84/configuration/users'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Configuration\UserManagementController::index
 * @see app/Http/Controllers/Configuration/UserManagementController.php:29
 * @route 'http://100.107.175.84/configuration/users'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Configuration\UserManagementController::index
 * @see app/Http/Controllers/Configuration/UserManagementController.php:29
 * @route 'http://100.107.175.84/configuration/users'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Configuration\UserManagementController::index
 * @see app/Http/Controllers/Configuration/UserManagementController.php:29
 * @route 'http://100.107.175.84/configuration/users'
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
* @see \App\Http\Controllers\Configuration\UserManagementController::create
 * @see app/Http/Controllers/Configuration/UserManagementController.php:66
 * @route 'http://100.107.175.84/configuration/users/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration/users/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\UserManagementController::create
 * @see app/Http/Controllers/Configuration/UserManagementController.php:66
 * @route 'http://100.107.175.84/configuration/users/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\UserManagementController::create
 * @see app/Http/Controllers/Configuration/UserManagementController.php:66
 * @route 'http://100.107.175.84/configuration/users/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\UserManagementController::create
 * @see app/Http/Controllers/Configuration/UserManagementController.php:66
 * @route 'http://100.107.175.84/configuration/users/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Configuration\UserManagementController::create
 * @see app/Http/Controllers/Configuration/UserManagementController.php:66
 * @route 'http://100.107.175.84/configuration/users/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Configuration\UserManagementController::create
 * @see app/Http/Controllers/Configuration/UserManagementController.php:66
 * @route 'http://100.107.175.84/configuration/users/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Configuration\UserManagementController::create
 * @see app/Http/Controllers/Configuration/UserManagementController.php:66
 * @route 'http://100.107.175.84/configuration/users/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Configuration\UserManagementController::store
 * @see app/Http/Controllers/Configuration/UserManagementController.php:75
 * @route 'http://100.107.175.84/configuration/users'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/configuration/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Configuration\UserManagementController::store
 * @see app/Http/Controllers/Configuration/UserManagementController.php:75
 * @route 'http://100.107.175.84/configuration/users'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\UserManagementController::store
 * @see app/Http/Controllers/Configuration/UserManagementController.php:75
 * @route 'http://100.107.175.84/configuration/users'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Configuration\UserManagementController::store
 * @see app/Http/Controllers/Configuration/UserManagementController.php:75
 * @route 'http://100.107.175.84/configuration/users'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Configuration\UserManagementController::store
 * @see app/Http/Controllers/Configuration/UserManagementController.php:75
 * @route 'http://100.107.175.84/configuration/users'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Configuration\UserManagementController::edit
 * @see app/Http/Controllers/Configuration/UserManagementController.php:96
 * @route 'http://100.107.175.84/configuration/users/{user}/edit'
 */
export const edit = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration/users/{user}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\UserManagementController::edit
 * @see app/Http/Controllers/Configuration/UserManagementController.php:96
 * @route 'http://100.107.175.84/configuration/users/{user}/edit'
 */
edit.url = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\UserManagementController::edit
 * @see app/Http/Controllers/Configuration/UserManagementController.php:96
 * @route 'http://100.107.175.84/configuration/users/{user}/edit'
 */
edit.get = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\UserManagementController::edit
 * @see app/Http/Controllers/Configuration/UserManagementController.php:96
 * @route 'http://100.107.175.84/configuration/users/{user}/edit'
 */
edit.head = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Configuration\UserManagementController::edit
 * @see app/Http/Controllers/Configuration/UserManagementController.php:96
 * @route 'http://100.107.175.84/configuration/users/{user}/edit'
 */
    const editForm = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Configuration\UserManagementController::edit
 * @see app/Http/Controllers/Configuration/UserManagementController.php:96
 * @route 'http://100.107.175.84/configuration/users/{user}/edit'
 */
        editForm.get = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Configuration\UserManagementController::edit
 * @see app/Http/Controllers/Configuration/UserManagementController.php:96
 * @route 'http://100.107.175.84/configuration/users/{user}/edit'
 */
        editForm.head = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Configuration\UserManagementController::update
 * @see app/Http/Controllers/Configuration/UserManagementController.php:112
 * @route 'http://100.107.175.84/configuration/users/{user}'
 */
export const update = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: 'http://100.107.175.84/configuration/users/{user}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Configuration\UserManagementController::update
 * @see app/Http/Controllers/Configuration/UserManagementController.php:112
 * @route 'http://100.107.175.84/configuration/users/{user}'
 */
update.url = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\Configuration\UserManagementController::update
 * @see app/Http/Controllers/Configuration/UserManagementController.php:112
 * @route 'http://100.107.175.84/configuration/users/{user}'
 */
update.put = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Configuration\UserManagementController::update
 * @see app/Http/Controllers/Configuration/UserManagementController.php:112
 * @route 'http://100.107.175.84/configuration/users/{user}'
 */
update.patch = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Configuration\UserManagementController::update
 * @see app/Http/Controllers/Configuration/UserManagementController.php:112
 * @route 'http://100.107.175.84/configuration/users/{user}'
 */
    const updateForm = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Configuration\UserManagementController::update
 * @see app/Http/Controllers/Configuration/UserManagementController.php:112
 * @route 'http://100.107.175.84/configuration/users/{user}'
 */
        updateForm.put = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Configuration\UserManagementController::update
 * @see app/Http/Controllers/Configuration/UserManagementController.php:112
 * @route 'http://100.107.175.84/configuration/users/{user}'
 */
        updateForm.patch = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Configuration\UserManagementController::destroy
 * @see app/Http/Controllers/Configuration/UserManagementController.php:138
 * @route 'http://100.107.175.84/configuration/users/{user}'
 */
export const destroy = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: 'http://100.107.175.84/configuration/users/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Configuration\UserManagementController::destroy
 * @see app/Http/Controllers/Configuration/UserManagementController.php:138
 * @route 'http://100.107.175.84/configuration/users/{user}'
 */
destroy.url = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\UserManagementController::destroy
 * @see app/Http/Controllers/Configuration/UserManagementController.php:138
 * @route 'http://100.107.175.84/configuration/users/{user}'
 */
destroy.delete = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Configuration\UserManagementController::destroy
 * @see app/Http/Controllers/Configuration/UserManagementController.php:138
 * @route 'http://100.107.175.84/configuration/users/{user}'
 */
    const destroyForm = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Configuration\UserManagementController::destroy
 * @see app/Http/Controllers/Configuration/UserManagementController.php:138
 * @route 'http://100.107.175.84/configuration/users/{user}'
 */
        destroyForm.delete = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const UserManagementController = { index, create, store, edit, update, destroy }

export default UserManagementController