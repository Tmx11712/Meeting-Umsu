import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Resend\Laravel\Http\Controllers\WebhookController::webhook
 * @see vendor/resend/resend-laravel/src/Http/Controllers/WebhookController.php:45
 * @route 'http://100.107.175.84/resend/webhook'
 */
export const webhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})

webhook.definition = {
    methods: ["post"],
    url: 'http://100.107.175.84/resend/webhook',
} satisfies RouteDefinition<["post"]>

/**
* @see \Resend\Laravel\Http\Controllers\WebhookController::webhook
 * @see vendor/resend/resend-laravel/src/Http/Controllers/WebhookController.php:45
 * @route 'http://100.107.175.84/resend/webhook'
 */
webhook.url = (options?: RouteQueryOptions) => {
    return webhook.definition.url + queryParams(options)
}

/**
* @see \Resend\Laravel\Http\Controllers\WebhookController::webhook
 * @see vendor/resend/resend-laravel/src/Http/Controllers/WebhookController.php:45
 * @route 'http://100.107.175.84/resend/webhook'
 */
webhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})

    /**
* @see \Resend\Laravel\Http\Controllers\WebhookController::webhook
 * @see vendor/resend/resend-laravel/src/Http/Controllers/WebhookController.php:45
 * @route 'http://100.107.175.84/resend/webhook'
 */
    const webhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: webhook.url(options),
        method: 'post',
    })

            /**
* @see \Resend\Laravel\Http\Controllers\WebhookController::webhook
 * @see vendor/resend/resend-laravel/src/Http/Controllers/WebhookController.php:45
 * @route 'http://100.107.175.84/resend/webhook'
 */
        webhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: webhook.url(options),
            method: 'post',
        })
    
    webhook.form = webhookForm
const resend = {
    webhook: Object.assign(webhook, webhook),
}

export default resend