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

if (! function_exists('int_to_roman')) {
    /**
     * Konversi bilangan bulat positif ke angka Romawi untuk penomoran bab notulen PDF.
     */
    function int_to_roman(int $number): string
    {
        if ($number <= 0) {
            return '';
        }

        $map = [
            1000 => 'M',
            900 => 'CM',
            500 => 'D',
            400 => 'CD',
            100 => 'C',
            90 => 'XC',
            50 => 'L',
            40 => 'XL',
            10 => 'X',
            9 => 'IX',
            5 => 'V',
            4 => 'IV',
            1 => 'I',
        ];
        $result = '';
        foreach ($map as $value => $symbol) {
            while ($number >= $value) {
                $result .= $symbol;
                $number -= $value;
            }
        }

        return $result;
    }
}

if (! function_exists('sanitize_pdf_html')) {
    /**
     * Batasi HTML untuk DomPDF agar bebas atribut berbahaya seperti style/event handler.
     */
    function sanitize_pdf_html(?string $html): string
    {
        if ($html === null || $html === '') {
            return '';
        }

        $cleaned = (string) preg_replace('#<(script|style)\b[^>]*>.*?</\1>#is', '', $html);
        $allowedTags = '<ul><ol><li><table><thead><tbody><tr><th><td><strong><em><b><i><u><br><p><span>';
        $stripped = strip_tags($cleaned, $allowedTags);

        return (string) preg_replace_callback('/<(\w+)\b([^>]*)>/', function (array $matches): string {
            $tag = strtolower($matches[1]);
            $attrs = $matches[2];
            $keptAttrs = [];

            if (in_array($tag, ['th', 'td'], true)) {
                if (preg_match('/\bcolspan\s*=\s*["\']?(\d+)["\']?/i', $attrs, $m)) {
                    $keptAttrs[] = 'colspan="'.$m[1].'"';
                }
                if (preg_match('/\browspan\s*=\s*["\']?(\d+)["\']?/i', $attrs, $m)) {
                    $keptAttrs[] = 'rowspan="'.$m[1].'"';
                }
            }

            return empty($keptAttrs) ? "<{$tag}>" : "<{$tag} ".implode(' ', $keptAttrs).'>';
        }, $stripped);
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
