<?php

namespace App\Actions\IrvanCloud;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FetchEventsFromApiAction
{
    /**
     * Fetch events from Irvan Cloud API within a date range.
     *
     * @param string $startDate
     * @param string $endDate
     * @return array
     * @throws \Exception
     */
    public function execute(string $startDate, string $endDate): array
    {
        $apiUrl = rtrim(config('services.absensi.url'), '/');
        $apiKey = config('services.absensi.key');
        $secretKey = config('services.absensi.secret');

        $response = Http::withHeaders([
            'X-API-KEY' => $apiKey,
            'X-SECRET-KEY' => $secretKey,
        ])->get("{$apiUrl}/api/event", [
            'page' => 1,
            'page_size' => 100, // Fetch up to 100 events
            'start_date' => $startDate,
            'end_date' => $endDate,
            'sort' => 'DESC',
        ]);

        if (! $response->successful()) {
            Log::error('Failed to fetch from Irvan Cloud (Events)', [
                'status' => $response->status(), 
                'body' => $response->body()
            ]);
            throw new \Exception('Gagal terhubung ke API Irvan Cloud. Status: ' . $response->status());
        }

        $data = $response->json();
        return $data['data']['page_data'] ?? [];
    }
}
