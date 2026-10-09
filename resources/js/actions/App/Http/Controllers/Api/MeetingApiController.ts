import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\MeetingApiController::index
 * @see app/Http/Controllers/Api/MeetingApiController.php:24
 * @route 'https://enotulen.irvan.cloud/api/meetings'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/api/meetings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MeetingApiController::index
 * @see app/Http/Controllers/Api/MeetingApiController.php:24
 * @route 'https://enotulen.irvan.cloud/api/meetings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MeetingApiController::index
 * @see app/Http/Controllers/Api/MeetingApiController.php:24
 * @route 'https://enotulen.irvan.cloud/api/meetings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\MeetingApiController::index
 * @see app/Http/Controllers/Api/MeetingApiController.php:24
 * @route 'https://enotulen.irvan.cloud/api/meetings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\MeetingApiController::index
 * @see app/Http/Controllers/Api/MeetingApiController.php:24
 * @route 'https://enotulen.irvan.cloud/api/meetings'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\MeetingApiController::index
 * @see app/Http/Controllers/Api/MeetingApiController.php:24
 * @route 'https://enotulen.irvan.cloud/api/meetings'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\MeetingApiController::index
 * @see app/Http/Controllers/Api/MeetingApiController.php:24
 * @route 'https://enotulen.irvan.cloud/api/meetings'
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
* @see \App\Http\Controllers\Api\MeetingApiController::show
 * @see app/Http/Controllers/Api/MeetingApiController.php:64
 * @route 'https://enotulen.irvan.cloud/api/meetings/{meeting}'
 */
export const show = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/api/meetings/{meeting}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MeetingApiController::show
 * @see app/Http/Controllers/Api/MeetingApiController.php:64
 * @route 'https://enotulen.irvan.cloud/api/meetings/{meeting}'
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
 * @route 'https://enotulen.irvan.cloud/api/meetings/{meeting}'
 */
show.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\MeetingApiController::show
 * @see app/Http/Controllers/Api/MeetingApiController.php:64
 * @route 'https://enotulen.irvan.cloud/api/meetings/{meeting}'
 */
show.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\MeetingApiController::show
 * @see app/Http/Controllers/Api/MeetingApiController.php:64
 * @route 'https://enotulen.irvan.cloud/api/meetings/{meeting}'
 */
    const showForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\MeetingApiController::show
 * @see app/Http/Controllers/Api/MeetingApiController.php:64
 * @route 'https://enotulen.irvan.cloud/api/meetings/{meeting}'
 */
        showForm.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\MeetingApiController::show
 * @see app/Http/Controllers/Api/MeetingApiController.php:64
 * @route 'https://enotulen.irvan.cloud/api/meetings/{meeting}'
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
const MeetingApiController = { index, show }

export default MeetingApiController
