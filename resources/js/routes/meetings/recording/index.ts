import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingRecordingController::store
 * @see app/Http/Controllers/MeetingRecordingController.php:57
 * @route 'http://100.107.175.84/meetings/{meeting}/recording'
 */
export const store = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/recording',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingRecordingController::store
 * @see app/Http/Controllers/MeetingRecordingController.php:57
 * @route 'http://100.107.175.84/meetings/{meeting}/recording'
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
* @see \App\Http\Controllers\MeetingRecordingController::store
 * @see app/Http/Controllers/MeetingRecordingController.php:57
 * @route 'http://100.107.175.84/meetings/{meeting}/recording'
 */
store.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingRecordingController::startSession
 * @see app/Http/Controllers/MeetingRecordingController.php:275
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/start-session'
 */
export const startSession = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startSession.url(args, options),
    method: 'post',
})

startSession.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/recording/start-session',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingRecordingController::startSession
 * @see app/Http/Controllers/MeetingRecordingController.php:275
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/start-session'
 */
startSession.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return startSession.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingRecordingController::startSession
 * @see app/Http/Controllers/MeetingRecordingController.php:275
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/start-session'
 */
startSession.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startSession.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingRecordingController::stopSession
 * @see app/Http/Controllers/MeetingRecordingController.php:295
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/stop-session'
 */
export const stopSession = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stopSession.url(args, options),
    method: 'post',
})

stopSession.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/recording/stop-session',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingRecordingController::stopSession
 * @see app/Http/Controllers/MeetingRecordingController.php:295
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/stop-session'
 */
stopSession.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return stopSession.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingRecordingController::stopSession
 * @see app/Http/Controllers/MeetingRecordingController.php:295
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/stop-session'
 */
stopSession.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stopSession.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingRecordingController::destroy
 * @see app/Http/Controllers/MeetingRecordingController.php:106
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/{recording}'
 */
export const destroy = (args: { meeting: string | number | { id: string | number }, recording: string | number } | [meeting: string | number | { id: string | number }, recording: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: 'http://100.107.175.84/meetings/{meeting}/recording/{recording}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MeetingRecordingController::destroy
 * @see app/Http/Controllers/MeetingRecordingController.php:106
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/{recording}'
 */
destroy.url = (args: { meeting: string | number | { id: string | number }, recording: string | number } | [meeting: string | number | { id: string | number }, recording: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    meeting: args[0],
                    recording: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting: typeof args.meeting === 'object'
                ? args.meeting.id
                : args.meeting,
                                recording: args.recording,
                }

    return destroy.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace('{recording}', parsedArgs.recording.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingRecordingController::destroy
 * @see app/Http/Controllers/MeetingRecordingController.php:106
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/{recording}'
 */
destroy.delete = (args: { meeting: string | number | { id: string | number }, recording: string | number } | [meeting: string | number | { id: string | number }, recording: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MeetingRecordingController::transcribe
 * @see app/Http/Controllers/MeetingRecordingController.php:141
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/transcribe'
 */
export const transcribe = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transcribe.url(args, options),
    method: 'post',
})

transcribe.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/recording/transcribe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingRecordingController::transcribe
 * @see app/Http/Controllers/MeetingRecordingController.php:141
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/transcribe'
 */
transcribe.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return transcribe.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingRecordingController::transcribe
 * @see app/Http/Controllers/MeetingRecordingController.php:141
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/transcribe'
 */
transcribe.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transcribe.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingRecordingController::finish
 * @see app/Http/Controllers/MeetingRecordingController.php:171
 * @route 'http://100.107.175.84/meetings/{meeting}/finish-recording'
 */
export const finish = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

finish.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/finish-recording',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingRecordingController::finish
 * @see app/Http/Controllers/MeetingRecordingController.php:171
 * @route 'http://100.107.175.84/meetings/{meeting}/finish-recording'
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
* @see \App\Http\Controllers\MeetingRecordingController::finish
 * @see app/Http/Controllers/MeetingRecordingController.php:171
 * @route 'http://100.107.175.84/meetings/{meeting}/finish-recording'
 */
finish.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MeetingRecordingController::stream
 * @see app/Http/Controllers/MeetingRecordingController.php:247
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/{recording}/stream'
 */
export const stream = (args: { meeting: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})

stream.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}/recording/{recording}/stream',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingRecordingController::stream
 * @see app/Http/Controllers/MeetingRecordingController.php:247
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/{recording}/stream'
 */
stream.url = (args: { meeting: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    meeting: args[0],
                    recording: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting: typeof args.meeting === 'object'
                ? args.meeting.id
                : args.meeting,
                                recording: typeof args.recording === 'object'
                ? args.recording.id
                : args.recording,
                }

    return stream.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace('{recording}', parsedArgs.recording.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingRecordingController::stream
 * @see app/Http/Controllers/MeetingRecordingController.php:247
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/{recording}/stream'
 */
stream.get = (args: { meeting: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingRecordingController::stream
 * @see app/Http/Controllers/MeetingRecordingController.php:247
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/{recording}/stream'
 */
stream.head = (args: { meeting: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stream.url(args, options),
    method: 'head',
})
const recording = {
    store: Object.assign(store, store),
startSession: Object.assign(startSession, startSession),
stopSession: Object.assign(stopSession, stopSession),
destroy: Object.assign(destroy, destroy),
transcribe: Object.assign(transcribe, transcribe),
finish: Object.assign(finish, finish),
stream: Object.assign(stream, stream),
}

export default recording