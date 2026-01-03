<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Attendance;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;

class ExportAttendanceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function admin_can_export_attendance_report_to_excel()
    {
        Excel::fake();

        $admin = User::factory()->create(['role' => 'administrator']);
        
        Attendance::factory()->count(5)->create();

        $response = $this->actingAs($admin)
                         ->get(route('admin.attendance.report.export'));

        $response->assertStatus(200);
        Excel::matchByRegex();
        Excel::assertDownloaded('/Laporan_Absensi_.*\.xlsx/');
    }

    /** @test */
    public function non_admin_cannot_export_attendance()
    {
        Excel::fake();
        
        $user = User::factory()->create(['role' => 'client']);

        $response = $this->actingAs($user)
                         ->get(route('admin.attendance.report.export'));

        // FIX: Aplikasi Anda mengembalikan 403 Forbidden (Strict API)
        $response->assertStatus(403); 
    }
}