<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Subscription;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceFactory extends Factory
{
    public function definition(): array
    {
        return [
        'user_id' => User::factory(),
        'subscription_id' => Subscription::factory(),
        'invoice_number' => 'INV-' . $this->faker->unique()->numerify('#####'),
        'amount' => 150000,
        'status' => 'unpaid',
        'due_date' => now()->addDays(7),
        'type' => 'monthly',
        ];
    }
}