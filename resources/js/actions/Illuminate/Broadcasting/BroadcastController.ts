import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \Illuminate\Broadcasting\BroadcastController::authenticate
 * @see vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastController.php:18
 * @route 'http://100.107.175.84/broadcasting/auth'
 */
export const authenticate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: authenticate.url(options),
    method: 'get',
})

authenticate.definition = {
    methods: ["get","post","head"],
    url: 'http://100.107.175.84/broadcasting/auth',
} satisfies RouteDefinition<["get","post","head"]>

/**
* @see \Illuminate\Broadcasting\BroadcastController::authenticate
 * @see vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastController.php:18
 * @route 'http://100.107.175.84/broadcasting/auth'
 */
authenticate.url = (options?: RouteQueryOptions) => {
    return authenticate.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Broadcasting\BroadcastController::authenticate
 * @see vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastController.php:18
 * @route 'http://100.107.175.84/broadcasting/auth'
 */
authenticate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: authenticate.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Broadcasting\BroadcastController::authenticate
 * @see vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastController.php:18
 * @route 'http://100.107.175.84/broadcasting/auth'
 */
authenticate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: authenticate.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Broadcasting\BroadcastController::authenticate
 * @see vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastController.php:18
 * @route 'http://100.107.175.84/broadcasting/auth'
 */
authenticate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: authenticate.url(options),
    method: 'head',
})

    /**
* @see \Illuminate\Broadcasting\BroadcastController::authenticate
 * @see vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastController.php:18
 * @route 'http://100.107.175.84/broadcasting/auth'
 */
    const authenticateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: authenticate.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Broadcasting\BroadcastController::authenticate
 * @see vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastController.php:18
 * @route 'http://100.107.175.84/broadcasting/auth'
 */
        authenticateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: authenticate.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Broadcasting\BroadcastController::authenticate
 * @see vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastController.php:18
 * @route 'http://100.107.175.84/broadcasting/auth'
 */
        authenticateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: authenticate.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Broadcasting\BroadcastController::authenticate
 * @see vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastController.php:18
 * @route 'http://100.107.175.84/broadcasting/auth'
 */
        authenticateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: authenticate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    authenticate.form = authenticateForm
const BroadcastController = { authenticate }

export default BroadcastController