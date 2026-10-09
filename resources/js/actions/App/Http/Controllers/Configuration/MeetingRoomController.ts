import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Configuration\MeetingRoomController::index
 * @see app/Http/Controllers/Configuration/MeetingRoomController.php:20
 * @route 'http://100.107.175.84/configuration/meeting-rooms'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration/meeting-rooms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\MeetingRoomController::index
 * @see app/Http/Controllers/Configuration/MeetingRoomController.php:20
 * @route 'http://100.107.175.84/configuration/meeting-rooms'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\MeetingRoomController::index
 * @see app/Http/Controllers/Configuration/MeetingRoomController.php:20
 * @route 'http://100.107.175.84/configuration/meeting-rooms'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\MeetingRoomController::index
 * @see app/Http/Controllers/Configuration/MeetingRoomController.php:20
 * @route 'http://100.107.175.84/configuration/meeting-rooms'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Configuration\MeetingRoomController::store
 * @see app/Http/Controllers/Configuration/MeetingRoomController.php:29
 * @route 'http://100.107.175.84/configuration/meeting-rooms'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/configuration/meeting-rooms',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Configuration\MeetingRoomController::store
 * @see app/Http/Controllers/Configuration/MeetingRoomController.php:29
 * @route 'http://100.107.175.84/configuration/meeting-rooms'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\MeetingRoomController::store
 * @see app/Http/Controllers/Configuration/MeetingRoomController.php:29
 * @route 'http://100.107.175.84/configuration/meeting-rooms'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Configuration\MeetingRoomController::update
 * @see app/Http/Controllers/Configuration/MeetingRoomController.php:41
 * @route 'http://100.107.175.84/configuration/meeting-rooms/{meeting_room}'
 */
export const update = (args: { meeting_room: string | number | { id: string | number } } | [meeting_room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: 'http://100.107.175.84/configuration/meeting-rooms/{meeting_room}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Configuration\MeetingRoomController::update
 * @see app/Http/Controllers/Configuration/MeetingRoomController.php:41
 * @route 'http://100.107.175.84/configuration/meeting-rooms/{meeting_room}'
 */
update.url = (args: { meeting_room: string | number | { id: string | number } } | [meeting_room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meeting_room: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meeting_room: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meeting_room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting_room: typeof args.meeting_room === 'object'
                ? args.meeting_room.id
                : args.meeting_room,
                }

    return update.definition.url
            .replace('{meeting_room}', parsedArgs.meeting_room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\MeetingRoomController::update
 * @see app/Http/Controllers/Configuration/MeetingRoomController.php:41
 * @route 'http://100.107.175.84/configuration/meeting-rooms/{meeting_room}'
 */
update.put = (args: { meeting_room: string | number | { id: string | number } } | [meeting_room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Configuration\MeetingRoomController::update
 * @see app/Http/Controllers/Configuration/MeetingRoomController.php:41
 * @route 'http://100.107.175.84/configuration/meeting-rooms/{meeting_room}'
 */
update.patch = (args: { meeting_room: string | number | { id: string | number } } | [meeting_room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Configuration\MeetingRoomController::destroy
 * @see app/Http/Controllers/Configuration/MeetingRoomController.php:53
 * @route 'http://100.107.175.84/configuration/meeting-rooms/{meeting_room}'
 */
export const destroy = (args: { meeting_room: string | number | { id: string | number } } | [meeting_room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: 'http://100.107.175.84/configuration/meeting-rooms/{meeting_room}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Configuration\MeetingRoomController::destroy
 * @see app/Http/Controllers/Configuration/MeetingRoomController.php:53
 * @route 'http://100.107.175.84/configuration/meeting-rooms/{meeting_room}'
 */
destroy.url = (args: { meeting_room: string | number | { id: string | number } } | [meeting_room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meeting_room: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meeting_room: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meeting_room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meeting_room: typeof args.meeting_room === 'object'
                ? args.meeting_room.id
                : args.meeting_room,
                }

    return destroy.definition.url
            .replace('{meeting_room}', parsedArgs.meeting_room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\MeetingRoomController::destroy
 * @see app/Http/Controllers/Configuration/MeetingRoomController.php:53
 * @route 'http://100.107.175.84/configuration/meeting-rooms/{meeting_room}'
 */
destroy.delete = (args: { meeting_room: string | number | { id: string | number } } | [meeting_room: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const MeetingRoomController = { index, store, update, destroy }

export default MeetingRoomController