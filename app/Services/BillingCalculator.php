<?php

namespace App\Services;

use Carbon\Carbon;

class BillingCalculator
{
    /**
     * Hitung Biaya Prorata dengan Pembulatan Khusus.
     * * @param int|float $packagePrice Harga Normal Paket
     * @param Carbon $startDate Tanggal mulai berlangganan
     * @return array Mengembalikan detail perhitungan (total, hari_sisa, harga_harian)
     */
    public function calculateProrata($packagePrice, Carbon $startDate): array
    {
        $daysInMonth = $startDate->daysInMonth; // Total hari bulan ini (28, 30, atau 31)
        $currentDay = $startDate->day;
        
        // Menghitung sisa hari (Termasuk hari ini)
        // Contoh: Daftar tgl 20, Total 30. Sisa = 30 - 20 + 1 = 11 Hari.
        $remainingDays = $daysInMonth - $currentDay + 1;

        // 1. Hitung Harga Harian (Sesuai request: Harga / 30)
        // Kita gunakan 30 sebagai pembagi standar industri (360-day year basis)
        // atau gunakan $daysInMonth jika ingin akurasi kalender sempurna.
        // Sesuai request Anda: Kita pakai 30.
        $dailyRate = $packagePrice / 30;

        // 2. Hitung Biaya Mentah
        $rawAmount = $dailyRate * $remainingDays;

        // 3. Lakukan Pembulatan ke Atas (Nearest 500)
        // Contoh: 6166 -> 6500
        $roundedAmount = $this->roundUpToNearest500($rawAmount);

        return [
            'amount' => $roundedAmount,          // Nominal Akhir (Rp 6.500)
            'raw_amount' => $rawAmount,          // Nominal Asli (Rp 6.166,66)
            'daily_rate' => $dailyRate,          // Harga per hari
            'remaining_days' => $remainingDays,  // Sisa hari yang dibayar
            'days_in_month' => $daysInMonth,
        ];
    }

    /**
     * Logika Pembulatan ke 500 terdekat (Ke Atas)
     */
    private function roundUpToNearest500($amount)
    {
        // Logika: (Nilai / 500) dibulatkan ke atas, lalu dikali 500 lagi.
        return (int) (ceil($amount / 500) * 500);
    }
}