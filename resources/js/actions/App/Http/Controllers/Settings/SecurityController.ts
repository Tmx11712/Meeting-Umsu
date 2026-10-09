import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
 * @see app/Http/Controllers/Settings/SecurityController.php:29
 * @route 'https://enotulen.irvan.cloud/settings/security'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/settings/security',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
 * @see app/Http/Controllers/Settings/SecurityController.php:29
 * @route 'https://enotulen.irvan.cloud/settings/security'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
 * @see app/Http/Controllers/Settings/SecurityController.php:29
 * @route 'https://enotulen.irvan.cloud/settings/security'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\SecurityController::edit
 * @see app/Http/Controllers/Settings/SecurityController.php:29
 * @route 'https://enotulen.irvan.cloud/settings/security'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\SecurityController::edit
 * @see app/Http/Controllers/Settings/SecurityController.php:29
 * @route 'https://enotulen.irvan.cloud/settings/security'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\SecurityController::edit
 * @see app/Http/Controllers/Settings/SecurityController.php:29
 * @route 'https://enotulen.irvan.cloud/settings/security'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\SecurityController::edit
 * @see app/Http/Controllers/Settings/SecurityController.php:29
 * @route 'https://enotulen.irvan.cloud/settings/security'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Settings\SecurityController::update
 * @see app/Http/Controllers/Settings/SecurityController.php:66
 * @route 'https://enotulen.irvan.cloud/settings/password'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: 'https://enotulen.irvan.cloud/settings/password',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SecurityController::update
 * @see app/Http/Controllers/Settings/SecurityController.php:66
 * @route 'https://enotulen.irvan.cloud/settings/password'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SecurityController::update
 * @see app/Http/Controllers/Settings/SecurityController.php:66
 * @route 'https://enotulen.irvan.cloud/settings/password'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Settings\SecurityController::update
 * @see app/Http/Controllers/Settings/SecurityController.php:66
 * @route 'https://enotulen.irvan.cloud/settings/password'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\SecurityController::update
 * @see app/Http/Controllers/Settings/SecurityController.php:66
 * @route 'https://enotulen.irvan.cloud/settings/password'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const SecurityController = { edit, update }

export default SecurityController
