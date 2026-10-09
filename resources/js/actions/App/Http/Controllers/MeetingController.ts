import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingController::autoSync
 * @see app/Http/Controllers/MeetingController.php:184
 * @route 'https://enotulen.irvan.cloud/meetings/auto-sync'
 */
export const autoSync = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoSync.url(options),
    method: 'post',
})

autoSync.definition = {
    methods: ["post"],
    url: 'https://enotulen.irvan.cloud/meetings/auto-sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingController::autoSync
 * @see app/Http/Controllers/MeetingController.php:184
 * @route 'https://enotulen.irvan.cloud/meetings/auto-sync'
 */
autoSync.url = (options?: RouteQueryOptions) => {
    return autoSync.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::autoSync
 * @see app/Http/Controllers/MeetingController.php:184
 * @route 'https://enotulen.irvan.cloud/meetings/auto-sync'
 */
autoSync.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoSync.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MeetingController::autoSync
 * @see app/Http/Controllers/MeetingController.php:184
 * @route 'https://enotulen.irvan.cloud/meetings/auto-sync'
 */
    const autoSyncForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: autoSync.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingController::autoSync
 * @see app/Http/Controllers/MeetingController.php:184
 * @route 'https://enotulen.irvan.cloud/meetings/auto-sync'
 */
        autoSyncForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: autoSync.url(options),
            method: 'post',
        })
    
    autoSync.form = autoSyncForm
/**
* @see \App\Http\Controllers\MeetingController::cancel
 * @see app/Http/Controllers/MeetingController.php:269
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/cancel'
 */
export const cancel = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingController::cancel
 * @see app/Http/Controllers/MeetingController.php:269
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/cancel'
 */
cancel.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meeting: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meeting: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meeting: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting: typeof args.meeting === 'object'
                ? args.meeting.id
                : args.meeting,
                }

    return cancel.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::cancel
 * @see app/Http/Controllers/MeetingController.php:269
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/cancel'
 */
cancel.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MeetingController::cancel
 * @see app/Http/Controllers/MeetingController.php:269
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/cancel'
 */
    const cancelForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingController::cancel
 * @see app/Http/Controllers/MeetingController.php:269
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/cancel'
 */
        cancelForm.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
/**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:26
 * @route 'https://enotulen.irvan.cloud/meetings'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/meetings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:26
 * @route 'https://enotulen.irvan.cloud/meetings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:26
 * @route 'https://enotulen.irvan.cloud/meetings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:26
 * @route 'https://enotulen.irvan.cloud/meetings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:26
 * @route 'https://enotulen.irvan.cloud/meetings'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:26
 * @route 'https://enotulen.irvan.cloud/meetings'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:26
 * @route 'https://enotulen.irvan.cloud/meetings'
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
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:78
 * @route 'https://enotulen.irvan.cloud/meetings/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/meetings/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:78
 * @route 'https://enotulen.irvan.cloud/meetings/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:78
 * @route 'https://enotulen.irvan.cloud/meetings/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:78
 * @route 'https://enotulen.irvan.cloud/meetings/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:78
 * @route 'https://enotulen.irvan.cloud/meetings/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:78
 * @route 'https://enotulen.irvan.cloud/meetings/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:78
 * @route 'https://enotulen.irvan.cloud/meetings/create'
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
* @see \App\Http\Controllers\MeetingController::store
 * @see app/Http/Controllers/MeetingController.php:129
 * @route 'https://enotulen.irvan.cloud/meetings'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'https://enotulen.irvan.cloud/meetings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingController::store
 * @see app/Http/Controllers/MeetingController.php:129
 * @route 'https://enotulen.irvan.cloud/meetings'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::store
 * @see app/Http/Controllers/MeetingController.php:129
 * @route 'https://enotulen.irvan.cloud/meetings'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MeetingController::store
 * @see app/Http/Controllers/MeetingController.php:129
 * @route 'https://enotulen.irvan.cloud/meetings'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingController::store
 * @see app/Http/Controllers/MeetingController.php:129
 * @route 'https://enotulen.irvan.cloud/meetings'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\MeetingController::show
 * @see app/Http/Controllers/MeetingController.php:201
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
export const show = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingController::show
 * @see app/Http/Controllers/MeetingController.php:201
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
show.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meeting: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meeting: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meeting: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting: typeof args.meeting === 'object'
                ? args.meeting.id
                : args.meeting,
                }

    return show.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::show
 * @see app/Http/Controllers/MeetingController.php:201
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
show.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingController::show
 * @see app/Http/Controllers/MeetingController.php:201
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
show.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MeetingController::show
 * @see app/Http/Controllers/MeetingController.php:201
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
    const showForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingController::show
 * @see app/Http/Controllers/MeetingController.php:201
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
        showForm.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingController::show
 * @see app/Http/Controllers/MeetingController.php:201
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
        showForm.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MeetingController::edit
 * @see app/Http/Controllers/MeetingController.php:220
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/edit'
 */
export const edit = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingController::edit
 * @see app/Http/Controllers/MeetingController.php:220
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/edit'
 */
edit.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meeting: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meeting: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meeting: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting: typeof args.meeting === 'object'
                ? args.meeting.id
                : args.meeting,
                }

    return edit.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::edit
 * @see app/Http/Controllers/MeetingController.php:220
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/edit'
 */
edit.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingController::edit
 * @see app/Http/Controllers/MeetingController.php:220
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/edit'
 */
edit.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MeetingController::edit
 * @see app/Http/Controllers/MeetingController.php:220
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/edit'
 */
    const editForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingController::edit
 * @see app/Http/Controllers/MeetingController.php:220
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/edit'
 */
        editForm.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingController::edit
 * @see app/Http/Controllers/MeetingController.php:220
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/edit'
 */
        editForm.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MeetingController::update
 * @see app/Http/Controllers/MeetingController.php:236
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
export const update = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MeetingController::update
 * @see app/Http/Controllers/MeetingController.php:236
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
update.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meeting: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meeting: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meeting: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting: typeof args.meeting === 'object'
                ? args.meeting.id
                : args.meeting,
                }

    return update.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::update
 * @see app/Http/Controllers/MeetingController.php:236
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
update.put = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\MeetingController::update
 * @see app/Http/Controllers/MeetingController.php:236
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
update.patch = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\MeetingController::update
 * @see app/Http/Controllers/MeetingController.php:236
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
    const updateForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingController::update
 * @see app/Http/Controllers/MeetingController.php:236
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
        updateForm.put = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\MeetingController::update
 * @see app/Http/Controllers/MeetingController.php:236
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
        updateForm.patch = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\MeetingController::destroy
 * @see app/Http/Controllers/MeetingController.php:282
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
export const destroy = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MeetingController::destroy
 * @see app/Http/Controllers/MeetingController.php:282
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
destroy.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meeting: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meeting: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meeting: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting: typeof args.meeting === 'object'
                ? args.meeting.id
                : args.meeting,
                }

    return destroy.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::destroy
 * @see app/Http/Controllers/MeetingController.php:282
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
destroy.delete = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\MeetingController::destroy
 * @see app/Http/Controllers/MeetingController.php:282
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
    const destroyForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingController::destroy
 * @see app/Http/Controllers/MeetingController.php:282
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}'
 */
        destroyForm.delete = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const MeetingController = { autoSync, cancel, index, create, store, show, edit, update, destroy }

export default MeetingController
