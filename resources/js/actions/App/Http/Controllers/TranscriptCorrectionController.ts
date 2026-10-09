import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route 'http://100.107.175.84/transcripts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/transcripts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route 'http://100.107.175.84/transcripts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route 'http://100.107.175.84/transcripts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route 'http://100.107.175.84/transcripts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::show
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'http://100.107.175.84/meetings/{meeting}/correction'
 */
export const show = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}/correction',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::show
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'http://100.107.175.84/meetings/{meeting}/correction'
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
* @see \App\Http\Controllers\TranscriptCorrectionController::show
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'http://100.107.175.84/meetings/{meeting}/correction'
 */
show.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TranscriptCorrectionController::show
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'http://100.107.175.84/meetings/{meeting}/correction'
 */
show.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::store
 * @see app/Http/Controllers/TranscriptCorrectionController.php:68
 * @route 'http://100.107.175.84/meetings/{meeting}/correction'
 */
export const store = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/correction',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::store
 * @see app/Http/Controllers/TranscriptCorrectionController.php:68
 * @route 'http://100.107.175.84/meetings/{meeting}/correction'
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
* @see \App\Http\Controllers\TranscriptCorrectionController::store
 * @see app/Http/Controllers/TranscriptCorrectionController.php:68
 * @route 'http://100.107.175.84/meetings/{meeting}/correction'
 */
store.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::finish
 * @see app/Http/Controllers/TranscriptCorrectionController.php:82
 * @route 'http://100.107.175.84/meetings/{meeting}/correction/finish'
 */
export const finish = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

finish.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/correction/finish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::finish
 * @see app/Http/Controllers/TranscriptCorrectionController.php:82
 * @route 'http://100.107.175.84/meetings/{meeting}/correction/finish'
 */
finish.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return finish.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::finish
 * @see app/Http/Controllers/TranscriptCorrectionController.php:82
 * @route 'http://100.107.175.84/meetings/{meeting}/correction/finish'
 */
finish.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})
const TranscriptCorrectionController = { index, show, store, finish }

export default TranscriptCorrectionController