import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AttendanceController::qr
 * @see app/Http/Controllers/AttendanceController.php:61
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/qr'
 */
export const qr = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})

qr.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}/attendance/qr',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::qr
 * @see app/Http/Controllers/AttendanceController.php:61
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/qr'
 */
qr.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return qr.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::qr
 * @see app/Http/Controllers/AttendanceController.php:61
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/qr'
 */
qr.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::qr
 * @see app/Http/Controllers/AttendanceController.php:61
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/qr'
 */
qr.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: qr.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AttendanceController::manual
 * @see app/Http/Controllers/AttendanceController.php:81
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/manual'
 */
export const manual = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: manual.url(args, options),
    method: 'post',
})

manual.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/attendance/manual',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::manual
 * @see app/Http/Controllers/AttendanceController.php:81
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/manual'
 */
manual.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return manual.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::manual
 * @see app/Http/Controllers/AttendanceController.php:81
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/manual'
 */
manual.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: manual.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AttendanceController::finish
 * @see app/Http/Controllers/AttendanceController.php:129
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/finish'
 */
export const finish = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

finish.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/attendance/finish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::finish
 * @see app/Http/Controllers/AttendanceController.php:129
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/finish'
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
* @see \App\Http\Controllers\AttendanceController::finish
 * @see app/Http/Controllers/AttendanceController.php:129
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/finish'
 */
finish.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AttendanceController::scan
 * @see app/Http/Controllers/AttendanceController.php:140
 * @route 'http://100.107.175.84/meetings/{meeting}/scan'
 */
export const scan = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scan.url(args, options),
    method: 'get',
})

scan.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}/scan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::scan
 * @see app/Http/Controllers/AttendanceController.php:140
 * @route 'http://100.107.175.84/meetings/{meeting}/scan'
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
* @see \App\Http\Controllers\AttendanceController::scan
 * @see app/Http/Controllers/AttendanceController.php:140
 * @route 'http://100.107.175.84/meetings/{meeting}/scan'
 */
scan.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scan.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::scan
 * @see app/Http/Controllers/AttendanceController.php:140
 * @route 'http://100.107.175.84/meetings/{meeting}/scan'
 */
scan.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scan.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AttendanceController::sync
 * @see app/Http/Controllers/AttendanceController.php:174
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/sync'
 */
export const sync = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(args, options),
    method: 'post',
})

sync.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/attendance/sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::sync
 * @see app/Http/Controllers/AttendanceController.php:174
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/sync'
 */
sync.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return sync.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::sync
 * @see app/Http/Controllers/AttendanceController.php:174
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/sync'
 */
sync.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(args, options),
    method: 'post',
})
const attendance = {
    qr: Object.assign(qr, qr),
manual: Object.assign(manual, manual),
finish: Object.assign(finish, finish),
scan: Object.assign(scan, scan),
sync: Object.assign(sync, sync),
}

export default attendance