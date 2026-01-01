<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipmentLog extends Model
{
    use HasFactory;

    // [FIX] Sesuaikan dengan tabel database (lihat migrasi create_equipment_logs_table)
    protected $fillable = [
        'equipment_id',
        'user_id',
        'task_id',  // Opsional, ada di database
        'type',     // SEBELUMNYA SALAH: 'action' -> HARUS 'type'
        'quantity',
        'notes',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}