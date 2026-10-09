import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:23
 * @route 'http://100.107.175.84/minutes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/minutes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:23
 * @route 'http://100.107.175.84/minutes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:23
 * @route 'http://100.107.175.84/minutes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:23
 * @route 'http://100.107.175.84/minutes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:23
 * @route 'http://100.107.175.84/minutes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:23
 * @route 'http://100.107.175.84/minutes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingMinuteController::index
 * @see app/Http/Controllers/MeetingMinuteController.php:23
 * @route 'http://100.107.175.84/minutes'
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
* @see \App\Http\Controllers\MeetingMinuteController::show
 * @see app/Http/Controllers/MeetingMinuteController.php:40
 * @route 'http://100.107.175.84/meetings/{meeting}/review'
 */
export const show = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}/review',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::show
 * @see app/Http/Controllers/MeetingMinuteController.php:40
 * @route 'http://100.107.175.84/meetings/{meeting}/review'
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
* @see \App\Http\Controllers\MeetingMinuteController::show
 * @see app/Http/Controllers/MeetingMinuteController.php:40
 * @route 'http://100.107.175.84/meetings/{meeting}/review'
 */
show.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingMinuteController::show
 * @see app/Http/Controllers/MeetingMinuteController.php:40
 * @route 'http://100.107.175.84/meetings/{meeting}/review'
 */
show.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MeetingMinuteController::show
 * @see app/Http/Controllers/MeetingMinuteController.php:40
 * @route 'http://100.107.175.84/meetings/{meeting}/review'
 */
    const showForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingMinuteController::show
 * @see app/Http/Controllers/MeetingMinuteController.php:40
 * @route 'http://100.107.175.84/meetings/{meeting}/review'
 */
        showForm.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingMinuteController::show
 * @see app/Http/Controllers/MeetingMinuteController.php:40
 * @route 'http://100.107.175.84/meetings/{meeting}/review'
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
* @see \App\Http\Controllers\MeetingMinuteController::generateAiSummary
 * @see app/Http/Controllers/MeetingMinuteController.php:69
 * @route 'http://100.107.175.84/meetings/{meeting}/review/ai'
 */
export const generateAiSummary = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateAiSummary.url(args, options),
    method: 'post',
})

generateAiSummary.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/review/ai',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::generateAiSummary
 * @see app/Http/Controllers/MeetingMinuteController.php:69
 * @route 'http://100.107.175.84/meetings/{meeting}/review/ai'
 */
generateAiSummary.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return generateAiSummary.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingMinuteController::generateAiSummary
 * @see app/Http/Controllers/MeetingMinuteController.php:69
 * @route 'http://100.107.175.84/meetings/{meeting}/review/ai'
 */
generateAiSummary.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateAiSummary.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MeetingMinuteController::generateAiSummary
 * @see app/Http/Controllers/MeetingMinuteController.php:69
 * @route 'http://100.107.175.84/meetings/{meeting}/review/ai'
 */
    const generateAiSummaryForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generateAiSummary.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingMinuteController::generateAiSummary
 * @see app/Http/Controllers/MeetingMinuteController.php:69
 * @route 'http://100.107.175.84/meetings/{meeting}/review/ai'
 */
        generateAiSummaryForm.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generateAiSummary.url(args, options),
            method: 'post',
        })
    
    generateAiSummary.form = generateAiSummaryForm
/**
* @see \App\Http\Controllers\MeetingMinuteController::update
 * @see app/Http/Controllers/MeetingMinuteController.php:87
 * @route 'http://100.107.175.84/meetings/{meeting}/review'
 */
export const update = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: 'http://100.107.175.84/meetings/{meeting}/review',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::update
 * @see app/Http/Controllers/MeetingMinuteController.php:87
 * @route 'http://100.107.175.84/meetings/{meeting}/review'
 */
update.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingMinuteController::update
 * @see app/Http/Controllers/MeetingMinuteController.php:87
 * @route 'http://100.107.175.84/meetings/{meeting}/review'
 */
update.put = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\MeetingMinuteController::update
 * @see app/Http/Controllers/MeetingMinuteController.php:87
 * @route 'http://100.107.175.84/meetings/{meeting}/review'
 */
    const updateForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingMinuteController::update
 * @see app/Http/Controllers/MeetingMinuteController.php:87
 * @route 'http://100.107.175.84/meetings/{meeting}/review'
 */
        updateForm.put = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\MeetingMinuteController::sendToPimpinan
 * @see app/Http/Controllers/MeetingMinuteController.php:101
 * @route 'http://100.107.175.84/meetings/{meeting}/review/send'
 */
export const sendToPimpinan = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendToPimpinan.url(args, options),
    method: 'post',
})

sendToPimpinan.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/review/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::sendToPimpinan
 * @see app/Http/Controllers/MeetingMinuteController.php:101
 * @route 'http://100.107.175.84/meetings/{meeting}/review/send'
 */
sendToPimpinan.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return sendToPimpinan.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingMinuteController::sendToPimpinan
 * @see app/Http/Controllers/MeetingMinuteController.php:101
 * @route 'http://100.107.175.84/meetings/{meeting}/review/send'
 */
sendToPimpinan.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendToPimpinan.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MeetingMinuteController::sendToPimpinan
 * @see app/Http/Controllers/MeetingMinuteController.php:101
 * @route 'http://100.107.175.84/meetings/{meeting}/review/send'
 */
    const sendToPimpinanForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendToPimpinan.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingMinuteController::sendToPimpinan
 * @see app/Http/Controllers/MeetingMinuteController.php:101
 * @route 'http://100.107.175.84/meetings/{meeting}/review/send'
 */
        sendToPimpinanForm.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendToPimpinan.url(args, options),
            method: 'post',
        })
    
    sendToPimpinan.form = sendToPimpinanForm
/**
* @see \App\Http\Controllers\MeetingMinuteController::downloadPdf
 * @see app/Http/Controllers/MeetingMinuteController.php:127
 * @route 'http://100.107.175.84/meetings/{meeting}/review/pdf'
 */
export const downloadPdf = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
})

downloadPdf.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}/review/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::downloadPdf
 * @see app/Http/Controllers/MeetingMinuteController.php:127
 * @route 'http://100.107.175.84/meetings/{meeting}/review/pdf'
 */
downloadPdf.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return downloadPdf.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingMinuteController::downloadPdf
 * @see app/Http/Controllers/MeetingMinuteController.php:127
 * @route 'http://100.107.175.84/meetings/{meeting}/review/pdf'
 */
downloadPdf.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingMinuteController::downloadPdf
 * @see app/Http/Controllers/MeetingMinuteController.php:127
 * @route 'http://100.107.175.84/meetings/{meeting}/review/pdf'
 */
downloadPdf.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MeetingMinuteController::downloadPdf
 * @see app/Http/Controllers/MeetingMinuteController.php:127
 * @route 'http://100.107.175.84/meetings/{meeting}/review/pdf'
 */
    const downloadPdfForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingMinuteController::downloadPdf
 * @see app/Http/Controllers/MeetingMinuteController.php:127
 * @route 'http://100.107.175.84/meetings/{meeting}/review/pdf'
 */
        downloadPdfForm.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingMinuteController::downloadPdf
 * @see app/Http/Controllers/MeetingMinuteController.php:127
 * @route 'http://100.107.175.84/meetings/{meeting}/review/pdf'
 */
        downloadPdfForm.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadPdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadPdf.form = downloadPdfForm
const MeetingMinuteController = { index, show, generateAiSummary, update, sendToPimpinan, downloadPdf }

export default MeetingMinuteController