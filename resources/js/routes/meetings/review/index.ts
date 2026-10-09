import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingMinuteController::ai
 * @see app/Http/Controllers/MeetingMinuteController.php:69
 * @route 'http://100.107.175.84/meetings/{meeting}/review/ai'
 */
export const ai = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ai.url(args, options),
    method: 'post',
})

ai.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/review/ai',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::ai
 * @see app/Http/Controllers/MeetingMinuteController.php:69
 * @route 'http://100.107.175.84/meetings/{meeting}/review/ai'
 */
ai.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return ai.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingMinuteController::ai
 * @see app/Http/Controllers/MeetingMinuteController.php:69
 * @route 'http://100.107.175.84/meetings/{meeting}/review/ai'
 */
ai.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ai.url(args, options),
    method: 'post',
})

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
* @see \App\Http\Controllers\MeetingMinuteController::send
 * @see app/Http/Controllers/MeetingMinuteController.php:101
 * @route 'http://100.107.175.84/meetings/{meeting}/review/send'
 */
export const send = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/review/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::send
 * @see app/Http/Controllers/MeetingMinuteController.php:101
 * @route 'http://100.107.175.84/meetings/{meeting}/review/send'
 */
send.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return send.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingMinuteController::send
 * @see app/Http/Controllers/MeetingMinuteController.php:101
 * @route 'http://100.107.175.84/meetings/{meeting}/review/send'
 */
send.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingMinuteController::pdf
 * @see app/Http/Controllers/MeetingMinuteController.php:127
 * @route 'http://100.107.175.84/meetings/{meeting}/review/pdf'
 */
export const pdf = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}/review/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingMinuteController::pdf
 * @see app/Http/Controllers/MeetingMinuteController.php:127
 * @route 'http://100.107.175.84/meetings/{meeting}/review/pdf'
 */
pdf.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return pdf.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingMinuteController::pdf
 * @see app/Http/Controllers/MeetingMinuteController.php:127
 * @route 'http://100.107.175.84/meetings/{meeting}/review/pdf'
 */
pdf.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingMinuteController::pdf
 * @see app/Http/Controllers/MeetingMinuteController.php:127
 * @route 'http://100.107.175.84/meetings/{meeting}/review/pdf'
 */
pdf.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})
const review = {
    ai: Object.assign(ai, ai),
update: Object.assign(update, update),
send: Object.assign(send, send),
pdf: Object.assign(pdf, pdf),
}

export default review