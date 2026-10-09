import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\SecurityController::update
 * @see app/Http/Controllers/Settings/SecurityController.php:66
 * @route 'http://100.107.175.84/settings/password'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: 'http://100.107.175.84/settings/password',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SecurityController::update
 * @see app/Http/Controllers/Settings/SecurityController.php:66
 * @route 'http://100.107.175.84/settings/password'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SecurityController::update
 * @see app/Http/Controllers/Settings/SecurityController.php:66
 * @route 'http://100.107.175.84/settings/password'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})
const userPassword = {
    update: Object.assign(update, update),
}

export default userPassword