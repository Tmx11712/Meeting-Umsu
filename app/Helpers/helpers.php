<?php

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

if (! function_exists('sql_like_operator')) {
    /**
     * Gunakan operator LIKE yang case-insensitive di PostgreSQL (ilike) dan driver lain (like).
     */
    function sql_like_operator(): string
    {
        return DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
    }
}

if (! function_exists('sql_escape_like')) {
    /**
     * Escape karakter wildcard SQL LIKE agar pencarian teks aman dari wildcard injection.
     */
    function sql_escape_like(string $value): string
    {
        return addcslashes($value, '%_\\');
    }
}

if (! function_exists('parse_valid_date')) {
    /**
     * Validasi string tanggal berformat Y-m-d dengan aman sebelum dipakai query atau format PDF.
     */
    function parse_valid_date(?string $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $trimmed = trim($value);
        if (! preg_match('/^\d{4}-\d{2}-\d{2}$/', $trimmed)) {
            return null;
        }

        try {
            $parsed = CarbonImmutable::createFromFormat('!Y-m-d', $trimmed);

            return $parsed && $parsed->format('Y-m-d') === $trimmed ? $trimmed : null;
        } catch (Throwable) {
            return null;
        }
    }
}

if (! function_exists('safe_broadcast')) {
    /**
     * Broadcast an event safely, catching any exceptions (e.g., Reverb offline).
     *
     * @param  object  $event  The event instance to broadcast.
     * @param  bool  $toOthers  Whether to exclude the current user from receiving the broadcast.
     */
    function safe_broadcast(object $event, bool $toOthers = false): void
    {
        try {
            $pending = broadcast($event);

            if ($toOthers) {
                $pending->toOthers();
            }

            // Force __destruct to run inside the try-catch block
            // so we can actually catch the Reverb connection exception!
            unset($pending);
        } catch (Throwable $e) {
            Log::warning('Broadcast failed (Reverb offline): '.$e->getMessage());
        }
    }
}
