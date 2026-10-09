import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingDocumentController::store
 * @see app/Http/Controllers/MeetingDocumentController.php:15
 * @route 'http://100.107.175.84/meetings/{meeting}/documents'
 */
export const store = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingDocumentController::store
 * @see app/Http/Controllers/MeetingDocumentController.php:15
 * @route 'http://100.107.175.84/meetings/{meeting}/documents'
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
 * @route 'http://100.107.175.84/meetings/{meeting}/documents'
 */
store.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingDocumentController::destroy
 * @see app/Http/Controllers/MeetingDocumentController.php:60
 * @route 'http://100.107.175.84/meetings/{meeting}/documents/{document}'
 */
export const destroy = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: 'http://100.107.175.84/meetings/{meeting}/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MeetingDocumentController::destroy
 * @see app/Http/Controllers/MeetingDocumentController.php:60
 * @route 'http://100.107.175.84/meetings/{meeting}/documents/{document}'
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
 * @route 'http://100.107.175.84/meetings/{meeting}/documents/{document}'
 */
destroy.delete = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MeetingDocumentController::download
 * @see app/Http/Controllers/MeetingDocumentController.php:86
 * @route 'http://100.107.175.84/meetings/{meeting}/documents/{document}/download'
 */
export const download = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}/documents/{document}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingDocumentController::download
 * @see app/Http/Controllers/MeetingDocumentController.php:86
 * @route 'http://100.107.175.84/meetings/{meeting}/documents/{document}/download'
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
 * @route 'http://100.107.175.84/meetings/{meeting}/documents/{document}/download'
 */
download.get = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingDocumentController::download
 * @see app/Http/Controllers/MeetingDocumentController.php:86
 * @route 'http://100.107.175.84/meetings/{meeting}/documents/{document}/download'
 */
download.head = (args: { meeting: string | number | { id: string | number }, document: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})
const MeetingDocumentController = { store, destroy, download }

export default MeetingDocumentController