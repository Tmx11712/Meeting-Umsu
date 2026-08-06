<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Notulen - {{ $meeting->title }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; line-height: 1.5; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; }
        .header p { margin: 5px 0 0; color: #666; }
        .info-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
        .info-table th { text-align: left; width: 150px; padding: 5px; vertical-align: top; }
        .info-table td { padding: 5px; vertical-align: top; }
        .section-title { font-size: 14px; font-weight: bold; background-color: #f3f4f6; padding: 5px; margin-top: 20px; border-left: 3px solid #2563eb; }
        .content-block { margin-top: 10px; }
        .content-block p { margin-bottom: 10px; text-align: justify; }
        .action-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .action-table th, .action-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .action-table th { background-color: #f8fafc; }
        .footer { position: fixed; bottom: -30px; left: 0px; right: 0px; height: 50px; text-align: center; line-height: 35px; font-size: 10px; color: #999; border-top: 1px solid #ddd; }
        .page-break { page-break-after: always; }
        .ttd-box { width: 200px; float: right; text-align: center; margin-top: 50px; }
        .ttd-space { height: 80px; }
        .markdown-content table { width: 100%; border-collapse: collapse; margin-top: 5px; margin-bottom: 5px; }
        .markdown-content th, .markdown-content td { border: 1px solid #ccc; padding: 5px; text-align: left; }
        .markdown-content th { background-color: #f0f0f0; }
        .markdown-content ul, .markdown-content ol { margin-top: 5px; margin-bottom: 5px; padding-left: 20px; }
    </style>
</head>
<body>
    <div class="footer">
        Dicetak oleh Sistem e-Notulen pada {{ now()->translatedFormat('d F Y H:i') }}
    </div>

    <div class="header">
        <h1>NOTULEN RAPAT</h1>
        <p>{{ strtoupper($meeting->title) }}</p>
    </div>

    <div class="section-title">I. INFORMASI RAPAT</div>
    <table class="info-table">
        <tr>
            <th>Tanggal</th>
            <td>: {{ \Carbon\Carbon::parse($meeting->date)->translatedFormat('l, d F Y') }}</td>
        </tr>
        <tr>
            <th>Waktu</th>
            <td>: {{ substr($meeting->start_time, 0, 5) }} - {{ $meeting->end_time ? substr($meeting->end_time, 0, 5) : 'Selesai' }} WIB</td>
        </tr>
        <tr>
            <th>Tempat</th>
            <td>: {{ $meeting->location ?? '-' }}</td>
        </tr>
        <tr>
            <th>Penyelenggara</th>
            <td>: Bagian Umum / Pimpinan</td>
        </tr>
    </table>

    @php
        $minute = $meeting->minutes->first();
        $content = $minute ? $minute->content : null;
    @endphp

    @if($content)
        @if(!empty($content['peserta_rapat']) && is_array($content['peserta_rapat']))
            <div class="section-title">II. PESERTA RAPAT</div>
            <div class="content-block">
                <ul>
                @foreach($content['peserta_rapat'] as $peserta)
                    <li>{{ $peserta }}</li>
                @endforeach
                </ul>
            </div>
        @endif

        @if(!empty($content['latar_belakang']))
            <div class="section-title">III. LATAR BELAKANG</div>
            <div class="content-block">
                <p>{{ $content['latar_belakang'] }}</p>
            </div>
        @elseif(!empty($content['pembukaan']))
            <div class="section-title">III. PEMBUKAAN</div>
            <div class="content-block">
                <p>{{ $content['pembukaan'] }}</p>
            </div>
        @endif

        @if(!empty($content['pembahasan']) && is_array($content['pembahasan']))
            <div class="section-title">IV. PEMBAHASAN</div>
            <div class="content-block">
                <ol>
                @foreach($content['pembahasan'] as $bahas)
                    <li>
                        <strong>{{ $bahas['topik'] ?? 'Topik' }}</strong><br>
                        <p>{{ $bahas['narasi'] ?? '' }}</p>
                        @if(!empty($bahas['tabel']))
                            <div class="markdown-content">{!! \Illuminate\Support\Str::markdown($bahas['tabel']) !!}</div>
                        @endif
                        @if(!empty($bahas['list']))
                            <div class="markdown-content">{!! \Illuminate\Support\Str::markdown($bahas['list']) !!}</div>
                        @endif
                        <br>
                    </li>
                @endforeach
                </ol>
            </div>
        @endif

        @if(!empty($content['keputusan']) && is_array($content['keputusan']))
            <div class="section-title">V. KEPUTUSAN</div>
            <div class="content-block">
                <ul>
                @foreach($content['keputusan'] as $kep)
                    <li>{{ $kep }}</li>
                @endforeach
                </ul>
            </div>
        @endif
    @else
        <div class="section-title">II. HASIL RAPAT</div>
        <div class="content-block">
            <p><i>Konten notulen belum tersedia atau format tidak didukung.</i></p>
        </div>
    @endif

    <div class="section-title">VI. TINDAK LANJUT</div>
    @if($minute && $minute->actionItems->count() > 0)
        <table class="action-table">
            <thead>
                <tr>
                    <th width="5%">No</th>
                    <th width="45%">Uraian Tindak Lanjut</th>
                    <th width="25%">Penanggung Jawab (PIC)</th>
                    <th width="25%">Batas Waktu (Deadline)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($minute->actionItems as $idx => $item)
                    <tr>
                        <td>{{ $idx + 1 }}</td>
                        <td>{{ $item->description }}</td>
                        <td>{{ $item->pic }}</td>
                        <td>{{ $item->deadline ? \Carbon\Carbon::parse($item->deadline)->translatedFormat('d F Y') : '-' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div class="content-block">
            <p><i>Tidak ada tindak lanjut.</i></p>
        </div>
    @endif

    <br><br>
    
    <div class="ttd-box">
        <p>Mengetahui/Menyetujui,<br><strong>PIMPINAN RAPAT</strong></p>
        <div class="ttd-space"></div>
        <p><strong>( ______________________ )</strong></p>
    </div>

</body>
</html>
