<?php

namespace App\Exports;

use App\Models\Payment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Carbon\Carbon;

class FinancialReportExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles, WithEvents, WithColumnFormatting, WithCustomStartCell
{
    protected $filters;
    protected $totalAmount = 0; // Properti untuk menyimpan total hitungan PHP

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    /**
     * Data mulai ditulis dari sel A5 (memberikan ruang untuk header perusahaan)
     */
    public function startCell(): string
    {
        return 'A5';
    }

    public function collection()
    {
        $query = Payment::with(['invoice.user'])->where('status', 'verified');

        if (!empty($this->filters['start_date'])) {
            $query->whereDate('created_at', '>=', $this->filters['start_date']);
        }
        if (!empty($this->filters['end_date'])) {
            $query->whereDate('created_at', '<=', $this->filters['end_date']);
        }
        if (!empty($this->filters['rt'])) {
            $query->whereHas('invoice.user', function ($q) {
                $q->where('rt', $this->filters['rt']);
            });
        }
        if (!empty($this->filters['rw'])) {
            $query->whereHas('invoice.user', function ($q) {
                $q->where('rw', $this->filters['rw']);
            });
        }

        $results = $query->latest()->get();
        
        // Hitung total revenue langsung di PHP sebagai backup
        $this->totalAmount = $results->sum('amount');

        return $results;
    }

    public function map($payment): array
    {
        $user = $payment->invoice->user ?? null;

        return [
            $payment->created_at->translatedFormat('d F Y H:i'),
            $payment->invoice->invoice_number ?? '-',
            $user ? $user->name : 'User Terhapus',
            $user ? $user->rt : '-',
            $user ? $user->rw : '-',
            ucfirst($payment->invoice->type ?? '-'),
            (float) $payment->amount, // Nilai numerik murni untuk kolom G
            'LUNAS',
        ];
    }

    public function headings(): array
    {
        return [
            'TANGGAL BAYAR',
            'ID TRANSAKSI',
            'NAMA KLIEN',
            'RT',
            'RW',
            'KETERANGAN',
            'NOMINAL (Rp)',
            'STATUS',
        ];
    }

    public function columnFormats(): array
    {
        return [
            'G' => '#,##0', 
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Baris header tabel (baris 5) dibuat Bold
            5 => ['font' => ['bold' => true]],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastRow = $sheet->getHighestRow();
                $totalRow = $lastRow + 1;

                // --- A. HEADER PERUSAHAAN (Row 1-3) ---
                // Nama Perusahaan
                $sheet->mergeCells('A1:H1');
                $sheet->setCellValue('A1', 'FILLTECH BERKAH BERSAMA');
                $sheet->getStyle('A1')->applyFromArray([
                    'font' => ['bold' => true, 'size' => 20, 'color' => ['argb' => 'FF1E3A8A']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);

                // Judul Laporan
                $sheet->mergeCells('A2:H2');
                $sheet->setCellValue('A2', 'LAPORAN REKAPITULASI KEUANGAN PENDAPATAN');
                $sheet->getStyle('A2')->applyFromArray([
                    'font' => ['bold' => true, 'size' => 14],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);

                // Periode
                $startDate = !empty($this->filters['start_date']) ? Carbon::parse($this->filters['start_date'])->format('d/m/Y') : '-';
                $endDate = !empty($this->filters['end_date']) ? Carbon::parse($this->filters['end_date'])->format('d/m/Y') : Carbon::now()->format('d/m/Y');
                
                $sheet->mergeCells('A3:H3');
                $sheet->setCellValue('A3', "Periode: $startDate s/d $endDate");
                $sheet->getStyle('A3')->applyFromArray([
                    'font' => ['italic' => true, 'size' => 11, 'color' => ['argb' => 'FF4B5563']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);

                // Atur tinggi baris header agar proporsional
                $sheet->getRowDimension(1)->setRowHeight(35);
                $sheet->getRowDimension(2)->setRowHeight(25);

                // --- B. STYLING TABLE HEAD (Row 5) ---
                $sheet->getStyle('A5:H5')->applyFromArray([
                    'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID, 
                        'startColor' => ['argb' => 'FF4F46E5'] // Indigo Blue
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER, 
                        'vertical' => Alignment::VERTICAL_CENTER
                    ],
                    'borders' => [
                        'allBorders' => ['borderStyle' => Border::BORDER_THIN]
                    ],
                ]);
                $sheet->getRowDimension(5)->setRowHeight(30);

                // --- C. DATA BORDERS & ALIGNMENT (Row 6 - LastRow) ---
                if ($lastRow >= 6) {
                    $sheet->getStyle('A6:H' . $lastRow)->applyFromArray([
                        'borders' => [
                            'allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FFD1D5DB']]
                        ],
                        'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
                    ]);
                    
                    // Center align untuk kolom metadata
                    $sheet->getStyle('A6:A' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                    $sheet->getStyle('D6:E' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                    $sheet->getStyle('H6:H' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

                    // --- D. GRAND TOTAL ---
                    $sheet->mergeCells('A' . $totalRow . ':F' . $totalRow);
                    $sheet->setCellValue('A' . $totalRow, 'GRAND TOTAL PEMASUKAN');
                    
                    // Masukkan nilai total hitungan PHP secara eksplisit sebagai data awal
                    $sheet->setCellValue('G' . $totalRow, $this->totalAmount);
                    
                    // Masukkan rumus SUM Excel sebagai formula aktif
                    $sheet->getStyle('G' . $totalRow)->getFont()->setBold(true);
                    $sheet->setCellValue('G' . $totalRow, "=SUM(G6:G$lastRow)");

                    // Styling Baris Total
                    $sheet->getStyle('A' . $totalRow . ':H' . $totalRow)->applyFromArray([
                        'font' => ['bold' => true, 'size' => 12],
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID, 
                            'startColor' => ['argb' => 'FFFEF08A'] // Yellow Highlight
                        ],
                        'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
                        'borders' => [
                            'outline' => ['borderStyle' => Border::BORDER_THICK],
                            'allBorders' => ['borderStyle' => Border::BORDER_THIN]
                        ],
                    ]);
                    
                    $sheet->getStyle('A' . $totalRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
                    $sheet->getStyle('G' . $totalRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
                    $sheet->setCellValue('H' . $totalRow, '-');

                    // Format Rupiah untuk seluruh kolom G (termasuk total)
                    $sheet->getStyle('G6:G' . $totalRow)->getNumberFormat()
                        ->setFormatCode('_("Rp"* #,##0_);_("Rp"* (#,##0);_("Rp"* "-"_);_(@_)');
                }
                
                // Beri sedikit ruang kosong di bawah tabel
                $sheet->getRowDimension($totalRow)->setRowHeight(30);
            },
        ];
    }
}