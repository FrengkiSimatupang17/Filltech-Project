<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'Modem ZTE',
            'category' => 'tool',
            'total_quantity' => 10,
            'available_quantity' => 10,
            'unit' => 'unit',
        ];
    }
}