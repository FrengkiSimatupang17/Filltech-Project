<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon; // Ditambahkan untuk urusan format tanggal di WA

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subscription_id',
        'invoice_number',
        'amount',
        'status', // pending, paid, overdue
        'type',   // installation, monthly
        'due_date',
        'paid_at',
    ];

    // [PERBAIKAN KRUSIAL] Casting ini WAJIB agar grafik bisa membaca bulan
    protected $casts = [
        'due_date' => 'date',
        'paid_at' => 'datetime',
        'amount' => 'integer',
    ];

    /**
     * Accessor untuk Link WhatsApp Manual (Skenario 1 - Gratis)
     * Menghasilkan link yang bisa diklik Admin di dashboard
     */
    public function getWaLinkAttribute()
    {
        $user = $this->user;
        if (!$user || !$user->phone) {
            return '#';
        }

        $phone = $user->phone;
        
        // Standarisasi nomor ke format 62 (Hapus angka 0 di depan)
        if (strpos($phone, '0') === 0) {
            $phone = '62' . substr($phone, 1);
        }

        // Pesan yang sopan dan profesional
        $message = "Salam hangat dari *Filltech Berkah Bersama* 🙏%0A%0A" .
                   "Yth. Bapak/Ibu *" . $user->name . "*,%0A%0A" .
                   "Semoga Bapak/Ibu dalam keadaan sehat selalu. Kami ingin menginformasikan bahwa tagihan layanan internet untuk periode bulan ini telah terbit.%0A%0A" .
                   "Berikut rincian tagihan Anda:%0A" .
                   "• No. Invoice: *" . $this->invoice_number . "*%0A" .
                   "• Total Tagihan: *Rp " . number_format($this->amount, 0, ',', '.') . "*%0A" .
                   "• Batas Pembayaran: *" . Carbon::parse($this->due_date)->format('d M Y') . "*%0A%0A" .
                   "Pembayaran dapat dilakukan melalui transfer bank. Mohon sertakan bukti pembayaran dengan mengunggahnya pada dashboard pelanggan atau mengirimkannya melalui chat ini.%0A%0A" .
                   "Terima kasih atas kepercayaan Anda menggunakan layanan kami. Salam sukses selalu! ✨";

        return "https://wa.me/" . $phone . "?text=" . $message;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}