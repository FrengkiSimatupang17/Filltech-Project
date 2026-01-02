<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. BUAT AKUN ADMINISTRATOR UTAMA (Dengan Alamat Fisik)
        User::create([
            'name'              => 'Administrator Utama',
            'email'             => 'admin@filltech.com',
            'password'          => bcrypt('password'), // Password default
            'role'              => 'administrator',
            'email_verified_at' => now(),
            'phone_number'      => '081234567890',
            
            // Data Alamat Fisik (Kantor Pusat)
            'alamat'            => 'Jl. Jenderal Sudirman',
            'blok'              => 'A',
            'nomor_rumah'       => '10',
            'rt'                => '001',
            'rw'                => '005',
            
            // ID Unik akan otomatis dibuat oleh Model User::booted()
            // Hasilnya nanti akan jadi seperti: 25122025_005_001.10
        ]);

        // 2. BUAT AKUN TEKNISI (Opsional, buat contoh saja)
        User::create([
            'name'              => 'Teknisi Lapangan',
            'email'             => 'teknisi@filltech.com',
            'password'          => bcrypt('password'),
            'role'              => 'teknisi',
            'email_verified_at' => now(),
            'phone_number'      => '089876543210',
            
            // Teknisi mungkin tidak butuh alamat lengkap, tapi kita isi dummy agar rapi
            'alamat'            => 'Mess Karyawan',
            'blok'              => 'B',
            'nomor_rumah'       => '01',
            'rt'                => '002',
            'rw'                => '005',
        ]);

        }
    }