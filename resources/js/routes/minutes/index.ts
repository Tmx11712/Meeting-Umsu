import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:23
 * @route 'http://100.107.175.84/minutes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/minutes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:23
 * @route 'http://100.107.175.84/minutes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:23
 * @route 'http://100.107.175.84/minutes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:23
 * @route 'http://100.107.175.84/minutes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const minutes = {
    index: Object.assign(index, index),
}

export default minutes