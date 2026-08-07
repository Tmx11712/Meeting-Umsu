<?php

use Illuminate\Support\Facades\Log;

if (! function_exists('safe_broadcast')) {
    /**
     * Broadcast an event safely, catching any exceptions (e.g., Reverb offline).
     *
     * @param  object  $event  The event instance to broadcast.
     * @param  bool  $toOthers  Whether to exclude the current user from receiving the broadcast.
     */
    function safe_broadcast(object $event, bool $toOthers = true): void
    {
        try {
            $pending = broadcast($event);

            if ($toOthers) {
                $pending->toOthers();
            }
            
            // Force __destruct to run inside the try-catch block
            // so we can actually catch the Reverb connection exception!
            unset($pending);
        } catch (\Exception $e) {
            Log::warning('Broadcast failed (Reverb offline): '.$e->getMessage());
        }
    }
}
