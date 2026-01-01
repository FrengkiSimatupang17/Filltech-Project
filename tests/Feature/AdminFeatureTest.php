<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminFeatureTest extends TestCase
{
    // Gunakan trait ini untuk reset DB setiap kali test jalan
    // use RefreshDatabase; 

    public function test_admin_can_access_activity_log_page()
    {
        // 1. Kita cari user yang role-nya admin (dari seeder)
        // Pastikan di database Anda ada user dengan role 'admin' atau 'administrator'
        $admin = User::where('role', 'admin')->orWhere('role', 'administrator')->first();

        // 2. Login sebagai admin & coba buka halaman Activity Log
        $response = $this->actingAs($admin)
                         ->get(route('admin.activity-log.index'));

        // 3. Harapan: Statusnya 200 (OK)
        $response->assertStatus(200);
    }

    public function test_admin_can_access_attendance_report_page()
    {
        $admin = User::where('role', 'admin')->orWhere('role', 'administrator')->first();

        $response = $this->actingAs($admin)
                         ->get(route('admin.attendance.report.index'));

        $response->assertStatus(200);
    }
    
    public function test_non_admin_cannot_access_restricted_pages()
    {
        // Cari user teknisi
        $teknisi = User::where('role', 'teknisi')->first();

        if ($teknisi) {
            $response = $this->actingAs($teknisi)
                             ->get(route('admin.activity-log.index'));

            // Harapan: Forbidden (403)
            $response->assertStatus(403);
        }
    }
}