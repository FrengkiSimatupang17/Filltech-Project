<?php

namespace App\Exports;

use App\Models\Attendance;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Carbon\Carbon;

class AttendanceExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths, WithEvents
{
    protected $startDate;
    protected $endDate;
    protected $userId;

    public function __construct($startDate, $endDate, $userId)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->userId = $userId;
    }

    public function collection()
    {
        $query = Attendance::with('user')
            ->orderBy('date', 'desc')
            ->orderBy('clock_in', 'asc');

        if ($this->startDate) {
            $query->whereDate('date', '>=', $this->startDate);
        }
        if ($this->endDate) {
            $query->whereDate('date', '<=', $this->endDate);
        }
        if ($this->userId) {
            $query->where('user_id', $this->userId);
        }

        return $query->get();
    }

    /**
     * Header Excel
     */
    public function headings(): array
    {
        return [
            ['PT. FILLTECH BERKAH BERSAMA'], // Baris 1: Nama Perusahaan
            ['PJB III, BLOK AX 28, Sagulung Kota, Kec. Sagulung, Kota Batam, Kepulauan Riau 29425'], // Baris 2: Alamat
            [''], // Baris 3: Spasi Kosong
            [     // Baris 4: Header Tabel
                'TANGGAL',
                'NAMA TEKNISI',
                'EMAIL',
                'JAM MASUK',
                'LOKASI MASUK',
                'JAM KELUAR',
                'LOKASI PULANG',
                'DURASI KERJA',
                'STATUS',
                'TELAT', // Diubah dari 'TELAT (M)' karena formatnya sekarang Jam & Menit
                'MAPS',
            ]
        ];
    }

    /**
     * Atur Lebar Kolom Manual
     */
    public function columnWidths(): array
    {
        return [
            'A' => 20, // Tanggal
            'B' => 25, // Nama
            'C' => 25, // Email
            'D' => 10, // Jam Masuk
            'E' => 20, // Lokasi Masuk
            'F' => 10, // Jam Keluar
            'G' => 20, // Lokasi Pulang
            'H' => 15, // Durasi
            'I' => 15, // Status
            'J' => 15, // Telat (Agak dilebarkan sedikit)
            'K' => 15, // Link Maps
        ];
    }

    public function map($attendance): array
    {
        // 1. Hitung Durasi Kerja
        $workDuration = '-';
        if ($attendance->clock_in && $attendance->clock_out) {
            $in = Carbon::parse($attendance->clock_in);
            $out = Carbon::parse($attendance->clock_out);
            $diff = $in->diff($out);
            $workDuration = $diff->h . 'j ' . $diff->i . 'm'; // Contoh: 8j 30m
        }

        // 2. Hitung Format Terlambat (Menit -> Jam Menit)
        $lateFormatted = '0';
        if ($attendance->late_minutes > 0) {
            $hours = floor($attendance->late_minutes / 60);
            $minutes = $attendance->late_minutes % 60;
            
            if ($hours > 0) {
                $lateFormatted = "{$hours}j {$minutes}m"; // Contoh: 1j 15m
            } else {
                $lateFormatted = "{$minutes}m"; // Contoh: 45m
            }
        }

        // 3. Status Text
        $statusText = $attendance->status_arrival === 'late' ? 'TERLAMBAT' : 'TEPAT WAKTU';

        // 4. Link Maps
        $mapsLink = ($attendance->latitude_in && $attendance->longitude_in) 
            ? "http://maps.google.com/?q={$attendance->latitude_in},{$attendance->longitude_in}"
            : '-';

        return [
            Carbon::parse($attendance->date)->translatedFormat('l, d M Y'), 
            $attendance->user->name,
            $attendance->user->email,
            Carbon::parse($attendance->clock_in)->format('H:i'),
            $attendance->latitude_in ? "{$attendance->latitude_in},\n{$attendance->longitude_in}" : '-',
            $attendance->clock_out ? Carbon::parse($attendance->clock_out)->format('H:i') : '-',
            $attendance->latitude_out ? "{$attendance->latitude_out},\n{$attendance->longitude_out}" : '-',
            $workDuration,
            $statusText,
            $lateFormatted, // Menggunakan variabel yang sudah diformat
            $mapsLink,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Header Tabel
            4 => [
                'font' => ['bold' => true, 'color' => ['argb' => Color::COLOR_WHITE]],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => '1E3A8A']], 
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            ],
            // Nama Perusahaan
            1 => [
                'font' => ['bold' => true, 'size' => 16],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
            // Alamat
            2 => [
                'font' => ['size' => 11, 'italic' => true],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $rowCount = $sheet->getHighestRow(); 
                $highestColumn = 'K'; 

                // Merge Cells Kop Surat
                $sheet->mergeCells('A1:K1');
                $sheet->mergeCells('A2:K2');

                // Styling Global
                $sheet->getStyle('A4:' . $highestColumn . $rowCount)->getAlignment()->setWrapText(true);
                $sheet->getStyle('A4:' . $highestColumn . $rowCount)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);

                // Borders
                $sheet->getStyle('A4:' . $highestColumn . $rowCount)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['argb' => '9CA3AF'],
                        ],
                    ],
                ]);

                // Center Alignment
                $sheet->getStyle('A5:A' . $rowCount)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('D5:K' . $rowCount)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

                // Conditional Formatting (Warna Merah untuk Terlambat)
                for ($row = 5; $row <= $rowCount; $row++) {
                    $statusCellValue = $sheet->getCell('I' . $row)->getValue(); 

                    if ($statusCellValue === 'TERLAMBAT') {
                        $sheet->getStyle('I' . $row . ':J' . $row)->applyFromArray([
                            'font' => ['bold' => true, 'color' => ['argb' => 'DC2626']], 
                            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FEE2E2']] 
                        ]);
                    }
                }
            },
        ];
    }
}