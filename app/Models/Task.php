<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_user_id',       // ID User Client
        'technician_user_id',   // ID User Teknisi (Nullable saat awal)
        'assigned_by_admin_id', // ID User Admin (PENTING: Tambahkan ini)
        'title',
        'description',
        'type',                 // PENTING: Tambahkan ini (installation/repair)
        'status',               // assigned, in_progress, completed
        'evidence_photo_path',
        'address'               // Jika di database ada kolom address, masukkan. Jika tidak, hapus baris ini.
    ];

    // Relasi ke Client
    public function client()
    {
        return $this->belongsTo(User::class, 'client_user_id');
    }

    // Relasi ke Teknisi
    public function technician()
    {
        return $this->belongsTo(User::class, 'technician_user_id');
    }
}