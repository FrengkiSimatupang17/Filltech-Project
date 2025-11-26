<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_user_id',
        'technician_user_id',
        'assigned_by_admin_id',
        'title',
        'description',
        'type',
        'status',
        'priority',
        'completed_at'
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_user_id');
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_user_id');
    }

    public function assignor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by_admin_id');
    }
}