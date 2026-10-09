import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MeetingRecordingController::show
 * @see app/Http/Controllers/MeetingRecordingController.php:24
 * @route 'http://100.107.175.84/meetings/{meeting}/recording'
 */
export const show = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/meetings/{meeting}/recording',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MeetingRecordingController::show
 * @see app/Http/Controllers/MeetingRecordingController.php:24
 * @route 'http://100.107.175.84/meetings/{meeting}/recording'
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
* @see \App\Http\Controllers\MeetingRecordingController::show
 * @see app/Http/Controllers/MeetingRecordingController.php:24
 * @route 'http://100.107.175.84/meetings/{meeting}/recording'
 */
show.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MeetingRecordingController::show
 * @see app/Http/Controllers/MeetingRecordingController.php:24
 * @route 'http://100.107.175.84/meetings/{meeting}/recording'
 */
show.head = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MeetingRecordingController::show
 * @see app/Http/Controllers/MeetingRecordingController.php:24
 * @route 'http://100.107.175.84/meetings/{meeting}/recording'
 */
    const showForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingRecordingController::show
 * @see app/Http/Controllers/MeetingRecordingController.php:24
 * @route 'http://100.107.175.84/meetings/{meeting}/recording'
 */
        showForm.get = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingRecordingController::show
 * @see app/Http/Controllers/MeetingRecordingController.php:24
 * @route 'http://100.107.175.84/meetings/{meeting}/recording'
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
* @see \App\Http\Controllers\MeetingRecordingController::store
 * @see app/Http/Controllers/MeetingRecordingController.php:57
 * @route 'http://100.107.175.84/meetings/{meeting}/recording'
 */
    const storeForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingRecordingController::store
 * @see app/Http/Controllers/MeetingRecordingController.php:57
 * @route 'http://100.107.175.84/meetings/{meeting}/recording'
 */
        storeForm.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
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
* @see \App\Http\Controllers\MeetingRecordingController::startSession
 * @see app/Http/Controllers/MeetingRecordingController.php:275
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/start-session'
 */
    const startSessionForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: startSession.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingRecordingController::startSession
 * @see app/Http/Controllers/MeetingRecordingController.php:275
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/start-session'
 */
        startSessionForm.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: startSession.url(args, options),
            method: 'post',
        })
    
    startSession.form = startSessionForm
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
* @see \App\Http\Controllers\MeetingRecordingController::stopSession
 * @see app/Http/Controllers/MeetingRecordingController.php:295
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/stop-session'
 */
    const stopSessionForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: stopSession.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingRecordingController::stopSession
 * @see app/Http/Controllers/MeetingRecordingController.php:295
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/stop-session'
 */
        stopSessionForm.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: stopSession.url(args, options),
            method: 'post',
        })
    
    stopSession.form = stopSessionForm
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
* @see \App\Http\Controllers\MeetingRecordingController::destroy
 * @see app/Http/Controllers/MeetingRecordingController.php:106
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/{recording}'
 */
    const destroyForm = (args: { meeting: string | number | { id: string | number }, recording: string | number } | [meeting: string | number | { id: string | number }, recording: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingRecordingController::destroy
 * @see app/Http/Controllers/MeetingRecordingController.php:106
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/{recording}'
 */
        destroyForm.delete = (args: { meeting: string | number | { id: string | number }, recording: string | number } | [meeting: string | number | { id: string | number }, recording: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\MeetingRecordingController::transcribe
 * @see app/Http/Controllers/MeetingRecordingController.php:141
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/transcribe'
 */
    const transcribeForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: transcribe.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingRecordingController::transcribe
 * @see app/Http/Controllers/MeetingRecordingController.php:141
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/transcribe'
 */
        transcribeForm.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: transcribe.url(args, options),
            method: 'post',
        })
    
    transcribe.form = transcribeForm
/**
* @see \App\Http\Controllers\MeetingRecordingController::finishRecording
 * @see app/Http/Controllers/MeetingRecordingController.php:171
 * @route 'http://100.107.175.84/meetings/{meeting}/finish-recording'
 */
export const finishRecording = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finishRecording.url(args, options),
    method: 'post',
})

finishRecording.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/meetings/{meeting}/finish-recording',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MeetingRecordingController::finishRecording
 * @see app/Http/Controllers/MeetingRecordingController.php:171
 * @route 'http://100.107.175.84/meetings/{meeting}/finish-recording'
 */
finishRecording.url = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return finishRecording.definition.url
            .replace('{meeting}', parsedArgs.meeting.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MeetingRecordingController::finishRecording
 * @see app/Http/Controllers/MeetingRecordingController.php:171
 * @route 'http://100.107.175.84/meetings/{meeting}/finish-recording'
 */
finishRecording.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finishRecording.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MeetingRecordingController::finishRecording
 * @see app/Http/Controllers/MeetingRecordingController.php:171
 * @route 'http://100.107.175.84/meetings/{meeting}/finish-recording'
 */
    const finishRecordingForm = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: finishRecording.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MeetingRecordingController::finishRecording
 * @see app/Http/Controllers/MeetingRecordingController.php:171
 * @route 'http://100.107.175.84/meetings/{meeting}/finish-recording'
 */
        finishRecordingForm.post = (args: { meeting: string | number | { id: string | number } } | [meeting: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: finishRecording.url(args, options),
            method: 'post',
        })
    
    finishRecording.form = finishRecordingForm
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

    /**
* @see \App\Http\Controllers\MeetingRecordingController::stream
 * @see app/Http/Controllers/MeetingRecordingController.php:247
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/{recording}/stream'
 */
    const streamForm = (args: { meeting: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stream.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MeetingRecordingController::stream
 * @see app/Http/Controllers/MeetingRecordingController.php:247
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/{recording}/stream'
 */
        streamForm.get = (args: { meeting: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stream.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MeetingRecordingController::stream
 * @see app/Http/Controllers/MeetingRecordingController.php:247
 * @route 'http://100.107.175.84/meetings/{meeting}/recording/{recording}/stream'
 */
        streamForm.head = (args: { meeting: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [meeting: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stream.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stream.form = streamForm
const MeetingRecordingController = { show, store, startSession, stopSession, destroy, transcribe, finishRecording, stream }

export default MeetingRecordingController