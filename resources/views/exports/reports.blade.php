<!DOCTYPE html>
<html>
<head>
    <title>Laporan Pendapatan Filltech</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        .header h1 { margin: 0; color: #2563eb; font-size: 20px; text-transform: uppercase; }
        .header p { margin: 5px 0 0; font-size: 14px; color: #666; }
        .meta { margin-bottom: 20px; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; vertical-align: middle; }
        th { background-color: #f8f9fa; font-weight: bold; color: #444; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .badge-monthly { background-color: #e0f2fe; color: #0369a1; }
        .badge-installation { background-color: #f0fdf4; color: #15803d; }
        .summary { margin-top: 30px; text-align: right; font-size: 14px; }
        .summary-table { width: 40%; margin-left: auto; }
        .summary-table td { border: none; padding: 5px; }
        .total-row { font-size: 16px; font-weight: bold; color: #2563eb; border-top: 2px solid #eee; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FILLTECH BERKAH BERSAMA</h1>
        <p>Laporan Pendapatan Keuangan</p>
    </div>

    <div class="meta">
        <table style="border: none; width: 100%;">
            <tr style="border: none;">
                <td style="border: none; padding: 2px; width: 15%;"><strong>Periode</strong></td>
                <td style="border: none; padding: 2px;">: {{ \Carbon\Carbon::parse($startDate)->translatedFormat('d F Y') }} - {{ \Carbon\Carbon::parse($endDate)->translatedFormat('d F Y') }}</td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; padding: 2px;"><strong>Dicetak Oleh</strong></td>
                <td style="border: none; padding: 2px;">: {{ auth()->user()->name }}</td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; padding: 2px;"><strong>Tanggal Cetak</strong></td>
                <td style="border: none; padding: 2px;">: {{ now()->timezone('Asia/Jakarta')->translatedFormat('d F Y, H:i') }} WIB</td>
            </tr>
        </table>
    </div>

    <table>
        <thead>
            <tr>
                <th class="text-center" width="5%">No</th>
                <th width="25%">No. Tagihan</th>
                <th width="25%">Waktu Pembayaran</th>
                <th width="20%">Keterangan</th>
                <th class="text-right" width="25%">Jumlah (IDR)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $index => $tx)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>
                    <strong>{{ $tx->invoice_number }}</strong>
                </td>
                <td>
                    {{ \Carbon\Carbon::parse($tx->paid_at)->timezone('Asia/Jakarta')->translatedFormat('d F Y') }}<br>
                    <small style="color: #666;">Pukul {{ \Carbon\Carbon::parse($tx->paid_at)->timezone('Asia/Jakarta')->format('H:i') }} WIB</small>
                </td>
                <td>
                    <span class="badge {{ $tx->type === 'installation' ? 'badge-installation' : 'badge-monthly' }}">
                        {{ ucfirst($tx->type ?? 'Bulanan') }}
                    </span>
                </td>
                <td class="text-right" style="font-family: monospace; font-size: 13px;">
                    Rp {{ number_format($tx->amount, 0, ',', '.') }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary">
        <table class="summary-table">
            <tr>
                <td>Total Transaksi</td>
                <td class="text-right">{{ $totalInvoices }}</td>
            </tr>
            <tr class="total-row">
                <td style="padding-top: 10px;">Total Pendapatan</td>
                <td class="text-right" style="padding-top: 10px;">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</td>
            </tr>
        </table>
    </div>
</body>
</html>