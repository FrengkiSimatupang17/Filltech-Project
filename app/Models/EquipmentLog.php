<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipmentLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'technician_user_id',
        'equipment_id',
        'borrowed_at',
        'returned_at',
        'notes',
    ];

    protected $casts = [
        'borrowed_at' => 'datetime',
        'returned_at' => 'datetime',
    ];
}