<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_activity_log_page()
    {
        // [FIX] Buat admin baru, jangan cari (karena database di-reset setiap test)
        $admin = User::factory()->create(['role' => 'administrator']);

        $response = $this->actingAs($admin)
                         ->get(route('admin.activity-log.index'));

        $response->assertStatus(200);
    }

    public function test_admin_can_access_attendance_report_page()
    {
        // [FIX] Buat admin baru
        $admin = User::factory()->create(['role' => 'administrator']);

        $response = $this->actingAs($admin)
                         ->get(route('admin.attendance.report.index'));

        $response->assertStatus(200);
    }
}