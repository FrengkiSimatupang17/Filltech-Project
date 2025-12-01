<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    /**
     * Relasi ke tabel Equipment (Alat)
     * Wajib ada agar ->with('equipment') di controller berfungsi.
     */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    /**
     * Relasi ke User (Teknisi)
     */
    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_user_id');
    }
}