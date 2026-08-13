<?php

namespace App\Actions\IrvanCloud;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * [EDUKASI ARSITEKTUR: ISOLATION OF CONCERNS]
 * Action ini hanya bertugas mengambil data dari API Irvan Cloud.
 * Jika besok Irvan Cloud merubah struktur API-nya, kita HANYA perlu memperbaiki class ini.
 * Class SyncMeetingsAction (Sang Mandor) tidak akan menyadari adanya perubahan, karena ia hanya menerima output Array dari class ini.
 * Ini disebut "Loose Coupling" (Keterikatan Rendah) yang sangat disukai di rekayasa perangkat lunak.
 */
class FetchEventsFromApiAction
{
    /**
     * Fetch events from Irvan Cloud API within a date range.
     *
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
                'body' => $response->body(),
            ]);
            throw new \Exception('Gagal terhubung ke API Irvan Cloud. Status: '.$response->status());
        }

        $data = $response->json();

        return $data['data']['page_data'] ?? [];
    }
}
