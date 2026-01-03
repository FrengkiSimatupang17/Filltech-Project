<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        Package::create([
            'name' => 'Paket Ultimate',
            'speed' => '50 Mbps',
            'price' => 520000,
            'description' => 'Performa maksimal untuk gaming kompetitif, streaming 4K, dan aktivitas online tanpa batas.'
        ]);

        Package::create([
            'name' => 'Paket Turbo',
            'speed' => '30 Mbps',
            'price' => 295000,
            'description' => 'Stabil dan cepat untuk WFH, meeting online, dan banyak perangkat sekaligus.'
        ]);

        Package::create([
            'name' => 'Paket Keluarga',
            'speed' => '20 Mbps',
            'price' => 230000,
            'description' => 'Nyaman untuk seluruh anggota keluarga, streaming HD, dan aktivitas harian.'
        ]);

        Package::create([
            'name' => 'Paket Aktif',
            'speed' => '15 Mbps',
            'price' => 185000,
            'description' => 'Pas untuk browsing lancar, media sosial, dan streaming ringan tanpa hambatan.'
        ]);

        Package::create([
            'name' => 'Paket Hemat',
            'speed' => '10 Mbps',
            'price' => 150000,
            'description' => 'Solusi ekonomis untuk kebutuhan internet dasar sehari-hari.'
        ]);

        Package::create([
            'name' => 'Paket Basic',
            'speed' => '5 Mbps',
            'price' => 120000,
            'description' => 'Pilihan paling terjangkau untuk chatting, browsing ringan, dan penggunaan personal.'
        ]);

    }
}