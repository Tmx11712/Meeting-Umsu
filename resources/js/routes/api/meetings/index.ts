import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import attendance from './attendance'
/**
* @see \App\Http\Controllers\Api\MeetingApiController::index
 * @see app/Http/Controllers/Api/MeetingApiController.php:24
 * @route 'http://100.107.175.84/api/meetings'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/api/meetings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MeetingApiController::index
 * @see app/Http/Controllers/Api/MeetingApiController.php:24
 * @route 'http://100.107.175.84/api/meetings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MeetingApiController::index
 * @see app/Http/Controllers/Api/MeetingApiController.php:24
 * @route 'http://100.107.175.84/api/meetings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\MeetingApiController::index
 * @see app/Http/Controllers/Api/MeetingApiController.php:24
 * @route 'http://100.107.175.84/api/meetings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\MeetingApiController::show
 * @see app/Http/Controllers/Api/MeetingApiController.php:64
 * @route 'http://100.107.175.84/api/meetings/{meeting}'
 */
export const show = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/api/meetings/{meeting}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MeetingApiController::show
 * @see app/Http/Controllers/Api/MeetingApiController.php:64
 * @route 'http://100.107.175.84/api/meetings/{meeting}'
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
* @see \App\Http\Controllers\Api\MeetingApiController::show
 * @see app/Http/Controllers/Api/MeetingApiController.php:64
 * @route 'http://100.107.175.84/api/meetings/{meeting}'
 */
show.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\MeetingApiController::show
 * @see app/Http/Controllers/Api/MeetingApiController.php:64
 * @route 'http://100.107.175.84/api/meetings/{meeting}'
 */
show.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const meetings = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
attendance: Object.assign(attendance, attendance),
}

export default meetings