import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Configuration\MenuController::index
 * @see app/Http/Controllers/Configuration/MenuController.php:27
 * @route 'http://100.107.175.84/configuration/menus'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration/menus',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\MenuController::index
 * @see app/Http/Controllers/Configuration/MenuController.php:27
 * @route 'http://100.107.175.84/configuration/menus'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\MenuController::index
 * @see app/Http/Controllers/Configuration/MenuController.php:27
 * @route 'http://100.107.175.84/configuration/menus'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\MenuController::index
 * @see app/Http/Controllers/Configuration/MenuController.php:27
 * @route 'http://100.107.175.84/configuration/menus'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Configuration\MenuController::index
 * @see app/Http/Controllers/Configuration/MenuController.php:27
 * @route 'http://100.107.175.84/configuration/menus'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Configuration\MenuController::index
 * @see app/Http/Controllers/Configuration/MenuController.php:27
 * @route 'http://100.107.175.84/configuration/menus'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Configuration\MenuController::index
 * @see app/Http/Controllers/Configuration/MenuController.php:27
 * @route 'http://100.107.175.84/configuration/menus'
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
* @see \App\Http\Controllers\Configuration\MenuController::store
 * @see app/Http/Controllers/Configuration/MenuController.php:48
 * @route 'http://100.107.175.84/configuration/menus'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/configuration/menus',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Configuration\MenuController::store
 * @see app/Http/Controllers/Configuration/MenuController.php:48
 * @route 'http://100.107.175.84/configuration/menus'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\MenuController::store
 * @see app/Http/Controllers/Configuration/MenuController.php:48
 * @route 'http://100.107.175.84/configuration/menus'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Configuration\MenuController::store
 * @see app/Http/Controllers/Configuration/MenuController.php:48
 * @route 'http://100.107.175.84/configuration/menus'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Configuration\MenuController::store
 * @see app/Http/Controllers/Configuration/MenuController.php:48
 * @route 'http://100.107.175.84/configuration/menus'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Configuration\MenuController::update
 * @see app/Http/Controllers/Configuration/MenuController.php:90
 * @route 'http://100.107.175.84/configuration/menus/{menu}'
 */
export const update = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: 'http://100.107.175.84/configuration/menus/{menu}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Configuration\MenuController::update
 * @see app/Http/Controllers/Configuration/MenuController.php:90
 * @route 'http://100.107.175.84/configuration/menus/{menu}'
 */
update.url = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { menu: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { menu: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    menu: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        menu: typeof args.menu === 'object'
                ? args.menu.id
                : args.menu,
                }

    return update.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\MenuController::update
 * @see app/Http/Controllers/Configuration/MenuController.php:90
 * @route 'http://100.107.175.84/configuration/menus/{menu}'
 */
update.put = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Configuration\MenuController::update
 * @see app/Http/Controllers/Configuration/MenuController.php:90
 * @route 'http://100.107.175.84/configuration/menus/{menu}'
 */
update.patch = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Configuration\MenuController::update
 * @see app/Http/Controllers/Configuration/MenuController.php:90
 * @route 'http://100.107.175.84/configuration/menus/{menu}'
 */
    const updateForm = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Configuration\MenuController::update
 * @see app/Http/Controllers/Configuration/MenuController.php:90
 * @route 'http://100.107.175.84/configuration/menus/{menu}'
 */
        updateForm.put = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Configuration\MenuController::update
 * @see app/Http/Controllers/Configuration/MenuController.php:90
 * @route 'http://100.107.175.84/configuration/menus/{menu}'
 */
        updateForm.patch = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Configuration\MenuController::destroy
 * @see app/Http/Controllers/Configuration/MenuController.php:109
 * @route 'http://100.107.175.84/configuration/menus/{menu}'
 */
export const destroy = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: 'http://100.107.175.84/configuration/menus/{menu}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Configuration\MenuController::destroy
 * @see app/Http/Controllers/Configuration/MenuController.php:109
 * @route 'http://100.107.175.84/configuration/menus/{menu}'
 */
destroy.url = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { menu: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { menu: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    menu: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        menu: typeof args.menu === 'object'
                ? args.menu.id
                : args.menu,
                }

    return destroy.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\MenuController::destroy
 * @see app/Http/Controllers/Configuration/MenuController.php:109
 * @route 'http://100.107.175.84/configuration/menus/{menu}'
 */
destroy.delete = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Configuration\MenuController::destroy
 * @see app/Http/Controllers/Configuration/MenuController.php:109
 * @route 'http://100.107.175.84/configuration/menus/{menu}'
 */
    const destroyForm = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Configuration\MenuController::destroy
 * @see app/Http/Controllers/Configuration/MenuController.php:109
 * @route 'http://100.107.175.84/configuration/menus/{menu}'
 */
        destroyForm.delete = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Configuration\MenuController::toggle
 * @see app/Http/Controllers/Configuration/MenuController.php:123
 * @route 'http://100.107.175.84/configuration/menus/{menu}/toggle'
 */
export const toggle = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/configuration/menus/{menu}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Configuration\MenuController::toggle
 * @see app/Http/Controllers/Configuration/MenuController.php:123
 * @route 'http://100.107.175.84/configuration/menus/{menu}/toggle'
 */
toggle.url = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { menu: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { menu: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    menu: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        menu: typeof args.menu === 'object'
                ? args.menu.id
                : args.menu,
                }

    return toggle.definition.url
            .replace('{menu}', parsedArgs.menu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\MenuController::toggle
 * @see app/Http/Controllers/Configuration/MenuController.php:123
 * @route 'http://100.107.175.84/configuration/menus/{menu}/toggle'
 */
toggle.post = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Configuration\MenuController::toggle
 * @see app/Http/Controllers/Configuration/MenuController.php:123
 * @route 'http://100.107.175.84/configuration/menus/{menu}/toggle'
 */
    const toggleForm = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggle.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Configuration\MenuController::toggle
 * @see app/Http/Controllers/Configuration/MenuController.php:123
 * @route 'http://100.107.175.84/configuration/menus/{menu}/toggle'
 */
        toggleForm.post = (args: { menu: string | number | { id: string | number } } | [menu: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggle.url(args, options),
            method: 'post',
        })
    
    toggle.form = toggleForm
const menus = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
toggle: Object.assign(toggle, toggle),
}

export default menus