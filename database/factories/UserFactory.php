<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            // Fix RuntimeException Hash
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => 'client', // Default role
            
            // Fix Middleware Profile Complete
            'alamat' => fake()->address(),
            'phone_number' => fake()->phoneNumber(), // SESUAI DB
            'rt' => '001',
            'rw' => '002',
            'nomor_rumah' => fake()->buildingNumber(),
            // 'id_unik' akan digenerate observer/controller biasanya
        ];
    }
}