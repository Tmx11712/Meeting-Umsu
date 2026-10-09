import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'https://enotulen.irvan.cloud/configuration'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/configuration',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'https://enotulen.irvan.cloud/configuration'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'https://enotulen.irvan.cloud/configuration'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'https://enotulen.irvan.cloud/configuration'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'https://enotulen.irvan.cloud/configuration'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'https://enotulen.irvan.cloud/configuration'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'https://enotulen.irvan.cloud/configuration'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::checkOpenAiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'https://enotulen.irvan.cloud/configuration/openai-status'
 */
export const checkOpenAiStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkOpenAiStatus.url(options),
    method: 'get',
})

checkOpenAiStatus.definition = {
    methods: ["get","head"],
    url: 'https://enotulen.irvan.cloud/configuration/openai-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::checkOpenAiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'https://enotulen.irvan.cloud/configuration/openai-status'
 */
checkOpenAiStatus.url = (options?: RouteQueryOptions) => {
    return checkOpenAiStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::checkOpenAiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'https://enotulen.irvan.cloud/configuration/openai-status'
 */
checkOpenAiStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkOpenAiStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::checkOpenAiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'https://enotulen.irvan.cloud/configuration/openai-status'
 */
checkOpenAiStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkOpenAiStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Configuration\ConfigurationController::checkOpenAiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'https://enotulen.irvan.cloud/configuration/openai-status'
 */
    const checkOpenAiStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkOpenAiStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Configuration\ConfigurationController::checkOpenAiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'https://enotulen.irvan.cloud/configuration/openai-status'
 */
        checkOpenAiStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkOpenAiStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Configuration\ConfigurationController::checkOpenAiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'https://enotulen.irvan.cloud/configuration/openai-status'
 */
        checkOpenAiStatusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkOpenAiStatus.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkOpenAiStatus.form = checkOpenAiStatusForm
const ConfigurationController = { index, checkOpenAiStatus }

export default ConfigurationController
