import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingController::autoSync
 * @see app/Http/Controllers/MeetingController.php:184
 * @route 'http://100.107.175.84/meetings/auto-sync'
 */
export const autoSync = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoSync.url(options),
    method: 'post',
})

autoSync.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/auto-sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingController::autoSync
 * @see app/Http/Controllers/MeetingController.php:184
 * @route 'http://100.107.175.84/meetings/auto-sync'
 */
autoSync.url = (options?: RouteQueryOptions) => {
    return autoSync.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::autoSync
 * @see app/Http/Controllers/MeetingController.php:184
 * @route 'http://100.107.175.84/meetings/auto-sync'
 */
autoSync.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoSync.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingController::cancel
 * @see app/Http/Controllers/MeetingController.php:269
 * @route 'http://100.107.175.84/meetings/{meeting}/cancel'
 */
export const cancel = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingController::cancel
 * @see app/Http/Controllers/MeetingController.php:269
 * @route 'http://100.107.175.84/meetings/{meeting}/cancel'
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
 * @route 'http://100.107.175.84/meetings/{meeting}/cancel'
 */
cancel.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:26
 * @route 'http://100.107.175.84/meetings'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:26
 * @route 'http://100.107.175.84/meetings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:26
 * @route 'http://100.107.175.84/meetings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingController::index
 * @see app/Http/Controllers/MeetingController.php:26
 * @route 'http://100.107.175.84/meetings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:78
 * @route 'http://100.107.175.84/meetings/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:78
 * @route 'http://100.107.175.84/meetings/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:78
 * @route 'http://100.107.175.84/meetings/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingController::create
 * @see app/Http/Controllers/MeetingController.php:78
 * @route 'http://100.107.175.84/meetings/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MeetingController::store
 * @see app/Http/Controllers/MeetingController.php:129
 * @route 'http://100.107.175.84/meetings'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingController::store
 * @see app/Http/Controllers/MeetingController.php:129
 * @route 'http://100.107.175.84/meetings'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingController::store
 * @see app/Http/Controllers/MeetingController.php:129
 * @route 'http://100.107.175.84/meetings'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingController::show
 * @see app/Http/Controllers/MeetingController.php:201
 * @route 'http://100.107.175.84/meetings/{meeting}'
 */
export const show = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingController::show
 * @see app/Http/Controllers/MeetingController.php:201
 * @route 'http://100.107.175.84/meetings/{meeting}'
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
 * @route 'http://100.107.175.84/meetings/{meeting}'
 */
show.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingController::show
 * @see app/Http/Controllers/MeetingController.php:201
 * @route 'http://100.107.175.84/meetings/{meeting}'
 */
show.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MeetingController::edit
 * @see app/Http/Controllers/MeetingController.php:220
 * @route 'http://100.107.175.84/meetings/{meeting}/edit'
 */
export const edit = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingController::edit
 * @see app/Http/Controllers/MeetingController.php:220
 * @route 'http://100.107.175.84/meetings/{meeting}/edit'
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
 * @route 'http://100.107.175.84/meetings/{meeting}/edit'
 */
edit.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingController::edit
 * @see app/Http/Controllers/MeetingController.php:220
 * @route 'http://100.107.175.84/meetings/{meeting}/edit'
 */
edit.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MeetingController::update
 * @see app/Http/Controllers/MeetingController.php:236
 * @route 'http://100.107.175.84/meetings/{meeting}'
 */
export const update = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: 'http://100.107.175.84/meetings/{meeting}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MeetingController::update
 * @see app/Http/Controllers/MeetingController.php:236
 * @route 'http://100.107.175.84/meetings/{meeting}'
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
 * @route 'http://100.107.175.84/meetings/{meeting}'
 */
update.put = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\MeetingController::update
 * @see app/Http/Controllers/MeetingController.php:236
 * @route 'http://100.107.175.84/meetings/{meeting}'
 */
update.patch = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MeetingController::destroy
 * @see app/Http/Controllers/MeetingController.php:282
 * @route 'http://100.107.175.84/meetings/{meeting}'
 */
export const destroy = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: 'http://100.107.175.84/meetings/{meeting}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MeetingController::destroy
 * @see app/Http/Controllers/MeetingController.php:282
 * @route 'http://100.107.175.84/meetings/{meeting}'
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
 * @route 'http://100.107.175.84/meetings/{meeting}'
 */
destroy.delete = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const MeetingController = { autoSync, cancel, index, create, store, show, edit, update, destroy }

export default MeetingController