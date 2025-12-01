<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laporan Absensi Profesional</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10pt; color: #333; }
        
        /* Header / Kop Surat */
        .header-table { width: 100%; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; }
        .company-name { font-size: 18pt; font-weight: bold; color: #2563eb; text-transform: uppercase; margin: 0; }
        .company-address { font-size: 9pt; color: #666; margin: 2px 0; }
        .report-title { font-size: 14pt; font-weight: bold; text-align: right; text-transform: uppercase; color: #444; }
        .meta-info { font-size: 9pt; text-align: right; color: #666; }

        /* Summary Boxes */
        .summary-table { width: 100%; margin-bottom: 20px; border-spacing: 0; border-collapse: separate; }
        .summary-box { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 5px; text-align: center; }
        .summary-value { font-size: 16pt; font-weight: bold; color: #1e293b; display: block; margin-bottom: 4px; }
        .summary-label { font-size: 8pt; text-transform: uppercase; color: #64748b; letter-spacing: 1px; }
        .text-green { color: #16a34a; }
        .text-red { color: #dc2626; }

        /* Data Table */
        .data-table { width: 100%; border-collapse: collapse; font-size: 9pt; }
        .data-table th { background-color: #1e293b; color: white; padding: 8px; text-align: left; text-transform: uppercase; font-size: 8pt; letter-spacing: 0.5px; }
        .data-table td { border-bottom: 1px solid #e2e8f0; padding: 8px; vertical-align: middle; }
        .data-table tr:nth-child(even) { background-color: #f8fafc; }

        /* Badges */
        .badge { padding: 3px 8px; border-radius: 10px; font-size: 8px; font-weight: bold; text-transform: uppercase; }
        .badge-late { background-color: #fee2e2; color: #991b1b; }
        .badge-ontime { background-color: #dcfce7; color: #166534; }

        /* Footer */
        .footer { margin-top: 30px; font-size: 8pt; text-align: center; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
    </style>
</head>
<body>

    <table class="header-table">
        <tr>
            <td width="60%" valign="top">
                <h1 class="company-name">PT. Filltech Berkah Bersama</h1>
                <p class="company-address">Jl. Teknologi No. 123, Batam Centre, Kepulauan Riau</p>
                <p class="company-address">Email: support@filltech.com | Telp: (0778) 123456</p>
            </td>
            <td width="40%" valign="top" align="right">
                <div class="report-title">Laporan Absensi</div>
                <div class="meta-info">
                    Filter: {{ $filterInfo }}<br>
                    Dicetak: {{ $date }}<br>
                    Oleh: {{ auth()->user()->name }}
                </div>
            </td>
        </tr>
    </table>

    <table class="summary-table" cellpadding="5">
        <tr>
            <td width="33%">
                <div class="summary-box">
                    <span class="summary-value">{{ $summary['total'] }}</span>
                    <span class="summary-label">Total Kehadiran</span>
                </div>
            </td>
            <td width="33%">
                <div class="summary-box">
                    <span class="summary-value text-green">{{ $summary['on_time'] }}</span>
                    <span class="summary-label">Tepat Waktu</span>
                </div>
            </td>
            <td width="33%">
                <div class="summary-box">
                    <span class="summary-value text-red">{{ $summary['late'] }}</span>
                    <span class="summary-label">Terlambat</span>
                </div>
            </td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="25%">Nama Teknisi</th>
                <th width="20%">Tanggal</th>
                <th width="15%">Jam Masuk</th>
                <th width="15%">Jam Pulang</th>
                <th width="20%">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($data as $index => $row)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>
                    <strong>{{ $row->technician->name ?? '-' }}</strong><br>
                    <span style="font-size: 8px; color: #666;">ID: {{ $row->technician->id_unik ?? 'N/A' }}</span>
                </td>
                <td>{{ $row->clock_in->timezone('Asia/Jakarta')->translatedFormat('l, d F Y') }}</td>
                <td style="font-family: monospace;">
                    {{ $row->clock_in->timezone('Asia/Jakarta')->format('H:i:s') }}
                </td>
                <td style="font-family: monospace;">
                    {{ $row->clock_out ? $row->clock_out->timezone('Asia/Jakarta')->format('H:i:s') : '-' }}
                </td>
                <td>
                    @if($row->is_late)
                        <span class="badge badge-late">TERLAMBAT</span>
                    @else
                        <span class="badge badge-ontime">TEPAT WAKTU</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="6" align="center" style="padding: 20px; color: #999;">
                    Tidak ada data absensi pada periode ini.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Dokumen ini digenerate otomatis oleh sistem Filltech App pada {{ $date }}.<br>
        PT. Filltech Berkah Bersama &copy; {{ date('Y') }}
    </div>

</body>
</html>