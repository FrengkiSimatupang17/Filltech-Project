<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Equipment;

class EquipmentSeeder extends Seeder
{
    public function run(): void
    {
        // Data 1: Alat Kerja
        Equipment::create([
            'name' => 'Tang Crimping',
            'category' => 'tool',
            'unit' => 'pcs',
            'total_quantity' => 5,
            'available_quantity' => 5,
            'status' => 'available', // Jangan pakai 'condition'
        ]);

        // Data 2: Alat Kerja
        Equipment::create([
            'name' => 'Splicing Machine',
            'category' => 'tool',
            'unit' => 'unit',
            'total_quantity' => 2,
            'available_quantity' => 2,
            'status' => 'available',
        ]);

        // Data 3: Bahan Habis Pakai
        Equipment::create([
            'name' => 'Kabel FO Dropcore',
            'category' => 'material',
            'unit' => 'roll', 
            'total_quantity' => 50,
            'available_quantity' => 50,
            'status' => 'available',
        ]);
    }
}