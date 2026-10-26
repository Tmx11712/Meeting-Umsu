import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
const RedirectController0241be9f84ad24d14efd5cad31f38c02 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectController0241be9f84ad24d14efd5cad31f38c02.url(options),
    method: 'get',
})

RedirectController0241be9f84ad24d14efd5cad31f38c02.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: 'https://enotulen.irvan.cloud',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
RedirectController0241be9f84ad24d14efd5cad31f38c02.url = (options?: RouteQueryOptions) => {
    return RedirectController0241be9f84ad24d14efd5cad31f38c02.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
RedirectController0241be9f84ad24d14efd5cad31f38c02.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectController0241be9f84ad24d14efd5cad31f38c02.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
RedirectController0241be9f84ad24d14efd5cad31f38c02.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RedirectController0241be9f84ad24d14efd5cad31f38c02.url(options),
    method: 'head',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
RedirectController0241be9f84ad24d14efd5cad31f38c02.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: RedirectController0241be9f84ad24d14efd5cad31f38c02.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
RedirectController0241be9f84ad24d14efd5cad31f38c02.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: RedirectController0241be9f84ad24d14efd5cad31f38c02.url(options),
    method: 'put',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
RedirectController0241be9f84ad24d14efd5cad31f38c02.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RedirectController0241be9f84ad24d14efd5cad31f38c02.url(options),
    method: 'patch',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
RedirectController0241be9f84ad24d14efd5cad31f38c02.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: RedirectController0241be9f84ad24d14efd5cad31f38c02.url(options),
    method: 'delete',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
RedirectController0241be9f84ad24d14efd5cad31f38c02.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: RedirectController0241be9f84ad24d14efd5cad31f38c02.url(options),
    method: 'options',
})

    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
    const RedirectController0241be9f84ad24d14efd5cad31f38c02Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: RedirectController0241be9f84ad24d14efd5cad31f38c02.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
        RedirectController0241be9f84ad24d14efd5cad31f38c02Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController0241be9f84ad24d14efd5cad31f38c02.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
        RedirectController0241be9f84ad24d14efd5cad31f38c02Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController0241be9f84ad24d14efd5cad31f38c02.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
        RedirectController0241be9f84ad24d14efd5cad31f38c02Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController0241be9f84ad24d14efd5cad31f38c02.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
        RedirectController0241be9f84ad24d14efd5cad31f38c02Form.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController0241be9f84ad24d14efd5cad31f38c02.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
        RedirectController0241be9f84ad24d14efd5cad31f38c02Form.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController0241be9f84ad24d14efd5cad31f38c02.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
        RedirectController0241be9f84ad24d14efd5cad31f38c02Form.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController0241be9f84ad24d14efd5cad31f38c02.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud'
 */
        RedirectController0241be9f84ad24d14efd5cad31f38c02Form.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController0241be9f84ad24d14efd5cad31f38c02.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'OPTIONS',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    RedirectController0241be9f84ad24d14efd5cad31f38c02.form = RedirectController0241be9f84ad24d14efd5cad31f38c02Form
    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
const RedirectController879a294197f855a3a72014a5672dc11e = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectController879a294197f855a3a72014a5672dc11e.url(options),
    method: 'get',
})

RedirectController879a294197f855a3a72014a5672dc11e.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: 'https://enotulen.irvan.cloud/settings',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
RedirectController879a294197f855a3a72014a5672dc11e.url = (options?: RouteQueryOptions) => {
    return RedirectController879a294197f855a3a72014a5672dc11e.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
RedirectController879a294197f855a3a72014a5672dc11e.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectController879a294197f855a3a72014a5672dc11e.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
RedirectController879a294197f855a3a72014a5672dc11e.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RedirectController879a294197f855a3a72014a5672dc11e.url(options),
    method: 'head',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
RedirectController879a294197f855a3a72014a5672dc11e.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: RedirectController879a294197f855a3a72014a5672dc11e.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
RedirectController879a294197f855a3a72014a5672dc11e.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: RedirectController879a294197f855a3a72014a5672dc11e.url(options),
    method: 'put',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
RedirectController879a294197f855a3a72014a5672dc11e.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RedirectController879a294197f855a3a72014a5672dc11e.url(options),
    method: 'patch',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
RedirectController879a294197f855a3a72014a5672dc11e.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: RedirectController879a294197f855a3a72014a5672dc11e.url(options),
    method: 'delete',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
RedirectController879a294197f855a3a72014a5672dc11e.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: RedirectController879a294197f855a3a72014a5672dc11e.url(options),
    method: 'options',
})

    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
    const RedirectController879a294197f855a3a72014a5672dc11eForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: RedirectController879a294197f855a3a72014a5672dc11e.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
        RedirectController879a294197f855a3a72014a5672dc11eForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController879a294197f855a3a72014a5672dc11e.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
        RedirectController879a294197f855a3a72014a5672dc11eForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController879a294197f855a3a72014a5672dc11e.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
        RedirectController879a294197f855a3a72014a5672dc11eForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController879a294197f855a3a72014a5672dc11e.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
        RedirectController879a294197f855a3a72014a5672dc11eForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController879a294197f855a3a72014a5672dc11e.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
        RedirectController879a294197f855a3a72014a5672dc11eForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController879a294197f855a3a72014a5672dc11e.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
        RedirectController879a294197f855a3a72014a5672dc11eForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController879a294197f855a3a72014a5672dc11e.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route 'https://enotulen.irvan.cloud/settings'
 */
        RedirectController879a294197f855a3a72014a5672dc11eForm.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController879a294197f855a3a72014a5672dc11e.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'OPTIONS',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    RedirectController879a294197f855a3a72014a5672dc11e.form = RedirectController879a294197f855a3a72014a5672dc11eForm

/**
* Multiple routes resolve to \Illuminate\Routing\RedirectController::RedirectController, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `RedirectController['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
const RedirectController = {
    'https://enotulen.irvan.cloud': RedirectController0241be9f84ad24d14efd5cad31f38c02,
    'https://enotulen.irvan.cloud/settings': RedirectController879a294197f855a3a72014a5672dc11e,
}

export default RedirectController