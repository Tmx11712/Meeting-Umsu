import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Configuration\RoleController::index
 * @see app/Http/Controllers/Configuration/RoleController.php:22
 * @route 'https://enotulen.irvan.cloud/configuration/roles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/configuration/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\RoleController::index
 * @see app/Http/Controllers/Configuration/RoleController.php:22
 * @route 'https://enotulen.irvan.cloud/configuration/roles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\RoleController::index
 * @see app/Http/Controllers/Configuration/RoleController.php:22
 * @route 'https://enotulen.irvan.cloud/configuration/roles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\RoleController::index
 * @see app/Http/Controllers/Configuration/RoleController.php:22
 * @route 'https://enotulen.irvan.cloud/configuration/roles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Configuration\RoleController::index
 * @see app/Http/Controllers/Configuration/RoleController.php:22
 * @route 'https://enotulen.irvan.cloud/configuration/roles'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Configuration\RoleController::index
 * @see app/Http/Controllers/Configuration/RoleController.php:22
 * @route 'https://enotulen.irvan.cloud/configuration/roles'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Configuration\RoleController::index
 * @see app/Http/Controllers/Configuration/RoleController.php:22
 * @route 'https://enotulen.irvan.cloud/configuration/roles'
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
* @see \App\Http\Controllers\Configuration\RoleController::create
 * @see app/Http/Controllers/Configuration/RoleController.php:45
 * @route 'https://enotulen.irvan.cloud/configuration/roles/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/configuration/roles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\RoleController::create
 * @see app/Http/Controllers/Configuration/RoleController.php:45
 * @route 'https://enotulen.irvan.cloud/configuration/roles/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\RoleController::create
 * @see app/Http/Controllers/Configuration/RoleController.php:45
 * @route 'https://enotulen.irvan.cloud/configuration/roles/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\RoleController::create
 * @see app/Http/Controllers/Configuration/RoleController.php:45
 * @route 'https://enotulen.irvan.cloud/configuration/roles/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Configuration\RoleController::create
 * @see app/Http/Controllers/Configuration/RoleController.php:45
 * @route 'https://enotulen.irvan.cloud/configuration/roles/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Configuration\RoleController::create
 * @see app/Http/Controllers/Configuration/RoleController.php:45
 * @route 'https://enotulen.irvan.cloud/configuration/roles/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Configuration\RoleController::create
 * @see app/Http/Controllers/Configuration/RoleController.php:45
 * @route 'https://enotulen.irvan.cloud/configuration/roles/create'
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
* @see \App\Http\Controllers\Configuration\RoleController::store
 * @see app/Http/Controllers/Configuration/RoleController.php:50
 * @route 'https://enotulen.irvan.cloud/configuration/roles'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'https://enotulen.irvan.cloud/configuration/roles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Configuration\RoleController::store
 * @see app/Http/Controllers/Configuration/RoleController.php:50
 * @route 'https://enotulen.irvan.cloud/configuration/roles'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\RoleController::store
 * @see app/Http/Controllers/Configuration/RoleController.php:50
 * @route 'https://enotulen.irvan.cloud/configuration/roles'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Configuration\RoleController::store
 * @see app/Http/Controllers/Configuration/RoleController.php:50
 * @route 'https://enotulen.irvan.cloud/configuration/roles'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Configuration\RoleController::store
 * @see app/Http/Controllers/Configuration/RoleController.php:50
 * @route 'https://enotulen.irvan.cloud/configuration/roles'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Configuration\RoleController::show
 * @see app/Http/Controllers/Configuration/RoleController.php:69
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
 */
export const show = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/configuration/roles/{role}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\RoleController::show
 * @see app/Http/Controllers/Configuration/RoleController.php:69
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
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
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
 */
show.get = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\RoleController::show
 * @see app/Http/Controllers/Configuration/RoleController.php:69
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
 */
show.head = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Configuration\RoleController::show
 * @see app/Http/Controllers/Configuration/RoleController.php:69
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
 */
    const showForm = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Configuration\RoleController::show
 * @see app/Http/Controllers/Configuration/RoleController.php:69
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
 */
        showForm.get = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Configuration\RoleController::show
 * @see app/Http/Controllers/Configuration/RoleController.php:69
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
 */
        showForm.head = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Configuration\RoleController::edit
 * @see app/Http/Controllers/Configuration/RoleController.php:99
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}/edit'
 */
export const edit = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/configuration/roles/{role}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\RoleController::edit
 * @see app/Http/Controllers/Configuration/RoleController.php:99
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}/edit'
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
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}/edit'
 */
edit.get = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\RoleController::edit
 * @see app/Http/Controllers/Configuration/RoleController.php:99
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}/edit'
 */
edit.head = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Configuration\RoleController::edit
 * @see app/Http/Controllers/Configuration/RoleController.php:99
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}/edit'
 */
    const editForm = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Configuration\RoleController::edit
 * @see app/Http/Controllers/Configuration/RoleController.php:99
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}/edit'
 */
        editForm.get = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Configuration\RoleController::edit
 * @see app/Http/Controllers/Configuration/RoleController.php:99
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}/edit'
 */
        editForm.head = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Configuration\RoleController::update
 * @see app/Http/Controllers/Configuration/RoleController.php:113
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
 */
export const update = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: 'https://enotulen.irvan.cloud/configuration/roles/{role}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Configuration\RoleController::update
 * @see app/Http/Controllers/Configuration/RoleController.php:113
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
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
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
 */
update.put = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Configuration\RoleController::update
 * @see app/Http/Controllers/Configuration/RoleController.php:113
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
 */
update.patch = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Configuration\RoleController::update
 * @see app/Http/Controllers/Configuration/RoleController.php:113
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
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
* @see \App\Http\Controllers\Configuration\RoleController::update
 * @see app/Http/Controllers/Configuration/RoleController.php:113
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
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
            /**
* @see \App\Http\Controllers\Configuration\RoleController::update
 * @see app/Http/Controllers/Configuration/RoleController.php:113
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
 */
        updateForm.patch = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Configuration\RoleController::destroy
 * @see app/Http/Controllers/Configuration/RoleController.php:132
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
 */
export const destroy = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: 'https://enotulen.irvan.cloud/configuration/roles/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Configuration\RoleController::destroy
 * @see app/Http/Controllers/Configuration/RoleController.php:132
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
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
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
 */
destroy.delete = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Configuration\RoleController::destroy
 * @see app/Http/Controllers/Configuration/RoleController.php:132
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
 */
    const destroyForm = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Configuration\RoleController::destroy
 * @see app/Http/Controllers/Configuration/RoleController.php:132
 * @route 'https://enotulen.irvan.cloud/configuration/roles/{role}'
 */
        destroyForm.delete = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const RoleController = { index, create, store, show, edit, update, destroy }

export default RoleController
