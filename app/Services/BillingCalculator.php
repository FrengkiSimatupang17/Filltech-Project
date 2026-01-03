<?php

namespace App\Services;

use Carbon\Carbon;

class BillingCalculator
{
    /**
     * Hitung Biaya Prorata dengan Presisi Tinggi.
     * Desimal dibiarkan mengalir, hanya hasil akhir yang dibulatkan.
     * Digunakan untuk tagihan bulan ke-2 (penyesuaian tanggal).
     */
    public function calculateProrata($packagePrice, Carbon $startDate): array
    {
        $daysInMonth = $startDate->daysInMonth;
        $currentDay = $startDate->day;
        
        // Sisa hari (inklusif hari ini)
        $remainingDays = $daysInMonth - $currentDay + 1;

        // 1. Hitung Harga Harian (Biarkan Desimal/Koma agar akurat)
        // Rumus: Harga Paket / 30 Hari (Standar)
        // Contoh: 100.000 / 30 = 3333.33333... (Jangan dibulatkan dulu)
        $dailyRate = $packagePrice / 30;

        // 2. Hitung Total Mentah
        // Contoh: 3333.333... * 12 hari = 39.999,99...
        $rawAmount = $dailyRate * $remainingDays;

        // 3. BARU Lakukan Pembulatan Hasil Akhir
        // Pembulatan ke 500 rupiah terdekat (Ceiling/Ke Atas)
        // Contoh: 39.999,99 -> 40.000
        $roundedAmount = $this->roundUpToNearest500($rawAmount);

        return [
            'amount' => $roundedAmount,          // Nominal Akhir (Bulat)
            'raw_amount' => $rawAmount,          // Nominal Asli (Koma)
            'daily_rate' => $dailyRate,          // Rate Harian
            'remaining_days' => $remainingDays,
        ];
    }

    /**
     * Helper: Bulatkan ke kelipatan 500 ke atas
     */
    private function roundUpToNearest500($amount)
    {
        return (int) (ceil($amount / 500) * 500);
    }
}