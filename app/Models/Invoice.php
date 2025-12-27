<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subscription_id',
        'invoice_number',
        'amount',
        'status', // pending, paid, overdue
        'type',   // installation, monthly
        'due_date',
        'paid_at',
    ];

    // [PERBAIKAN KRISIAL] Casting ini WAJIB agar grafik bisa membaca bulan
    protected $casts = [
        'due_date' => 'date',
        'paid_at' => 'datetime',
        'amount' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}