import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PublicAttendanceController::form
 * @see app/Http/Controllers/PublicAttendanceController.php:23
 * @route 'http://100.107.175.84/attend/{meeting}'
 */
export const form = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: form.url(args, options),
    method: 'get',
})

form.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/attend/{meeting}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicAttendanceController::form
 * @see app/Http/Controllers/PublicAttendanceController.php:23
 * @route 'http://100.107.175.84/attend/{meeting}'
 */
form.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return form.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicAttendanceController::form
 * @see app/Http/Controllers/PublicAttendanceController.php:23
 * @route 'http://100.107.175.84/attend/{meeting}'
 */
form.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: form.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicAttendanceController::form
 * @see app/Http/Controllers/PublicAttendanceController.php:23
 * @route 'http://100.107.175.84/attend/{meeting}'
 */
form.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: form.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicAttendanceController::submit
 * @see app/Http/Controllers/PublicAttendanceController.php:38
 * @route 'http://100.107.175.84/attend/{meeting}'
 */
export const submit = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/attend/{meeting}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PublicAttendanceController::submit
 * @see app/Http/Controllers/PublicAttendanceController.php:38
 * @route 'http://100.107.175.84/attend/{meeting}'
 */
submit.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return submit.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicAttendanceController::submit
 * @see app/Http/Controllers/PublicAttendanceController.php:38
 * @route 'http://100.107.175.84/attend/{meeting}'
 */
submit.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})
const attend = {
    form: Object.assign(form, form),
submit: Object.assign(submit, submit),
}

export default attend