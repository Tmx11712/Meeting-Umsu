import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingDocumentController::store
 * @see app/Http/Controllers/MeetingDocumentController.php:15
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents'
 */
export const store = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingDocumentController::store
 * @see app/Http/Controllers/MeetingDocumentController.php:15
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents'
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
* @see \App\Http\Controllers\MeetingDocumentController::store
 * @see app/Http/Controllers/MeetingDocumentController.php:15
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents'
 */
store.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MeetingDocumentController::store
 * @see app/Http/Controllers/MeetingDocumentController.php:15
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents'
 */
    const storeForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingDocumentController::store
 * @see app/Http/Controllers/MeetingDocumentController.php:15
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents'
 */
        storeForm.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\MeetingDocumentController::destroy
 * @see app/Http/Controllers/MeetingDocumentController.php:60
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents/{document}'
 */
export const destroy = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MeetingDocumentController::destroy
 * @see app/Http/Controllers/MeetingDocumentController.php:60
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents/{document}'
 */
destroy.url = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    meeting: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting: typeof args.meeting === 'object'
                ? args.meeting.id
                : args.meeting,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return destroy.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingDocumentController::destroy
 * @see app/Http/Controllers/MeetingDocumentController.php:60
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents/{document}'
 */
destroy.delete = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\MeetingDocumentController::destroy
 * @see app/Http/Controllers/MeetingDocumentController.php:60
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents/{document}'
 */
    const destroyForm = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingDocumentController::destroy
 * @see app/Http/Controllers/MeetingDocumentController.php:60
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents/{document}'
 */
        destroyForm.delete = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\MeetingDocumentController::download
 * @see app/Http/Controllers/MeetingDocumentController.php:86
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents/{document}/download'
 */
export const download = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/meetings/{meeting}/documents/{document}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingDocumentController::download
 * @see app/Http/Controllers/MeetingDocumentController.php:86
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents/{document}/download'
 */
download.url = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    meeting: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting: typeof args.meeting === 'object'
                ? args.meeting.id
                : args.meeting,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return download.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingDocumentController::download
 * @see app/Http/Controllers/MeetingDocumentController.php:86
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents/{document}/download'
 */
download.get = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingDocumentController::download
 * @see app/Http/Controllers/MeetingDocumentController.php:86
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents/{document}/download'
 */
download.head = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MeetingDocumentController::download
 * @see app/Http/Controllers/MeetingDocumentController.php:86
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents/{document}/download'
 */
    const downloadForm = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingDocumentController::download
 * @see app/Http/Controllers/MeetingDocumentController.php:86
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents/{document}/download'
 */
        downloadForm.get = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingDocumentController::download
 * @see app/Http/Controllers/MeetingDocumentController.php:86
 * @route 'https://enotulen.irvan.cloud/meetings/{meeting}/documents/{document}/download'
 */
        downloadForm.head = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
const MeetingDocumentController = { store, destroy, download }

export default MeetingDocumentController
