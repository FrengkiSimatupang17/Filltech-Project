<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'user_id',
        'amount',
        'payment_proof_path',
        'status',
        'verified_at',
        'verified_by_admin_id',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];
}