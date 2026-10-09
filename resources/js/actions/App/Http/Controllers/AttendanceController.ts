import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:33
 * @route 'http://100.107.175.84/attendances'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/attendances',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:33
 * @route 'http://100.107.175.84/attendances'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:33
 * @route 'http://100.107.175.84/attendances'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:33
 * @route 'http://100.107.175.84/attendances'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:33
 * @route 'http://100.107.175.84/attendances'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:33
 * @route 'http://100.107.175.84/attendances'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:33
 * @route 'http://100.107.175.84/attendances'
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
* @see \App\Http\Controllers\AttendanceController::show
 * @see app/Http/Controllers/AttendanceController.php:50
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance'
 */
export const show = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}/attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::show
 * @see app/Http/Controllers/AttendanceController.php:50
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance'
 */
show.url = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\AttendanceController::show
 * @see app/Http/Controllers/AttendanceController.php:50
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance'
 */
show.get = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::show
 * @see app/Http/Controllers/AttendanceController.php:50
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance'
 */
show.head = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::show
 * @see app/Http/Controllers/AttendanceController.php:50
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance'
 */
    const showForm = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::show
 * @see app/Http/Controllers/AttendanceController.php:50
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance'
 */
        showForm.get = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::show
 * @see app/Http/Controllers/AttendanceController.php:50
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance'
 */
        showForm.head = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AttendanceController::generateQrCode
 * @see app/Http/Controllers/AttendanceController.php:61
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/qr'
 */
export const generateQrCode = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generateQrCode.url(args, options),
    method: 'get',
})

generateQrCode.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}/attendance/qr',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::generateQrCode
 * @see app/Http/Controllers/AttendanceController.php:61
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/qr'
 */
generateQrCode.url = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return generateQrCode.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::generateQrCode
 * @see app/Http/Controllers/AttendanceController.php:61
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/qr'
 */
generateQrCode.get = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generateQrCode.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::generateQrCode
 * @see app/Http/Controllers/AttendanceController.php:61
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/qr'
 */
generateQrCode.head = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generateQrCode.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::generateQrCode
 * @see app/Http/Controllers/AttendanceController.php:61
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/qr'
 */
    const generateQrCodeForm = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generateQrCode.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::generateQrCode
 * @see app/Http/Controllers/AttendanceController.php:61
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/qr'
 */
        generateQrCodeForm.get = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generateQrCode.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::generateQrCode
 * @see app/Http/Controllers/AttendanceController.php:61
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/qr'
 */
        generateQrCodeForm.head = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generateQrCode.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generateQrCode.form = generateQrCodeForm
/**
* @see \App\Http\Controllers\AttendanceController::storeManual
 * @see app/Http/Controllers/AttendanceController.php:81
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/manual'
 */
export const storeManual = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeManual.url(args, options),
    method: 'post',
})

storeManual.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/attendance/manual',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::storeManual
 * @see app/Http/Controllers/AttendanceController.php:81
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/manual'
 */
storeManual.url = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return storeManual.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::storeManual
 * @see app/Http/Controllers/AttendanceController.php:81
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/manual'
 */
storeManual.post = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeManual.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::storeManual
 * @see app/Http/Controllers/AttendanceController.php:81
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/manual'
 */
    const storeManualForm = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeManual.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::storeManual
 * @see app/Http/Controllers/AttendanceController.php:81
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/manual'
 */
        storeManualForm.post = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeManual.url(args, options),
            method: 'post',
        })
    
    storeManual.form = storeManualForm
/**
* @see \App\Http\Controllers\AttendanceController::finish
 * @see app/Http/Controllers/AttendanceController.php:129
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/finish'
 */
export const finish = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
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
finish.url = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
finish.post = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::finish
 * @see app/Http/Controllers/AttendanceController.php:129
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/finish'
 */
    const finishForm = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: finish.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::finish
 * @see app/Http/Controllers/AttendanceController.php:129
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/finish'
 */
        finishForm.post = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: finish.url(args, options),
            method: 'post',
        })
    
    finish.form = finishForm
/**
* @see \App\Http\Controllers\AttendanceController::scan
 * @see app/Http/Controllers/AttendanceController.php:140
 * @route 'http://100.107.175.84/meetings/{meeting}/scan'
 */
export const scan = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
scan.url = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
scan.get = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scan.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::scan
 * @see app/Http/Controllers/AttendanceController.php:140
 * @route 'http://100.107.175.84/meetings/{meeting}/scan'
 */
scan.head = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scan.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::scan
 * @see app/Http/Controllers/AttendanceController.php:140
 * @route 'http://100.107.175.84/meetings/{meeting}/scan'
 */
    const scanForm = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: scan.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::scan
 * @see app/Http/Controllers/AttendanceController.php:140
 * @route 'http://100.107.175.84/meetings/{meeting}/scan'
 */
        scanForm.get = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scan.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::scan
 * @see app/Http/Controllers/AttendanceController.php:140
 * @route 'http://100.107.175.84/meetings/{meeting}/scan'
 */
        scanForm.head = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scan.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    scan.form = scanForm
/**
* @see \App\Http\Controllers\AttendanceController::syncIrvanCloud
 * @see app/Http/Controllers/AttendanceController.php:174
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/sync'
 */
export const syncIrvanCloud = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncIrvanCloud.url(args, options),
    method: 'post',
})

syncIrvanCloud.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/attendance/sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::syncIrvanCloud
 * @see app/Http/Controllers/AttendanceController.php:174
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/sync'
 */
syncIrvanCloud.url = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return syncIrvanCloud.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::syncIrvanCloud
 * @see app/Http/Controllers/AttendanceController.php:174
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/sync'
 */
syncIrvanCloud.post = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: syncIrvanCloud.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::syncIrvanCloud
 * @see app/Http/Controllers/AttendanceController.php:174
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/sync'
 */
    const syncIrvanCloudForm = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: syncIrvanCloud.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::syncIrvanCloud
 * @see app/Http/Controllers/AttendanceController.php:174
 * @route 'http://100.107.175.84/meetings/{meeting}/attendance/sync'
 */
        syncIrvanCloudForm.post = (args: { meeting: string | { id: string } } | [meeting: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: syncIrvanCloud.url(args, options),
            method: 'post',
        })
    
    syncIrvanCloud.form = syncIrvanCloudForm
const AttendanceController = { index, show, generateQrCode, storeManual, finish, scan, syncIrvanCloud }

export default AttendanceController