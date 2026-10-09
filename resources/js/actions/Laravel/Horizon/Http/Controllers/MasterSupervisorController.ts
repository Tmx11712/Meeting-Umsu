import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \Laravel\Horizon\Http\Controllers\MasterSupervisorController::index
 * @see vendor/laravel/horizon/src/Http/Controllers/MasterSupervisorController.php:18
 * @route 'http://100.107.175.84/horizon/api/masters'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: 'http://100.107.175.84/horizon/api/masters',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Horizon\Http\Controllers\MasterSupervisorController::index
 * @see vendor/laravel/horizon/src/Http/Controllers/MasterSupervisorController.php:18
 * @route 'http://100.107.175.84/horizon/api/masters'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \Laravel\Horizon\Http\Controllers\MasterSupervisorController::index
 * @see vendor/laravel/horizon/src/Http/Controllers/MasterSupervisorController.php:18
 * @route 'http://100.107.175.84/horizon/api/masters'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \Laravel\Horizon\Http\Controllers\MasterSupervisorController::index
 * @see vendor/laravel/horizon/src/Http/Controllers/MasterSupervisorController.php:18
 * @route 'http://100.107.175.84/horizon/api/masters'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const MasterSupervisorController = { index }

export default MasterSupervisorController