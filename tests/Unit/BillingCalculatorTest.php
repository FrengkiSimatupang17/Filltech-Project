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
    public function it_calculates_daily_rate_with_high_precision()
    {
        // LOGIKA BARU: Desimal dibiarkan mengalir
        // Harga: 100.000 -> Rate: 3333.3333...
        $startDate = Carbon::create(2024, 4, 1);
        $result = $this->calculator->calculateProrata(100000, $startDate);

        // Pastikan rate harian akurat (toleransi 0.01)
        $this->assertEqualsWithDelta(3333.33, $result['daily_rate'], 0.01);
    }

    /** @test */
    public function it_calculates_remaining_days_correctly()
    {
        // Jan 20 (31 Hari). Sisa: 12 Hari.
        $startDate = Carbon::create(2024, 1, 20);
        $result = $this->calculator->calculateProrata(150000, $startDate);
        
        $this->assertEquals(12, $result['remaining_days']);
    }

    /** @test */
    public function it_rounds_up_final_result_correctly()
    {
        // SKENARIO: Harga 100.000, Sisa 12 Hari (Jan 20-31)
        // Rate: 3333.333...
        // Raw Total: 40.000
        // Harapan: 40.000 (Bulat)
        
        $result = $this->calculator->calculateProrata(100000, Carbon::create(2024, 1, 20));
        
        $this->assertEquals(40000, $result['amount']);

        // SKENARIO KOMPLEKS: Harga 80.000, Sisa 1 Hari
        // Rate: 2666.66...
        // Total Raw: 2666.66...
        // Pembulatan ke 500 terdekat -> 3.000
        
        $result2 = $this->calculator->calculateProrata(80000, Carbon::create(2024, 1, 31));
        $this->assertEquals(3000, $result2['amount']);
    }
}