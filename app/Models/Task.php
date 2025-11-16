<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Task extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'client_user_id',
        'technician_user_id',
        'assigned_by_admin_id',
        'title',
        'description',
        'type',
        'status',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'technician_user_id'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "Tugas {$this->title} telah {$eventName}");
    }

    public function clientUser()
    {
        return $this->belongsTo(User::class, 'client_user_id');
    }

    public function technicianUser()
    {
        return $this->belongsTo(User::class, 'technician_user_id');
    }
}