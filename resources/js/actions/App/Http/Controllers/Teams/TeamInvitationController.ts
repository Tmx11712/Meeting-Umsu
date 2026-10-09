import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Teams\TeamInvitationController::accept
 * @see app/Http/Controllers/Teams/TeamInvitationController.php:61
 * @route 'http://100.107.175.84/invitations/{invitation}/accept'
 */
export const accept = (args: { invitation: string | number | { code: string | number } } | [invitation: string | number | { code: string | number } ] | string | number | { code: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accept.url(args, options),
    method: 'get',
})

accept.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/invitations/{invitation}/accept',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teams\TeamInvitationController::accept
 * @see app/Http/Controllers/Teams/TeamInvitationController.php:61
 * @route 'http://100.107.175.84/invitations/{invitation}/accept'
 */
accept.url = (args: { invitation: string | number | { code: string | number } } | [invitation: string | number | { code: string | number } ] | string | number | { code: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invitation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'code' in args) {
            args = { invitation: args.code }
        }
    
    if (Array.isArray(args)) {
        args = {
                    invitation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invitation: typeof args.invitation === 'object'
                ? args.invitation.code
                : args.invitation,
                }

    return accept.definition.url
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\TeamInvitationController::accept
 * @see app/Http/Controllers/Teams/TeamInvitationController.php:61
 * @route 'http://100.107.175.84/invitations/{invitation}/accept'
 */
accept.get = (args: { invitation: string | number | { code: string | number } } | [invitation: string | number | { code: string | number } ] | string | number | { code: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accept.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Teams\TeamInvitationController::accept
 * @see app/Http/Controllers/Teams/TeamInvitationController.php:61
 * @route 'http://100.107.175.84/invitations/{invitation}/accept'
 */
accept.head = (args: { invitation: string | number | { code: string | number } } | [invitation: string | number | { code: string | number } ] | string | number | { code: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: accept.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Teams\TeamInvitationController::decline
 * @see app/Http/Controllers/Teams/TeamInvitationController.php:86
 * @route 'http://100.107.175.84/invitations/{invitation}'
 */
export const decline = (args: { invitation: string | number | { code: string | number } } | [invitation: string | number | { code: string | number } ] | string | number | { code: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: decline.url(args, options),
    method: 'delete',
})

decline.definition = {
    methods: ["delete"],
    url: 'http://100.107.175.84/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Teams\TeamInvitationController::decline
 * @see app/Http/Controllers/Teams/TeamInvitationController.php:86
 * @route 'http://100.107.175.84/invitations/{invitation}'
 */
decline.url = (args: { invitation: string | number | { code: string | number } } | [invitation: string | number | { code: string | number } ] | string | number | { code: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invitation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'code' in args) {
            args = { invitation: args.code }
        }
    
    if (Array.isArray(args)) {
        args = {
                    invitation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invitation: typeof args.invitation === 'object'
                ? args.invitation.code
                : args.invitation,
                }

    return decline.definition.url
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\TeamInvitationController::decline
 * @see app/Http/Controllers/Teams/TeamInvitationController.php:86
 * @route 'http://100.107.175.84/invitations/{invitation}'
 */
decline.delete = (args: { invitation: string | number | { code: string | number } } | [invitation: string | number | { code: string | number } ] | string | number | { code: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: decline.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Teams\TeamInvitationController::store
 * @see app/Http/Controllers/Teams/TeamInvitationController.php:23
 * @route 'http://100.107.175.84/settings/teams/{team}/invitations'
 */
export const store = (args: { team: string | number | { slug: string | number } } | [team: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/settings/teams/{team}/invitations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teams\TeamInvitationController::store
 * @see app/Http/Controllers/Teams/TeamInvitationController.php:23
 * @route 'http://100.107.175.84/settings/teams/{team}/invitations'
 */
store.url = (args: { team: string | number | { slug: string | number } } | [team: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { team: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    team: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team: typeof args.team === 'object'
                ? args.team.slug
                : args.team,
                }

    return store.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\TeamInvitationController::store
 * @see app/Http/Controllers/Teams/TeamInvitationController.php:23
 * @route 'http://100.107.175.84/settings/teams/{team}/invitations'
 */
store.post = (args: { team: string | number | { slug: string | number } } | [team: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teams\TeamInvitationController::destroy
 * @see app/Http/Controllers/Teams/TeamInvitationController.php:45
 * @route 'http://100.107.175.84/settings/teams/{team}/invitations/{invitation}'
 */
export const destroy = (args: { team: string | number | { slug: string | number }, invitation: string | number | { code: string | number } } | [team: string | number | { slug: string | number }, invitation: string | number | { code: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: 'http://100.107.175.84/settings/teams/{team}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Teams\TeamInvitationController::destroy
 * @see app/Http/Controllers/Teams/TeamInvitationController.php:45
 * @route 'http://100.107.175.84/settings/teams/{team}/invitations/{invitation}'
 */
destroy.url = (args: { team: string | number | { slug: string | number }, invitation: string | number | { code: string | number } } | [team: string | number | { slug: string | number }, invitation: string | number | { code: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    team: args[0],
                    invitation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team: typeof args.team === 'object'
                ? args.team.slug
                : args.team,
                                invitation: typeof args.invitation === 'object'
                ? args.invitation.code
                : args.invitation,
                }

    return destroy.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\TeamInvitationController::destroy
 * @see app/Http/Controllers/Teams/TeamInvitationController.php:45
 * @route 'http://100.107.175.84/settings/teams/{team}/invitations/{invitation}'
 */
destroy.delete = (args: { team: string | number | { slug: string | number }, invitation: string | number | { code: string | number } } | [team: string | number | { slug: string | number }, invitation: string | number | { code: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const TeamInvitationController = { accept, decline, store, destroy }

export default TeamInvitationController