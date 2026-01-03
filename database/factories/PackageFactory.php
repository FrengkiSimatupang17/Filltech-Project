<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PackageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'Paket Internet ' . $this->faker->word,
            'speed' => $this->faker->numberBetween(10, 100) . ' Mbps',
            'price' => $this->faker->numberBetween(150000, 500000),
            'description' => $this->faker->sentence,
        ];
    }
}