import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'http://100.107.175.84/configuration'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'http://100.107.175.84/configuration'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'http://100.107.175.84/configuration'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::index
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:25
 * @route 'http://100.107.175.84/configuration'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::checkOpenAiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'http://100.107.175.84/configuration/openai-status'
 */
export const checkOpenAiStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkOpenAiStatus.url(options),
    method: 'get',
})

checkOpenAiStatus.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/configuration/openai-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::checkOpenAiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'http://100.107.175.84/configuration/openai-status'
 */
checkOpenAiStatus.url = (options?: RouteQueryOptions) => {
    return checkOpenAiStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::checkOpenAiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'http://100.107.175.84/configuration/openai-status'
 */
checkOpenAiStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkOpenAiStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Configuration\ConfigurationController::checkOpenAiStatus
 * @see app/Http/Controllers/Configuration/ConfigurationController.php:45
 * @route 'http://100.107.175.84/configuration/openai-status'
 */
checkOpenAiStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkOpenAiStatus.url(options),
    method: 'head',
})
const ConfigurationController = { index, checkOpenAiStatus }

export default ConfigurationController