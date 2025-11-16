<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Package extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'name',
        'price',
        'description',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'price'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "Paket {$this->name} telah {$eventName}");
    }
}