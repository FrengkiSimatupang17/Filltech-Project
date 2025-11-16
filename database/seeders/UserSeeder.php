<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Administrator
        User::create([
            'name' => 'Admin Filltech',
            'email' => 'admin@filltech.com',
            'password' => Hash::make('password'),
            'role' => 'administrator',
        ]);

        // 2. Akun Teknisi
        User::create([
            'name' => 'Teknisi Budi',
            'email' => 'budi@filltech.com',
            'password' => Hash::make('password'),
            'role' => 'teknisi',
        ]);

        User::create([
            'name' => 'Teknisi Anton',
            'email' => 'anton@filltech.com',
            'password' => Hash::make('password'),
            'role' => 'teknisi',
        ]);

        // 3. Akun Klien
        User::create([
            'name' => 'Klien Siska',
            'email' => 'siska@client.com',
            'password' => Hash::make('password'),
            'role' => 'client',
            'phone_number' => '081234567890',
            'rt' => '001',
            'rw' => '002',
            'blok' => 'A',
            'nomor_rumah' => '10',
            'id_unik' => '20250101_001_002_A10'
        ]);
    }
}