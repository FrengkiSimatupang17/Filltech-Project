<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use App\Notifications\SystemAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redirect;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'payment_proof' => 'required|file|image|max:2048|mimes:jpg,jpeg,png',
            'payment_date' => 'required|date',      // Wajib ada di form frontend
            'payment_method' => 'required|string',  // Wajib ada di form frontend (Transfer/Cash)
            'amount' => 'required|numeric|min:1000',
        ]);

        // 2. KEAMANAN (Anti-IDOR): Pastikan Invoice milik User yang login
        // Menggunakan where() berantai lebih aman daripada find() lalu cek if()
        $invoice = Invoice::where('id', $request->invoice_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // 3. Cek Status Invoice (Hanya boleh bayar jika pending atau overdue)
        // Kita izinkan 'overdue' agar user yang telat tetap bisa bayar.
        if (!in_array($invoice->status, ['pending', 'overdue'])) {
             return Redirect::back()->with('error', 'Tagihan ini tidak memerlukan pembayaran.');
        }

        // 4. Cek Duplikasi: Jangan izinkan upload jika sedang diverifikasi
        if ($invoice->payment()->whereIn('status', ['pending', 'verified'])->exists()) {
            return Redirect::route('client.invoices.index')
                ->with('error', 'Pembayaran untuk tagihan ini sudah dikirim dan sedang diproses.');
        }

        // 5. Upload File
        $path = $request->file('payment_proof')->store('payment-proofs', 'public');

        // 6. Simpan ke Database
        Payment::create([
            'invoice_id' => $invoice->id,
            'user_id' => Auth::id(),
            'amount' => $request->amount, // Gunakan input user (bisa jadi bayar parsial)
            'payment_proof_path' => $path, // Sesuaikan dengan nama kolom di DB Anda
            'payment_date' => $request->payment_date,
            'payment_method' => $request->payment_method,
            'status' => 'pending',
        ]);

        // 7. Kirim Notifikasi ke Admin (Kode Asli Anda)
        $admins = User::where('role', 'administrator')->get();
        
        try {
            Notification::send($admins, new SystemAlert(
                'Verifikasi Pembayaran Baru: Rp ' . number_format($request->amount, 0, ',', '.'),
                route('admin.payments.index'),
                'payment'
            ));
        } catch (\Exception $e) {
            // Abaikan error notifikasi agar user tetap sukses bayar meski email gagal kirim
            // Log::error('Gagal kirim notifikasi: ' . $e->getMessage());
        }

        return Redirect::route('client.invoices.index')->with('success', 'Bukti pembayaran berhasil diunggah & menunggu verifikasi.');
    }
}