import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AttendanceApiController::index
 * @see app/Http/Controllers/Api/AttendanceApiController.php:30
 * @route 'http://100.107.175.84/api/meetings/{meeting}/attendance'
 */
export const index = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/api/meetings/{meeting}/attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AttendanceApiController::index
 * @see app/Http/Controllers/Api/AttendanceApiController.php:30
 * @route 'http://100.107.175.84/api/meetings/{meeting}/attendance'
 */
index.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AttendanceApiController::index
 * @see app/Http/Controllers/Api/AttendanceApiController.php:30
 * @route 'http://100.107.175.84/api/meetings/{meeting}/attendance'
 */
index.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AttendanceApiController::index
 * @see app/Http/Controllers/Api/AttendanceApiController.php:30
 * @route 'http://100.107.175.84/api/meetings/{meeting}/attendance'
 */
index.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AttendanceApiController::index
 * @see app/Http/Controllers/Api/AttendanceApiController.php:30
 * @route 'http://100.107.175.84/api/meetings/{meeting}/attendance'
 */
    const indexForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AttendanceApiController::index
 * @see app/Http/Controllers/Api/AttendanceApiController.php:30
 * @route 'http://100.107.175.84/api/meetings/{meeting}/attendance'
 */
        indexForm.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AttendanceApiController::index
 * @see app/Http/Controllers/Api/AttendanceApiController.php:30
 * @route 'http://100.107.175.84/api/meetings/{meeting}/attendance'
 */
        indexForm.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\AttendanceApiController::scan
 * @see app/Http/Controllers/Api/AttendanceApiController.php:66
 * @route 'http://100.107.175.84/api/meetings/{meeting}/attendance/scan'
 */
export const scan = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scan.url(args, options),
    method: 'post',
})

scan.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/api/meetings/{meeting}/attendance/scan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AttendanceApiController::scan
 * @see app/Http/Controllers/Api/AttendanceApiController.php:66
 * @route 'http://100.107.175.84/api/meetings/{meeting}/attendance/scan'
 */
scan.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return scan.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AttendanceApiController::scan
 * @see app/Http/Controllers/Api/AttendanceApiController.php:66
 * @route 'http://100.107.175.84/api/meetings/{meeting}/attendance/scan'
 */
scan.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scan.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AttendanceApiController::scan
 * @see app/Http/Controllers/Api/AttendanceApiController.php:66
 * @route 'http://100.107.175.84/api/meetings/{meeting}/attendance/scan'
 */
    const scanForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: scan.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AttendanceApiController::scan
 * @see app/Http/Controllers/Api/AttendanceApiController.php:66
 * @route 'http://100.107.175.84/api/meetings/{meeting}/attendance/scan'
 */
        scanForm.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: scan.url(args, options),
            method: 'post',
        })
    
    scan.form = scanForm
const AttendanceApiController = { index, scan }

export default AttendanceApiController