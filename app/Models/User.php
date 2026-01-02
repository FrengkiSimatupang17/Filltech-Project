<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Carbon\Carbon;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 
        'id_unik', 'phone_number', 'status', 
        'google_id', 'avatar', 
        'alamat', 'rt', 'rw', 'blok', 'nomor_rumah'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // --- AUTO GENERATE ID UNIK (DIPERBAIKI) ---
    protected static function booted()
    {
        static::creating(function ($user) {
            // Hanya generate jika role client dan id_unik belum diisi
            if ($user->role === 'client' && empty($user->id_unik)) {
                
                // [SATPAM BARU]
                // Cek apakah data alamat SUDAH ADA saat user dibuat?
                // Kalau admin yang input (Create User), biasanya alamat langsung diisi -> ID Terbentuk.
                // Kalau Register sendiri (Form Register/Google), alamat biasanya kosong -> ID JANGAN DIBUAT DULU (Biarkan NULL).
                if (!empty($user->alamat) && !empty($user->rt) && !empty($user->rw) && !empty($user->nomor_rumah)) {
                     $user->id_unik = self::generateIdUnik($user);
                }
            }
        });
    }

    /**
     * GENERATOR ID UNIK TERPUSAT
     * Format: 020126-RWMANTANG-RT02-C.12A
     */
    public static function generateIdUnik($user)
    {
        // 1. Tanggal (dmy -> 020126)
        $date = $user->created_at ? Carbon::parse($user->created_at) : Carbon::now();
        $dateStr = $date->format('dmy'); 

        // 2. Format RW (Bisa Huruf & Angka)
        $rwRaw = $user->rw ? strtoupper(str_replace(' ', '', $user->rw)) : '';
        // Pastikan tidak kosong untuk menghindari 'RW-' di tengah jalan (fallback ke 'XX' jika error)
        $rwStr = empty($rwRaw) ? 'RW-' : 'RW' . $rwRaw;

        // 3. Format RT (Angka 3 Digit)
        $rtRaw = preg_replace('/[^0-9]/', '', $user->rt ?? '');
        $rtStr = empty($rtRaw) ? 'RT-' : 'RT' . str_pad(substr($rtRaw, 0, 3), 2, '0', STR_PAD_LEFT);

        // 4. Blok & Nomor
        $blok = $user->blok ? strtoupper(str_replace(' ', '', $user->blok)) : '-';
        $nomor = $user->nomor_rumah ? strtoupper(str_replace(' ', '', $user->nomor_rumah)) : '-';

        // Gabungkan Base ID
        $baseId = "{$dateStr}-{$rwStr}-{$rtStr}-{$blok}.{$nomor}";

        // 5. Cek Duplikasi
        $finalId = $baseId;
        $counter = 1;
        
        while (static::where('id_unik', $finalId)->where('id', '!=', $user->id)->exists()) {
            $finalId = "{$baseId}-{$counter}";
            $counter++;
        }

        return $finalId;
    }

    // --- RELASI (Tetap) ---
    public function invoices(): HasMany { return $this->hasMany(Invoice::class); }
    public function subscription(): HasOne { return $this->hasOne(Subscription::class)->latestOfMany(); }
    public function clientTasks(): HasMany { return $this->hasMany(Task::class, 'client_user_id'); }
    public function technicianTasks(): HasMany { return $this->hasMany(Task::class, 'technician_user_id'); }
    public function isAdmin(): bool { return $this->role === 'administrator'; }
    public function isTeknisi(): bool { return $this->role === 'teknisi'; }
    public function isClient(): bool { return $this->role === 'client'; }

    // --- ACCESSOR ---
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