import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \Laravel\Passkeys\Http\Controllers\PasskeyConfirmationController::index
 * @see vendor/laravel/passkeys/src/Http/Controllers/PasskeyConfirmationController.php:27
 * @route 'http://100.107.175.84/passkeys/confirm/options'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/passkeys/confirm/options',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Passkeys\Http\Controllers\PasskeyConfirmationController::index
 * @see vendor/laravel/passkeys/src/Http/Controllers/PasskeyConfirmationController.php:27
 * @route 'http://100.107.175.84/passkeys/confirm/options'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \Laravel\Passkeys\Http\Controllers\PasskeyConfirmationController::index
 * @see vendor/laravel/passkeys/src/Http/Controllers/PasskeyConfirmationController.php:27
 * @route 'http://100.107.175.84/passkeys/confirm/options'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \Laravel\Passkeys\Http\Controllers\PasskeyConfirmationController::index
 * @see vendor/laravel/passkeys/src/Http/Controllers/PasskeyConfirmationController.php:27
 * @route 'http://100.107.175.84/passkeys/confirm/options'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \Laravel\Passkeys\Http\Controllers\PasskeyConfirmationController::store
 * @see vendor/laravel/passkeys/src/Http/Controllers/PasskeyConfirmationController.php:50
 * @route 'http://100.107.175.84/passkeys/confirm'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/passkeys/confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Passkeys\Http\Controllers\PasskeyConfirmationController::store
 * @see vendor/laravel/passkeys/src/Http/Controllers/PasskeyConfirmationController.php:50
 * @route 'http://100.107.175.84/passkeys/confirm'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \Laravel\Passkeys\Http\Controllers\PasskeyConfirmationController::store
 * @see vendor/laravel/passkeys/src/Http/Controllers/PasskeyConfirmationController.php:50
 * @route 'http://100.107.175.84/passkeys/confirm'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const PasskeyConfirmationController = { index, store }

export default PasskeyConfirmationController