<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'id_unik',
        'phone_number',
        'google_id',
        'google_avatar',
        'rt',
        'rw',
        'blok',
        'nomor_rumah',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->latestOfMany();
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function clientTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'client_user_id');
    }

    public function technicianTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'technician_user_id');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'administrator';
    }

    public function isTeknisi(): bool
    {
        return $this->role === 'teknisi';
    }

    public function isClient(): bool
    {
        return $this->role === 'client';
    }
    
    public function getAddressDetailAttribute()
    {
        $parts = [];
        if ($this->blok) $parts[] = "Blok {$this->blok}";
        if ($this->nomor_rumah) $parts[] = "No. {$this->nomor_rumah}";
        if ($this->rt) $parts[] = "RT {$this->rt}";
        if ($this->rw) $parts[] = "RW {$this->rw}";
        
        return empty($parts) ? '-' : implode(', ', $parts);
    }
}