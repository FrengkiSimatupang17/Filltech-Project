<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    /**
     * Kolom yang boleh diisi (Mass Assignment)
     */
    protected $fillable = [
        'client_user_id',      // ID User Klien
        'technician_user_id',  // ID User Teknisi (bisa null)
        'assigned_by_admin_id',// ID Admin pembuat tugas
        'title',
        'description',
        'type',                // installation / repair
        'status',              // pending, assigned, in_progress, completed, cancelled
        'priority',            // low, medium, high
        'completed_at'
    ];

    /**
     * Relasi ke Klien (User)
     * Foreign Key: client_user_id
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_user_id');
    }

    /**
     * Relasi ke Teknisi (User)
     * Foreign Key: technician_user_id
     */
    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_user_id');
    }

    /**
     * Relasi ke Admin yang menugaskan (Opsional)
     */
    public function assignor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by_admin_id');
    }
}