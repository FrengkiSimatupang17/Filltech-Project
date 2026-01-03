<?php

namespace Tests\Unit;

use App\Services\BillingCalculator;
use Carbon\Carbon;
use PHPUnit\Framework\TestCase;

class BillingCalculatorTest extends TestCase
{
    private BillingCalculator $calculator;

    protected function setUp(): void
    {
        parent::setUp();
        $this->calculator = new BillingCalculator();
    }

    /** @test */
    public function it_calculates_daily_rate_based_on_30_days_standard()
    {
        // LOGIKA: Harga Paket / 30 hari
        // Contoh: 300.000 / 30 = 10.000 per hari
        $startDate = Carbon::create(2024, 4, 1); // Tanggal dummy
        $result = $this->calculator->calculateProrata(300000, $startDate);

        $this->assertEquals(10000, $result['daily_rate']);
    }

    /** @test */
    public function it_calculates_remaining_days_correctly()
    {
        // KASUS: Bulan Januari (31 Hari). Daftar tanggal 20.
        // Hitungan: 31 - 20 + 1 = 12 Hari (tgl 20, 21, ..., 31)
        
        $startDate = Carbon::create(2024, 1, 20);
        $result = $this->calculator->calculateProrata(150000, $startDate);
        
        $this->assertEquals(12, $result['remaining_days']);
        $this->assertEquals(31, $result['days_in_month']);
    }

    /** @test */
    public function it_rounds_up_to_nearest_500_correctly()
    {
        // SKENARIO 1: Angka Keriting -> Bulatkan ke atas
        // Paket: 100.000
        // Rate: 100.000 / 30 = 3.333,33
        // Tanggal: 31 Jan (Sisa 1 hari) -> Raw: 3.333,33
        // HARAPAN: Dibulatkan jadi 3.500
        $result = $this->calculator->calculateProrata(100000, Carbon::create(2024, 1, 31));
        $this->assertEquals(3500, $result['amount']);

        // SKENARIO 2: Angka Pas -> Tidak berubah
        // Paket: 150.000
        // Rate: 150.000 / 30 = 5.000
        // Tanggal: 31 Jan (Sisa 1 hari) -> Raw: 5.000
        // HARAPAN: Tetap 5.000
        $result2 = $this->calculator->calculateProrata(150000, Carbon::create(2024, 1, 31));
        $this->assertEquals(5000, $result2['amount']);
        
        // SKENARIO 3: Sedikit di atas 500 (misal 5.001) -> Jadi 5.500
        // Paket: 150.030 -> Rate: 5001 per hari
        // HARAPAN: 5.500
        $result3 = $this->calculator->calculateProrata(150030, Carbon::create(2024, 1, 31));
        $this->assertEquals(5500, $result3['amount']);
    }
    
    /** @test */
    public function it_handles_calculation_for_real_world_scenario()
    {
        // SIMULASI REAL:
        // Paket: Rp 150.000
        // Daftar: 20 Januari 2024
        // Sisa Hari: 12 hari (tgl 20 s/d 31)
        
        // Hitungan Manual:
        // Rate = 150.000 / 30 = 5.000
        // Raw = 5.000 x 12 = 60.000
        // Rounded = 60.000
        
        $result = $this->calculator->calculateProrata(150000, Carbon::create(2024, 1, 20));
        
        $this->assertEquals(60000, $result['amount']);
        $this->assertEquals(12, $result['remaining_days']);
    }
}