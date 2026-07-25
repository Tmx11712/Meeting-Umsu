<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AbsensiApiService
{
    protected $baseUrl;
    protected $apiKey;
    protected $secretKey;

    public function __construct()
    {
        $this->baseUrl = config('services.absensi.url', env('ABSENSI_API_URL'));
        $this->apiKey = config('services.absensi.key', env('ABSENSI_API_KEY'));
        $this->secretKey = config('services.absensi.secret', env('ABSENSI_SECRET_KEY'));
    }

    /**
     * Get schedules from the external Absensi API for a given date.
     * Currently returns Mock Data until real endpoint is provided.
     *
     * @param string $date (Y-m-d)
     * @return array
     */
    public function getSchedules($date)
    {
        // TODO: Replace with real HTTP call when endpoint is known.
        // return Http::withHeaders([
        //     'x-api-key' => $this->apiKey,
        //     'x-secret-key' => $this->secretKey,
        // ])->get($this->baseUrl . '/api/v1/meetings', ['date' => $date])->json();

        return $this->getMockSchedules($date);
    }

    private function getMockSchedules($date)
    {
        return [
            'status' => 'success',
            'data' => [
                [
                    'external_id' => 'EXT-1001',
                    'title' => 'Rapat Paripurna Bulanan',
                    'date' => $date,
                    'start_time' => '09:00',
                    'end_time' => '11:00',
                    'location' => 'Ruang Rapat Utama',
                    'type' => 'Rapat Direksi',
                    'description' => 'Membahas evaluasi kinerja bulanan dan target bulan depan.',
                ],
                [
                    'external_id' => 'EXT-1002',
                    'title' => 'Briefing Teknis IT',
                    'date' => $date,
                    'start_time' => '13:00',
                    'end_time' => '14:30',
                    'location' => 'Ruang Meeting IT',
                    'type' => 'Rapat Teknis',
                    'description' => 'Pembahasan arsitektur sistem baru.',
                ],
            ]
        ];
    }
}
