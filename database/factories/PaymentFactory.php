<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'invoice_id' => Invoice::factory(),
            'amount' => 150000,
            'status' => 'pending', // verified, rejected
            
            // Fix SQL Error: Column not found / Not Null Violation
            'payment_proof_path' => 'payments/dummy-proof.jpg', 
        ];
    }
}