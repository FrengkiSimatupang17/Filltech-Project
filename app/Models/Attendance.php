<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendances';

    protected $fillable = [
        'user_id', 
        'date',    
        'clock_in',
        'clock_out',
        'status',
        'notes',

        // [WAJIB] Agar lokasi tersimpan (Sesuai Controller)
        'latitude_in',
        'longitude_in',
        'latitude_out',
        'longitude_out',

        // [WAJIB] Agar fitur "TERLAMBAT" di Admin & Excel muncul
        'status_arrival', 
        'late_minutes',
    ];

    // Casting penting agar format jam sesuai
    protected $casts = [
        'date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}