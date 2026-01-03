<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AttendanceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'date' => now()->toDateString(),
            'clock_in' => '08:00:00',
            'clock_out' => '17:00:00',
            'status' => 'present',
            
            // Fix Column Not Found 'is_late'
            'status_arrival' => 'on_time', 
            'late_minutes' => 0,
        ];
    }
}