<?php

namespace App\Actions\IrvanCloud;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FetchEventDetailsFromApiAction
{
    /**
     * Fetch event details (including participants) from Irvan Cloud API.
     *
     * @param string $eventId
     * @return array|null Returns array of details or null if failed
     */
    public function execute(string $eventId): ?array
    {
        $apiUrl = rtrim(config('services.absensi.url'), '/');
        $apiKey = config('services.absensi.key');
        $secretKey = config('services.absensi.secret');

        $response = Http::withHeaders([
            'X-API-KEY' => $apiKey,
            'X-SECRET-KEY' => $secretKey,
        ])->get("{$apiUrl}/api/event/{$eventId}");

        if (! $response->successful()) {
            Log::warning("Failed to fetch details for event ID {$eventId}", [
                'status' => $response->status()
            ]);
            return null;
        }

        return $response->json();
    }
}
