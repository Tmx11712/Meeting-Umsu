import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingApprovalController::show
 * @see app/Http/Controllers/MeetingApprovalController.php:30
 * @route 'http://100.107.175.84/meetings/{meeting}/approval'
 */
export const show = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}/approval',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingApprovalController::show
 * @see app/Http/Controllers/MeetingApprovalController.php:30
 * @route 'http://100.107.175.84/meetings/{meeting}/approval'
 */
show.url = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\MeetingApprovalController::show
 * @see app/Http/Controllers/MeetingApprovalController.php:30
 * @route 'http://100.107.175.84/meetings/{meeting}/approval'
 */
show.get = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingApprovalController::show
 * @see app/Http/Controllers/MeetingApprovalController.php:30
 * @route 'http://100.107.175.84/meetings/{meeting}/approval'
 */
show.head = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MeetingApprovalController::show
 * @see app/Http/Controllers/MeetingApprovalController.php:30
 * @route 'http://100.107.175.84/meetings/{meeting}/approval'
 */
    const showForm = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingApprovalController::show
 * @see app/Http/Controllers/MeetingApprovalController.php:30
 * @route 'http://100.107.175.84/meetings/{meeting}/approval'
 */
        showForm.get = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingApprovalController::show
 * @see app/Http/Controllers/MeetingApprovalController.php:30
 * @route 'http://100.107.175.84/meetings/{meeting}/approval'
 */
        showForm.head = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MeetingApprovalController::store
 * @see app/Http/Controllers/MeetingApprovalController.php:41
 * @route 'http://100.107.175.84/meetings/{meeting}/approval'
 */
export const store = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/approval',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingApprovalController::store
 * @see app/Http/Controllers/MeetingApprovalController.php:41
 * @route 'http://100.107.175.84/meetings/{meeting}/approval'
 */
store.url = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingApprovalController::store
 * @see app/Http/Controllers/MeetingApprovalController.php:41
 * @route 'http://100.107.175.84/meetings/{meeting}/approval'
 */
store.post = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MeetingApprovalController::store
 * @see app/Http/Controllers/MeetingApprovalController.php:41
 * @route 'http://100.107.175.84/meetings/{meeting}/approval'
 */
    const storeForm = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingApprovalController::store
 * @see app/Http/Controllers/MeetingApprovalController.php:41
 * @route 'http://100.107.175.84/meetings/{meeting}/approval'
 */
        storeForm.post = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\MeetingApprovalController::updateActionItems
 * @see app/Http/Controllers/MeetingApprovalController.php:76
 * @route 'http://100.107.175.84/meetings/{meeting}/approval/action-items'
 */
export const updateActionItems = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateActionItems.url(args, options),
    method: 'put',
})

updateActionItems.definition = {
    methods: ["put"],
    url: 'http://100.107.175.84/meetings/{meeting}/approval/action-items',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MeetingApprovalController::updateActionItems
 * @see app/Http/Controllers/MeetingApprovalController.php:76
 * @route 'http://100.107.175.84/meetings/{meeting}/approval/action-items'
 */
updateActionItems.url = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return updateActionItems.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingApprovalController::updateActionItems
 * @see app/Http/Controllers/MeetingApprovalController.php:76
 * @route 'http://100.107.175.84/meetings/{meeting}/approval/action-items'
 */
updateActionItems.put = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateActionItems.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\MeetingApprovalController::updateActionItems
 * @see app/Http/Controllers/MeetingApprovalController.php:76
 * @route 'http://100.107.175.84/meetings/{meeting}/approval/action-items'
 */
    const updateActionItemsForm = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateActionItems.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingApprovalController::updateActionItems
 * @see app/Http/Controllers/MeetingApprovalController.php:76
 * @route 'http://100.107.175.84/meetings/{meeting}/approval/action-items'
 */
        updateActionItemsForm.put = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateActionItems.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateActionItems.form = updateActionItemsForm
const MeetingApprovalController = { show, store, updateActionItems }

export default MeetingApprovalController