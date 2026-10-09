import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationNotificationController.php:19
 * @route 'http://100.107.175.84/email/verification-notification'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/email/verification-notification',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationNotificationController.php:19
 * @route 'http://100.107.175.84/email/verification-notification'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationNotificationController.php:19
 * @route 'http://100.107.175.84/email/verification-notification'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const EmailVerificationNotificationController = { store }

export default EmailVerificationNotificationController