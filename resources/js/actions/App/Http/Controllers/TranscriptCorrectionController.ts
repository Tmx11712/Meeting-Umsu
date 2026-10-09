import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route 'https://enotulen.irvan.cloud/transcripts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/transcripts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route 'https://enotulen.irvan.cloud/transcripts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route 'https://enotulen.irvan.cloud/transcripts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route 'https://enotulen.irvan.cloud/transcripts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route 'https://enotulen.irvan.cloud/transcripts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route 'https://enotulen.irvan.cloud/transcripts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TranscriptCorrectionController::index
 * @see app/Http/Controllers/TranscriptCorrectionController.php:25
 * @route 'https://enotulen.irvan.cloud/transcripts'
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
/**
* @see \App\Http\Controllers\TranscriptCorrectionController::show
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
export const show = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}/correction',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::show
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
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
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
show.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TranscriptCorrectionController::show
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
show.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TranscriptCorrectionController::show
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
    const showForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TranscriptCorrectionController::show
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
        showForm.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TranscriptCorrectionController::show
 * @see app/Http/Controllers/TranscriptCorrectionController.php:42
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
        showForm.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\TranscriptCorrectionController::store
 * @see app/Http/Controllers/TranscriptCorrectionController.php:68
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
export const store = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}/correction',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::store
 * @see app/Http/Controllers/TranscriptCorrectionController.php:68
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
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
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
store.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TranscriptCorrectionController::store
 * @see app/Http/Controllers/TranscriptCorrectionController.php:68
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
    const storeForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TranscriptCorrectionController::store
 * @see app/Http/Controllers/TranscriptCorrectionController.php:68
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction'
 */
        storeForm.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TranscriptCorrectionController::finish
 * @see app/Http/Controllers/TranscriptCorrectionController.php:82
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction/finish'
 */
export const finish = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

finish.definition = {
    methods: ["post"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}/correction/finish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TranscriptCorrectionController::finish
 * @see app/Http/Controllers/TranscriptCorrectionController.php:82
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction/finish'
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
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction/finish'
 */
finish.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TranscriptCorrectionController::finish
 * @see app/Http/Controllers/TranscriptCorrectionController.php:82
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction/finish'
 */
    const finishForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: finish.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TranscriptCorrectionController::finish
 * @see app/Http/Controllers/TranscriptCorrectionController.php:82
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/correction/finish'
 */
        finishForm.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: finish.url(args, options),
            method: 'post',
        })
    
    finish.form = finishForm
const TranscriptCorrectionController = { index, show, store, finish }

export default TranscriptCorrectionController
