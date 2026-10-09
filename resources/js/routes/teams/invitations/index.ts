import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
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
const invitations = {
    store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
}

export default invitations