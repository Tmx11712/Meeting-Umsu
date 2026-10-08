<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | [EDUKASI ARSITEKTUR: ENVIRONMENT CONFIGURATION]
    | File ini mengatur kredensial (API Key, Secret) untuk layanan pihak ketiga.
    | Sangat penting untuk MENGAMBIL nilainya dari file `.env` menggunakan fungsi `env()`.
    | JANGAN PERNAH menuliskan API Key langsung di file ini, agar rahasia tidak bocor ke Git/GitHub.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'absensi' => [
        'url' => env('ABSENSI_API_URL'),
        'key' => env('ABSENSI_API_KEY'),
        'secret' => env('ABSENSI_SECRET_KEY'),
    ],

    'openai' => [
        'key' => env('OPENAI_API_KEY'),
        'transcribe_model' => env('OPENAI_TRANSCRIBE_MODEL', 'whisper-1'),
        'summary_model' => env('OPENAI_SUMMARY_MODEL', 'gpt-4o-mini'),
        'transcription_concurrent_enabled' => env('TRANSCRIPTION_CONCURRENT_ENABLED', true),
        'transcription_concurrent_threshold' => env('TRANSCRIPTION_CONCURRENT_THRESHOLD', 1200),
        'transcription_chunk_duration' => env('TRANSCRIPTION_CHUNK_DURATION', 900),
        'transcription_chunk_overlap' => env('TRANSCRIPTION_CHUNK_OVERLAP', 15),
    ],

];
