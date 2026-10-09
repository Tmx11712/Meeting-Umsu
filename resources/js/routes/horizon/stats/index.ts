import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \Laravel\Horizon\Http\Controllers\DashboardStatsController::index
 * @see vendor/laravel/horizon/src/Http/Controllers/DashboardStatsController.php:18
 * @route 'http://100.107.175.84/horizon/api/stats'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/horizon/api/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Horizon\Http\Controllers\DashboardStatsController::index
 * @see vendor/laravel/horizon/src/Http/Controllers/DashboardStatsController.php:18
 * @route 'http://100.107.175.84/horizon/api/stats'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \Laravel\Horizon\Http\Controllers\DashboardStatsController::index
 * @see vendor/laravel/horizon/src/Http/Controllers/DashboardStatsController.php:18
 * @route 'http://100.107.175.84/horizon/api/stats'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \Laravel\Horizon\Http\Controllers\DashboardStatsController::index
 * @see vendor/laravel/horizon/src/Http/Controllers/DashboardStatsController.php:18
 * @route 'http://100.107.175.84/horizon/api/stats'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const stats = {
    index: Object.assign(index, index),
}

export default stats