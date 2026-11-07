import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route '/transcripts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/transcripts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route '/transcripts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route '/transcripts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route '/transcripts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route '/transcripts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route '/transcripts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route '/transcripts'
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
const transcripts = {
    index: Object.assign(index, index),
}

export default transcripts