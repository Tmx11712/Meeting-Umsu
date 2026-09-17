<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Rekap Notulen</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; line-height: 1.5; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; }
        .header p { margin: 5px 0 0; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f8fafc; font-weight: bold; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .footer { position: fixed; bottom: -30px; left: 0px; right: 0px; height: 50px; text-align: center; line-height: 35px; font-size: 10px; color: #999; border-top: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="footer">
        Dicetak oleh Sistem e-Notulen pada {{ now()->translatedFormat('d F Y H:i') }}
    </div>

    <div class="header">
        <h1>LAPORAN REKAP NOTULEN</h1>
        @if($request->start_date && $request->end_date)
            <p>Periode: {{ \Carbon\Carbon::parse($request->start_date)->translatedFormat('d M Y') }} - {{ \Carbon\Carbon::parse($request->end_date)->translatedFormat('d M Y') }}</p>
        @else
            <p>Semua Waktu</p>
        @endif
        @if($request->search)
            <p>Pencarian: "{{ $request->search }}"</p>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="20%">Tanggal</th>
                <th width="35%">Judul Rapat</th>
                <th width="25%">Ruangan</th>
                <th width="15%" class="text-center">Kehadiran</th>
            </tr>
        </thead>
        <tbody>
            @forelse($meetings as $index => $meeting)
                @php
                    $percentage = 0;
                    if ($meeting->participants && $meeting->participants->count() > 0) {
                        $hadir = $meeting->attendances ? $meeting->attendances->filter(function($a) {
                            return in_array($a->status, ['hadir', 'terlambat']);
                        })->count() : 0;
                        $percentage = round(($hadir / $meeting->participants->count()) * 100);
                    }
                @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($meeting->date)->translatedFormat('d F Y') }}</td>
                    <td>{{ $meeting->title }}</td>
                    <td>{{ $meeting->location ?? '-' }}</td>
                    <td class="text-center">{{ $percentage }}%</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center">Tidak ada data rapat yang sesuai dengan kriteria pencarian.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

</body>
</html>
