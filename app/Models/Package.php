<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'name',
        'speed',
        'price',
        'description',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'price', 'speed', 'description'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "Paket {$this->name} telah {$eventName}");
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}