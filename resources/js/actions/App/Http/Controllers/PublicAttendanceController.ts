import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicAttendanceController::show
 * @see app/Http/Controllers/PublicAttendanceController.php:23
 * @route 'http://100.107.175.84/attend/{meeting}'
 */
export const show = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/attend/{meeting}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicAttendanceController::show
 * @see app/Http/Controllers/PublicAttendanceController.php:23
 * @route 'http://100.107.175.84/attend/{meeting}'
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
* @see \App\Http\Controllers\PublicAttendanceController::show
 * @see app/Http/Controllers/PublicAttendanceController.php:23
 * @route 'http://100.107.175.84/attend/{meeting}'
 */
show.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicAttendanceController::show
 * @see app/Http/Controllers/PublicAttendanceController.php:23
 * @route 'http://100.107.175.84/attend/{meeting}'
 */
show.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicAttendanceController::store
 * @see app/Http/Controllers/PublicAttendanceController.php:38
 * @route 'http://100.107.175.84/attend/{meeting}'
 */
export const store = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/attend/{meeting}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PublicAttendanceController::store
 * @see app/Http/Controllers/PublicAttendanceController.php:38
 * @route 'http://100.107.175.84/attend/{meeting}'
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
* @see \App\Http\Controllers\PublicAttendanceController::store
 * @see app/Http/Controllers/PublicAttendanceController.php:38
 * @route 'http://100.107.175.84/attend/{meeting}'
 */
store.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})
const PublicAttendanceController = { show, store }

export default PublicAttendanceController