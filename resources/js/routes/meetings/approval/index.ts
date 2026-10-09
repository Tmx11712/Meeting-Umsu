import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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
* @see \App\Http\Controllers\MeetingApprovalController::actionItems
 * @see app/Http/Controllers/MeetingApprovalController.php:76
 * @route 'http://100.107.175.84/meetings/{meeting}/approval/action-items'
 */
export const actionItems = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actionItems.url(args, options),
    method: 'put',
})

actionItems.definition = {
    methods: ["put"],
    url: 'http://100.107.175.84/meetings/{meeting}/approval/action-items',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MeetingApprovalController::actionItems
 * @see app/Http/Controllers/MeetingApprovalController.php:76
 * @route 'http://100.107.175.84/meetings/{meeting}/approval/action-items'
 */
actionItems.url = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return actionItems.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingApprovalController::actionItems
 * @see app/Http/Controllers/MeetingApprovalController.php:76
 * @route 'http://100.107.175.84/meetings/{meeting}/approval/action-items'
 */
actionItems.put = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actionItems.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\MeetingApprovalController::actionItems
 * @see app/Http/Controllers/MeetingApprovalController.php:76
 * @route 'http://100.107.175.84/meetings/{meeting}/approval/action-items'
 */
    const actionItemsForm = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actionItems.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingApprovalController::actionItems
 * @see app/Http/Controllers/MeetingApprovalController.php:76
 * @route 'http://100.107.175.84/meetings/{meeting}/approval/action-items'
 */
        actionItemsForm.put = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actionItems.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actionItems.form = actionItemsForm
const approval = {
    store: Object.assign(store, store),
actionItems: Object.assign(actionItems, actionItems),
}

export default approval