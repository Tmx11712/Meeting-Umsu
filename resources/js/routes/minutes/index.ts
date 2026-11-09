import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:25
 * @route '/minutes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/minutes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:25
 * @route '/minutes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:25
 * @route '/minutes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:25
 * @route '/minutes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:25
 * @route '/minutes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:25
 * @route '/minutes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:25
 * @route '/minutes'
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