<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $invoice->invoice_number }}</title>
    <style>
        @page {
            /* Margin atas ditambah untuk memberi ruang pada Kop Surat */
            margin: 4cm 2cm 2cm 2cm;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 14px;
            color: #333;
            line-height: 1.4;
        }
        
        /* --- KOP SURAT (HEADER) --- */
        header {
            position: fixed;
            top: -3.5cm; /* Naik ke atas margin */
            left: 0cm;
            right: 0cm;
            height: 3.5cm;
            border-bottom: 3px solid #2563eb; /* Garis biru tebal */
            text-align: center;
        }

        /* Container Logo (Absolut di kiri) */
        .logo-container {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 80px; /* Sesuaikan lebar area logo */
            height: 80px;
        }
        
        /* Ganti src dengan path logo Anda */
        .logo-img {
            width: 100%;
            height: auto;
            object-fit: contain;
        }

        /* Container Teks Tengah */
        .company-details {
            margin-left: 90px; /* Memberi jarak agar tidak menabrak logo jika logo lebar */
            margin-right: 90px; /* Penyeimbang kanan agar benar-benar tengah */
        }

        .company-name {
            font-size: 22px;
            font-weight: bold;
            color: #2563eb;
            text-transform: uppercase;
            margin-bottom: 5px;
            letter-spacing: 1px;
        }

        .company-address {
            font-size: 11px;
            color: #444;
            margin-bottom: 2px;
        }

        .company-phone {
            font-size: 11px;
            color: #444;
            font-weight: bold;
        }

        /* --- DETAIL INVOICE --- */
        .invoice-title-block {
            text-align: right;
            margin-top: 10px;
            margin-bottom: 20px;
        }
        .invoice-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            letter-spacing: 2px;
        }

        .info-table {
            width: 100%;
            margin-bottom: 30px;
            border-collapse: collapse;
        }
        .info-table td {
            vertical-align: top;
            padding: 2px 0;
        }
        .client-label { font-weight: bold; font-size: 12px; color: #2563eb; margin-bottom: 5px; display: block; }
        
        /* --- TABEL ITEM --- */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .items-table th {
            background-color: #f3f4f6;
            color: #333;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 11px;
            padding: 10px;
            text-align: left;
            border-bottom: 2px solid #ccc;
        }
        .items-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
            font-size: 13px;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }

        /* --- TOTAL --- */
        .total-table {
            width: 45%;
            float: right;
            border-collapse: collapse;
        }
        .total-table td {
            padding: 5px 0;
            font-size: 13px;
        }
        .final-total {
            font-size: 16px;
            font-weight: bold;
            color: #2563eb;
            border-top: 2px solid #eee;
            padding-top: 10px;
        }

        /* Badge Status */
        .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            border: 1px solid #ddd;
        }
        .status-paid { background-color: #dcfce7; color: #166534; border-color: #bbf7d0; }
        .status-unpaid { background-color: #fee2e2; color: #991b1b; border-color: #fecaca; }

        /* Footer */
        footer {
            position: fixed;
            bottom: -1cm;
            left: 0cm;
            right: 0cm;
            height: 1cm;
            text-align: center;
            font-size: 10px;
            color: #888;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <header>
        <div class="logo-container">
            <img src="{{ public_path('logo.png') }}" class="logo-img" alt="Logo"
        </div>

        <div class="company-details">
            <div class="company-name">PT. FILLTECH BERKAH BERSAMA</div>
            <div class="company-address">
                PJB III, BLOK AX 28, Sagulung Kota, Kec. Sagulung,<br>
                Kota Batam, Kepulauan Riau 29425
            </div>
            <div class="company-phone">
                Telepon: 0853-8487-7288
            </div>
        </div>
    </header>

    <footer>
        Invoice ini sah dan diproses secara komputerisasi. Terima kasih atas kepercayaan Anda.
    </footer>

    <div class="content">
        
        <div class="invoice-title-block">
            <div class="invoice-title">INVOICE</div>
            <div>#{{ $invoice->invoice_number }}</div>
        </div>

        <table class="info-table">
            <tr>
                <td width="55%">
                    <span class="client-label">DITAGIHKAN KEPADA:</span>
                    <strong>{{ $invoice->user->name ?? 'Pelanggan' }}</strong><br>
                    {{ $invoice->user->email ?? '-' }}<br>
                    {{ $invoice->user->phone_number ?? $invoice->user->phone ?? '-' }}<br>
                    <div style="margin-top: 5px; color: #555; font-size: 12px; max-width: 250px;">
                        {{ $invoice->user->alamat ?? 'Alamat belum dilengkapi.' }}
                    </div>
                </td>
                <td width="45%" class="text-right">
                    <table style="width: 100%; float: right;">
                        <tr>
                            <td>Tanggal:</td>
                            <td><strong>{{ \Carbon\Carbon::parse($invoice->created_at)->format('d/m/Y') }}</strong></td>
                        </tr>
                        <tr>
                            <td>Jatuh Tempo:</td>
                            <td><strong>{{ $invoice->due_date ? \Carbon\Carbon::parse($invoice->due_date)->format('d/m/Y') : '-' }}</strong></td>
                        </tr>
                        <tr>
                            <td>Status:</td>
                            <td>
                                <span class="status-badge {{ $invoice->status == 'paid' ? 'status-paid' : 'status-unpaid' }}">
                                    {{ $invoice->status == 'paid' ? 'LUNAS' : 'BELUM DIBAYAR' }}
                                </span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th width="5%" class="text-center">No</th>
                    <th width="60%">Deskripsi</th>
                    <th width="35%" class="text-right">Total (IDR)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="text-center">1</td>
                    <td>
                        <strong>Tagihan {{ ucfirst($invoice->type) }}</strong>
                        @if($invoice->subscription && $invoice->subscription->package)
                            <br>
                            <span style="color: #666; font-size: 11px;">
                                Paket: {{ $invoice->subscription->package->name }}
                                ({{ number_format((float)$invoice->subscription->package->speed, 0) }} Mbps)
                            </span>
                        @endif
                        
                        @if($invoice->description)
                            <br>
                            <span style="color: #666; font-size: 11px; font-style: italic;">
                                Note: {{ $invoice->description }}
                            </span>
                        @endif
                    </td>
                    <td class="text-right">
                        Rp {{ number_format((float)$invoice->amount, 0, ',', '.') }}
                    </td>
                </tr>
            </tbody>
        </table>

        <table class="total-table">
            <tr>
                <td class="text-right">Subtotal</td>
                <td class="text-right" width="40%">Rp {{ number_format((float)$invoice->amount, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td class="text-right">Pajak (0%)</td>
                <td class="text-right">Rp 0</td>
            </tr>
            <tr>
                <td class="text-right final-total">TOTAL</td>
                <td class="text-right final-total">Rp {{ number_format((float)$invoice->amount, 0, ',', '.') }}</td>
            </tr>
        </table>

        <div style="clear: both;"></div>

        <div style="margin-top: 40px; font-size: 12px; color: #444; border: 1px dashed #ccc; padding: 15px; border-radius: 5px; width: 60%;">
            <strong>Instruksi Pembayaran:</strong><br>
            Silakan transfer ke rekening berikut:<br>
            <ul style="margin: 5px 0 5px 15px; padding: 0;">
                <li>BCA: 123-456-7890 (PT. Filltech Berkah Bersama)</li>
                <li>Mandiri: 987-654-3210 (PT. Filltech Berkah Bersama)</li>
            </ul>
            <i style="font-size: 11px;">*Mohon sertakan No. Invoice pada berita transfer.</i>
        </div>

    </div>
</body>
</html>