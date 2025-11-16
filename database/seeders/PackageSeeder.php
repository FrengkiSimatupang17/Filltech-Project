<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        Package::create(['name' => 'Paket Sultan', 'speed' => '50 Mbps', 'price' => 520000, 'description' => 'Koneksi tercepat untuk gaming dan streaming 4K.']);
        Package::create(['name' => 'Paket Ngebut', 'speed' => '30 Mbps', 'price' => 295000, 'description' => 'Cocok untuk WFH dan beberapa perangkat.']);
        Package::create(['name' => 'Paket Ramean', 'speed' => '20 Mbps', 'price' => 230000, 'description' => 'Ideal untuk keluarga dan streaming HD.']);
        Package::create(['name' => 'Paket Asik', 'speed' => '15 Mbps', 'price' => 185000, 'description' => 'Bagus untuk browsing dan media sosial.']);
        Package::create(['name' => 'Paket Santai', 'speed' => '10 Mbps', 'price' => 150000, 'description' => 'Paket hemat untuk penggunaan ringan.']);
    }
}