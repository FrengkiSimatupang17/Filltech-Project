<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Task;
use App\Models\Attendance;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TechnicianTaskTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function teknisi_harus_clock_in_sebelum_update_tugas()
    {
        $tech = User::factory()->create(['role' => 'teknisi']);
        $task = Task::factory()->create(['technician_user_id' => $tech->id]);

        // Belum Clock In -> Coba akses
        $response = $this->actingAs($tech)->patch(route('teknisi.tasks.update', $task->id), [
            'status' => 'completed'
        ]);

        // Ekspektasi: Redirect atau Error (tergantung Middleware clock_in Anda)
        // Biasanya redirect ke halaman attendance
        $response->assertStatus(302); 
    }

    /** @test */
    public function teknisi_tidak_bisa_akses_tugas_teknisi_lain()
    {
        $techA = User::factory()->create(['role' => 'teknisi']);
        $techB = User::factory()->create(['role' => 'teknisi']);
        
        // Simulasi Clock In untuk Tech A
        Attendance::create([
            'user_id' => $techA->id,
            'date' => now()->toDateString(),
            'clock_in' => now(),
            'status' => 'present'
        ]);

        // Tugas milik Tech B
        $taskB = Task::factory()->create(['technician_user_id' => $techB->id]);

        // Tech A mencoba update tugas Tech B
        $response = $this->actingAs($techA)->patch(route('teknisi.tasks.update', $taskB->id), [
            'status' => 'completed'
        ]);

        // Ekspektasi: 403 Forbidden (Akses Ditolak)
        $response->assertStatus(403);
    }

    /** @test */
    public function upload_bukti_foto_tersimpan_di_storage()
    {
        Storage::fake('public');
        
        $tech = User::factory()->create(['role' => 'teknisi']);
        $task = Task::factory()->create(['technician_user_id' => $tech->id]);

        // Simulasi Clock In
        Attendance::create([
            'user_id' => $tech->id,
            'date' => now()->toDateString(),
            'clock_in' => now(),
            'status' => 'present'
        ]);

        $file = UploadedFile::fake()->image('bukti.jpg');

        $this->actingAs($tech)->patch(route('teknisi.tasks.update', $task->id), [
            'status' => 'completed',
            'description' => 'Selesai',
            'evidence' => $file
        ]);

        // Cek status DB berubah
        $this->assertEquals('completed', $task->fresh()->status);
        
        // Cek file ada di storage folder task-evidence
        // Laravel menyimpan hash name, jadi kita cek path dari DB
        $path = $task->fresh()->evidence_photo_path;
        Storage::disk('public')->assertExists($path);
    }
}