<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'technician_user_id',
        'clock_in',
        'clock_out',
        'notes',
    ];

    protected $casts = [
        'clock_in' => 'datetime',
        'clock_out' => 'datetime',
    ];

    protected $appends = ['is_late'];

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_user_id');
    }

    /**
     * Accessor: Menghitung keterlambatan (Jika Clock In > 08:00 WIB)
     */
    public function getIsLateAttribute(): bool
    {
        if (!$this->clock_in) return false;

        $deadlineTime = '08:00:00';
        
        // Konversi waktu masuk ke zona waktu WIB
        $clockInWIB = $this->clock_in->timezone('Asia/Jakarta');
        
        // Buat batas waktu hari itu (08:00 pagi)
        $deadline = Carbon::parse($clockInWIB->toDateString() . ' ' . $deadlineTime, 'Asia/Jakarta');

        return $clockInWIB->greaterThan($deadline);
    }
}