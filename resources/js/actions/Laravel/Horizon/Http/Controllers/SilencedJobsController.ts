import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \Laravel\Horizon\Http\Controllers\SilencedJobsController::index
 * @see vendor/laravel/horizon/src/Http/Controllers/SilencedJobsController.php:36
 * @route 'http://100.107.175.84/horizon/api/jobs/silenced'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/horizon/api/jobs/silenced',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Horizon\Http\Controllers\SilencedJobsController::index
 * @see vendor/laravel/horizon/src/Http/Controllers/SilencedJobsController.php:36
 * @route 'http://100.107.175.84/horizon/api/jobs/silenced'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \Laravel\Horizon\Http\Controllers\SilencedJobsController::index
 * @see vendor/laravel/horizon/src/Http/Controllers/SilencedJobsController.php:36
 * @route 'http://100.107.175.84/horizon/api/jobs/silenced'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \Laravel\Horizon\Http\Controllers\SilencedJobsController::index
 * @see vendor/laravel/horizon/src/Http/Controllers/SilencedJobsController.php:36
 * @route 'http://100.107.175.84/horizon/api/jobs/silenced'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const SilencedJobsController = { index }

export default SilencedJobsController