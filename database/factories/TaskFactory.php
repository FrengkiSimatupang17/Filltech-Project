<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'client_user_id' => User::factory(),
            'technician_user_id' => User::factory(),
            'title' => 'Pasang Internet',
            'description' => 'Instalasi baru',
            'status' => 'assigned',
            'type' => 'installation',
        ];
    }
}