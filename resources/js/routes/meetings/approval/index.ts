import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingApprovalController::store
 * @see app/Http/Controllers/MeetingApprovalController.php:41
 * @route 'http://100.107.175.84/meetings/{meeting}/approval'
 */
export const store = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
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
store.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
store.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingApprovalController::actionItems
 * @see app/Http/Controllers/MeetingApprovalController.php:76
 * @route 'http://100.107.175.84/meetings/{meeting}/approval/action-items'
 */
export const actionItems = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
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
actionItems.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
actionItems.put = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actionItems.url(args, options),
    method: 'put',
})
const approval = {
    store: Object.assign(store, store),
actionItems: Object.assign(actionItems, actionItems),
}

export default approval