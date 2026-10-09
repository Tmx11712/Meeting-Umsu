import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import recordingD60271 from './recording'
import transcription from './transcription'
import correctionCe4f07 from './correction'
import attendanceC12b95 from './attendance'
import review31e8d2 from './review'
import documents from './documents'
import approvalDf7719 from './approval'
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
/**
* @see \App\Http\Controllers\MeetingRecordingController::recording
 * @see app/Http/Controllers/MeetingRecordingController.php:24
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/recording'
 */
export const recording = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recording.url(args, options),
    method: 'get',
})

recording.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}/recording',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingRecordingController::recording
 * @see app/Http/Controllers/MeetingRecordingController.php:24
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/recording'
 */
recording.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return recording.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingRecordingController::recording
 * @see app/Http/Controllers/MeetingRecordingController.php:24
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/recording'
 */
recording.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recording.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingRecordingController::recording
 * @see app/Http/Controllers/MeetingRecordingController.php:24
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/recording'
 */
recording.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recording.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MeetingRecordingController::recording
 * @see app/Http/Controllers/MeetingRecordingController.php:24
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/recording'
 */
    const recordingForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: recording.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingRecordingController::recording
 * @see app/Http/Controllers/MeetingRecordingController.php:24
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/recording'
 */
        recordingForm.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recording.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingRecordingController::recording
 * @see app/Http/Controllers/MeetingRecordingController.php:24
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/recording'
 */
        recordingForm.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recording.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    recording.form = recordingForm
/**
* @see \App\Http\Controllers\TranscriptCorrectionController::correction
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
export const correction = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correction.url(args, options),
    method: 'get',
})

correction.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}/correction',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::correction
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
correction.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return correction.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::correction
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
correction.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correction.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TranscriptCorrectionController::correction
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
correction.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: correction.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TranscriptCorrectionController::correction
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
    const correctionForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: correction.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TranscriptCorrectionController::correction
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
        correctionForm.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: correction.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TranscriptCorrectionController::correction
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
        correctionForm.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: correction.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    correction.form = correctionForm
/**
* @see \App\Http\Controllers\AttendanceController::attendance
 * @see app/Http/Controllers/AttendanceController.php:50
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/attendance'
 */
export const attendance = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: attendance.url(args, options),
    method: 'get',
})

attendance.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}/attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::attendance
 * @see app/Http/Controllers/AttendanceController.php:50
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/attendance'
 */
attendance.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return attendance.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::attendance
 * @see app/Http/Controllers/AttendanceController.php:50
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/attendance'
 */
attendance.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: attendance.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::attendance
 * @see app/Http/Controllers/AttendanceController.php:50
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/attendance'
 */
attendance.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: attendance.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::attendance
 * @see app/Http/Controllers/AttendanceController.php:50
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/attendance'
 */
    const attendanceForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: attendance.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::attendance
 * @see app/Http/Controllers/AttendanceController.php:50
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/attendance'
 */
        attendanceForm.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: attendance.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::attendance
 * @see app/Http/Controllers/AttendanceController.php:50
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/attendance'
 */
        attendanceForm.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: attendance.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    attendance.form = attendanceForm
/**
* @see \App\Http\Controllers\MeetingMinuteController::review
 * @see app/Http/Controllers/MeetingMinuteController.php:40
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/review'
 */
export const review = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: review.url(args, options),
    method: 'get',
})

review.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}/review',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::review
 * @see app/Http/Controllers/MeetingMinuteController.php:40
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/review'
 */
review.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return review.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingMinuteController::review
 * @see app/Http/Controllers/MeetingMinuteController.php:40
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/review'
 */
review.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: review.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingMinuteController::review
 * @see app/Http/Controllers/MeetingMinuteController.php:40
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/review'
 */
review.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: review.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MeetingMinuteController::review
 * @see app/Http/Controllers/MeetingMinuteController.php:40
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/review'
 */
    const reviewForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: review.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingMinuteController::review
 * @see app/Http/Controllers/MeetingMinuteController.php:40
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/review'
 */
        reviewForm.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: review.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingMinuteController::review
 * @see app/Http/Controllers/MeetingMinuteController.php:40
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/review'
 */
        reviewForm.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: review.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    review.form = reviewForm
/**
* @see \App\Http\Controllers\MeetingApprovalController::approval
 * @see app/Http/Controllers/MeetingApprovalController.php:30
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/approval'
 */
export const approval = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approval.url(args, options),
    method: 'get',
})

approval.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}/approval',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingApprovalController::approval
 * @see app/Http/Controllers/MeetingApprovalController.php:30
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/approval'
 */
approval.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return approval.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingApprovalController::approval
 * @see app/Http/Controllers/MeetingApprovalController.php:30
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/approval'
 */
approval.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approval.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingApprovalController::approval
 * @see app/Http/Controllers/MeetingApprovalController.php:30
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/approval'
 */
approval.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: approval.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MeetingApprovalController::approval
 * @see app/Http/Controllers/MeetingApprovalController.php:30
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/approval'
 */
    const approvalForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: approval.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingApprovalController::approval
 * @see app/Http/Controllers/MeetingApprovalController.php:30
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/approval'
 */
        approvalForm.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: approval.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingApprovalController::approval
 * @see app/Http/Controllers/MeetingApprovalController.php:30
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/approval'
 */
        approvalForm.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: approval.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    approval.form = approvalForm
const meetings = {
    autoSync: Object.assign(autoSync, autoSync),
cancel: Object.assign(cancel, cancel),
index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
recording: Object.assign(recording, recordingD60271),
transcription: Object.assign(transcription, transcription),
correction: Object.assign(correction, correctionCe4f07),
attendance: Object.assign(attendance, attendanceC12b95),
review: Object.assign(review, review31e8d2),
documents: Object.assign(documents, documents),
approval: Object.assign(approval, approvalDf7719),
}

export default meetings
