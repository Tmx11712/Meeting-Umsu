import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
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

    /**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:23
 * @route 'http://100.107.175.84/minutes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:23
 * @route 'http://100.107.175.84/minutes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:23
 * @route 'http://100.107.175.84/minutes'
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
const minutes = {
    index: Object.assign(index, index),
}

export default minutes