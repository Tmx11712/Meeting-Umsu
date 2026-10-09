import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TranscriptionController::progress
 * @see app/Http/Controllers/TranscriptionController.php:19
 * @route 'http://100.107.175.84/meetings/{meeting}/transcription/progress'
 */
export const progress = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progress.url(args, options),
    method: 'get',
})

progress.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}/transcription/progress',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TranscriptionController::progress
 * @see app/Http/Controllers/TranscriptionController.php:19
 * @route 'http://100.107.175.84/meetings/{meeting}/transcription/progress'
 */
progress.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return progress.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TranscriptionController::progress
 * @see app/Http/Controllers/TranscriptionController.php:19
 * @route 'http://100.107.175.84/meetings/{meeting}/transcription/progress'
 */
progress.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progress.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TranscriptionController::progress
 * @see app/Http/Controllers/TranscriptionController.php:19
 * @route 'http://100.107.175.84/meetings/{meeting}/transcription/progress'
 */
progress.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: progress.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TranscriptionController::progress
 * @see app/Http/Controllers/TranscriptionController.php:19
 * @route 'http://100.107.175.84/meetings/{meeting}/transcription/progress'
 */
    const progressForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: progress.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TranscriptionController::progress
 * @see app/Http/Controllers/TranscriptionController.php:19
 * @route 'http://100.107.175.84/meetings/{meeting}/transcription/progress'
 */
        progressForm.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: progress.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TranscriptionController::progress
 * @see app/Http/Controllers/TranscriptionController.php:19
 * @route 'http://100.107.175.84/meetings/{meeting}/transcription/progress'
 */
        progressForm.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: progress.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    progress.form = progressForm
const transcription = {
    progress: Object.assign(progress, progress),
}

export default transcription