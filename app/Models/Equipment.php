<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'total_quantity',
        'available_quantity',
        'unit',
        'status',
    ];

    public function logs()
    {
        return $this->hasMany(EquipmentLog::class);
    }
}