<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;

class ExportFinancialTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function admin_can_export_financial_report_to_excel()
    {
        Excel::fake();

        // PERBAIKAN: Gunakan 'administrator' bukan 'admin'
        $admin = User::factory()->create(['role' => 'administrator']);
        
        // Buat Payment harus memiliki relasi invoice dan user agar tidak error saat export
        // Kita gunakan factory Payment yang benar (asumsi Anda punya PaymentFactory yang lengkap)
        // Atau buat manual jika PaymentFactory belum handle relasi
        $payment = Payment::factory()->create(['status' => 'verified']);

        $response = $this->actingAs($admin)
                         ->get(route('admin.reports.export'));

        $response->assertStatus(200);

        // Sesuaikan format tanggal dengan Controller (Laporan_Keuangan_YYYY-MM-DD_HHMMSS)
        // Kita gunakan regex/wildcard karena detiknya mungkin beda sepersekian ms
        // Tapi untuk simplenya assert true dulu jika download terjadi
        Excel::matchByRegex();
        Excel::assertDownloaded('/Laporan_Keuangan_.*\.xlsx/');
    }
}