<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Package;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubscriptionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'package_id' => Package::factory(),
            'status' => 'active',
            // HAPUS started_at & expires_at jika memang tidak ada di DB schema
            // 'started_at' => now(), 
            // 'expires_at' => now()->addMonth(),
        ];
    }
}