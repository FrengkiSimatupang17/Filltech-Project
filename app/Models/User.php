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
        'name', 'email', 'password', 'role', 'id_unik', 
        'phone_number', 'status', 'google_id', 'avatar',
        'alamat', 'rt', 'rw', 'blok', 'nomor_rumah'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // --- AUTO GENERATE ID UNIK (ANTI DUPLIKAT) ---
    protected static function booted()
    {
        static::creating(function ($user) {
            // Hanya generate jika id_unik belum diisi manual
            if (empty($user->id_unik)) {
                $date = now()->format('dmY'); // Format: 25122025
                
                // Gunakan operator ?: (Elvis) untuk memastikan tidak kosong/null
                $rw   = $user->rw ?: '-';
                $rt   = $user->rt ?: '-';
                $no   = $user->nomor_rumah ?: '-';

                // 1. Buat Format Dasar: Tanggal_RW_RT.NoRumah
                $baseId = "{$date}_{$rw}_{$rt}.{$no}";
                
                // 2. Cek Duplikat di Database
                $finalId = $baseId;
                $counter = 1;

                // Selama ID ini sudah ada di database, tambahkan suffix angka (_1, _2, dst)
                // Contoh collision: 25122025_-_-.- menjadi 25122025_-_-.-_1
                while (static::where('id_unik', $finalId)->exists()) {
                    $finalId = "{$baseId}_{$counter}";
                    $counter++;
                }

                // 3. Simpan ID yang sudah pasti UNIK
                $user->id_unik = $finalId;
            }
        });
    }

    // --- RELASI ---
    public function invoices(): HasMany {
        return $this->hasMany(Invoice::class);
    }

    public function subscription(): HasOne {
        return $this->hasOne(Subscription::class)->latestOfMany();
    }

    public function clientTasks(): HasMany {
        return $this->hasMany(Task::class, 'user_id');
    }

    public function technicianTasks(): HasMany {
        return $this->hasMany(Task::class, 'technician_id');
    }

    // --- HELPER ROLE ---
    public function isAdmin(): bool { return $this->role === 'administrator'; }
    public function isTeknisi(): bool { return $this->role === 'teknisi'; }
    public function isClient(): bool { return $this->role === 'client'; }

    public function getAddressDetailAttribute(): string
    {
        $parts = [];
        if ($this->alamat && $this->alamat !== '-') $parts[] = $this->alamat;
        if ($this->blok && $this->blok !== '-') $parts[] = "Blok {$this->blok}";
        if ($this->nomor_rumah && $this->nomor_rumah !== '-') $parts[] = "No. {$this->nomor_rumah}";
        
        $rtRw = [];
        if ($this->rt && $this->rt !== '-') $rtRw[] = "RT.{$this->rt}";
        if ($this->rw && $this->rw !== '-') $rtRw[] = "RW.{$this->rw}";
        if (!empty($rtRw)) $parts[] = implode('/', $rtRw);

        return empty($parts) ? '-' : implode(', ', $parts);
    }
}