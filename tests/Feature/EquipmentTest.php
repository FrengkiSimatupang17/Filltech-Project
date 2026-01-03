<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Equipment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EquipmentTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function admin_tidak_bisa_restock_input_negatif()
    {
        // 1. Setup Admin & Barang
        $admin = User::factory()->create(['role' => 'administrator']);
        $item = Equipment::factory()->create([
            'total_quantity' => 10,
            'available_quantity' => 10
        ]);

        // 2. Admin input -5
        // [PERBAIKAN]: Nama route menjadi 'admin.equipment.restock'
        $response = $this->actingAs($admin)->post(route('admin.equipment.restock', $item->id), [
            'quantity' => -5, 
            'notes' => 'Hack stok'
        ]);

        // 3. Ekspektasi: Error Validasi
        $response->assertSessionHasErrors('quantity');
        
        // Stok tidak berubah
        $this->assertEquals(10, $item->fresh()->total_quantity);
    }

    /** @test */
    public function restock_berhasil_menambah_stok_dan_mencatat_log()
    {
        $admin = User::factory()->create(['role' => 'administrator']);
        $item = Equipment::factory()->create([
            'total_quantity' => 50,
            'available_quantity' => 50
        ]);

        // Admin input +20
        // [PERBAIKAN]: Nama route menjadi 'admin.equipment.restock'
        $this->actingAs($admin)->post(route('admin.equipment.restock', $item->id), [
            'quantity' => 20,
            'notes' => 'Pembelian batch 2'
        ]);

        // Ekspektasi: Stok jadi 70 (50+20)
        $this->assertEquals(70, $item->fresh()->total_quantity);

        // Cek Log Masuk DB
        $this->assertDatabaseHas('equipment_logs', [
            'equipment_id' => $item->id,
            'quantity' => 20,
            'type' => 'restock'
        ]);

        // Cek Activity Log (Audit Trail)
        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $admin->id,
            'action' => 'restock_equipment'
        ]);
    }
}