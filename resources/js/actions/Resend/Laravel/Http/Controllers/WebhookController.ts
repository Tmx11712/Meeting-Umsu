import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \Resend\Laravel\Http\Controllers\WebhookController::handleWebhook
 * @see vendor/resend/resend-laravel/src/Http/Controllers/WebhookController.php:45
 * @route 'https://enotulen.irvan.cloud/resend/webhook'
 */
export const handleWebhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleWebhook.url(options),
    method: 'post',
})

handleWebhook.definition = {
    methods: ["post"],
    url: 'https://enotulen.irvan.cloud/resend/webhook',
} satisfies RouteDefinition<["post"]>

/**
* @see \Resend\Laravel\Http\Controllers\WebhookController::handleWebhook
 * @see vendor/resend/resend-laravel/src/Http/Controllers/WebhookController.php:45
 * @route 'https://enotulen.irvan.cloud/resend/webhook'
 */
handleWebhook.url = (options?: RouteQueryOptions) => {
    return handleWebhook.definition.url + queryParams(options)
}

/**
* @see \Resend\Laravel\Http\Controllers\WebhookController::handleWebhook
 * @see vendor/resend/resend-laravel/src/Http/Controllers/WebhookController.php:45
 * @route 'https://enotulen.irvan.cloud/resend/webhook'
 */
handleWebhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleWebhook.url(options),
    method: 'post',
})

    /**
* @see \Resend\Laravel\Http\Controllers\WebhookController::handleWebhook
 * @see vendor/resend/resend-laravel/src/Http/Controllers/WebhookController.php:45
 * @route 'https://enotulen.irvan.cloud/resend/webhook'
 */
    const handleWebhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: handleWebhook.url(options),
        method: 'post',
    })

            /**
* @see \Resend\Laravel\Http\Controllers\WebhookController::handleWebhook
 * @see vendor/resend/resend-laravel/src/Http/Controllers/WebhookController.php:45
 * @route 'https://enotulen.irvan.cloud/resend/webhook'
 */
        handleWebhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: handleWebhook.url(options),
            method: 'post',
        })
    
    handleWebhook.form = handleWebhookForm
const WebhookController = { handleWebhook }

export default WebhookController
