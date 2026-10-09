import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::index
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:18
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/configuration/meeting-types',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::index
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:18
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::index
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:18
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::index
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:18
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::index
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:18
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::index
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:18
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::index
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:18
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types'
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
* @see \App\Http\Controllers\Configuration\MeetingTypeController::store
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:27
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'https://enotulen.irvan.cloud/configuration/meeting-types',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::store
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:27
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::store
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:27
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::store
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:27
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::store
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:27
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::update
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:39
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types/{meeting_type}'
 */
export const update = (args: { meeting_type: string | number | { id: string | number } } | [meeting_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: 'https://enotulen.irvan.cloud/configuration/meeting-types/{meeting_type}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::update
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:39
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types/{meeting_type}'
 */
update.url = (args: { meeting_type: string | number | { id: string | number } } | [meeting_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meeting_type: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meeting_type: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meeting_type: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting_type: typeof args.meeting_type === 'object'
                ? args.meeting_type.id
                : args.meeting_type,
                }

    return update.definition.url
            .replace('{meeting_type}', parsedArgs.meeting_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::update
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:39
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types/{meeting_type}'
 */
update.put = (args: { meeting_type: string | number | { id: string | number } } | [meeting_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::update
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:39
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types/{meeting_type}'
 */
update.patch = (args: { meeting_type: string | number | { id: string | number } } | [meeting_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::update
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:39
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types/{meeting_type}'
 */
    const updateForm = (args: { meeting_type: string | number | { id: string | number } } | [meeting_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::update
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:39
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types/{meeting_type}'
 */
        updateForm.put = (args: { meeting_type: string | number | { id: string | number } } | [meeting_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::update
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:39
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types/{meeting_type}'
 */
        updateForm.patch = (args: { meeting_type: string | number | { id: string | number } } | [meeting_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::destroy
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:51
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types/{meeting_type}'
 */
export const destroy = (args: { meeting_type: string | number | { id: string | number } } | [meeting_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: 'https://enotulen.irvan.cloud/configuration/meeting-types/{meeting_type}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::destroy
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:51
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types/{meeting_type}'
 */
destroy.url = (args: { meeting_type: string | number | { id: string | number } } | [meeting_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meeting_type: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meeting_type: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meeting_type: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting_type: typeof args.meeting_type === 'object'
                ? args.meeting_type.id
                : args.meeting_type,
                }

    return destroy.definition.url
            .replace('{meeting_type}', parsedArgs.meeting_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::destroy
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:51
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types/{meeting_type}'
 */
destroy.delete = (args: { meeting_type: string | number | { id: string | number } } | [meeting_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::destroy
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:51
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types/{meeting_type}'
 */
    const destroyForm = (args: { meeting_type: string | number | { id: string | number } } | [meeting_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Configuration\MeetingTypeController::destroy
 * @see app/Http/Controllers/Configuration/MeetingTypeController.php:51
 * @route 'https://enotulen.irvan.cloud/configuration/meeting-types/{meeting_type}'
 */
        destroyForm.delete = (args: { meeting_type: string | number | { id: string | number } } | [meeting_type: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const MeetingTypeController = { index, store, update, destroy }

export default MeetingTypeController
