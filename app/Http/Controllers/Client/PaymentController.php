<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use App\Models\ActivityLog; 
use App\Notifications\SystemAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB; 
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'payment_proof' => 'required|file|image|max:2048|mimes:jpg,jpeg,png',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'amount' => 'required|numeric|min:1000',
        ]);

        // 2. Keamanan: Cari Invoice milik user login
        $invoice = Invoice::where('id', $request->invoice_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // 3. Cek Duplikasi
        if ($invoice->payment()->where('status', 'pending')->exists()) {
            return Redirect::back()->with('error', 'Pembayaran sedang dalam verifikasi.');
        }

        // --- MULAI TRANSAKSI ---
        DB::beginTransaction();

        try {
            // 4. Upload File
            $path = $request->file('payment_proof')->store('payment-proofs', 'public');

            // 5. Simpan Payment
            Payment::create([
                'invoice_id' => $invoice->id,
                'user_id' => Auth::id(),
                'amount' => $request->amount,
                'payment_proof_path' => $path, 
                'payment_date' => $request->payment_date,
                'payment_method' => $request->payment_method,
                'status' => 'pending',
            ]);

            // 6. Update Status Invoice 
            // PENTING: Jika langkah ini gagal (Check Constraint PGSQL), catch block akan menangkapnya.
            $invoice->update(['status' => 'waiting_verification']);

            // 7. Catat Log Activity
            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'client_payment',
                'event' => 'create',
                'description' => "Upload bukti bayar Rp " . number_format($request->amount, 0, ',', '.') . " untuk Invoice #{$invoice->invoice_number}",
                'ip_address' => $request->ip(),
            ]);

            // Jika semua langkah di atas sukses, simpan permanen ke DB
            DB::commit();

            // 8. Kirim Notifikasi Dashboard (Tanpa Email)
            try {
                $admins = User::where('role', 'administrator')->get();
                if (class_exists(SystemAlert::class)) {
                    Notification::send($admins, new SystemAlert(
                        'Pembayaran Baru: Rp ' . number_format($request->amount, 0, ',', '.'),
                        route('admin.payments.index'),
                        'payment'
                    ));
                }
            } catch (\Exception $e) {
                Log::warning('Notifikasi gagal: ' . $e->getMessage());
            }

            return Redirect::route('client.invoices.index')->with('success', 'Bukti pembayaran berhasil diunggah.');

        } catch (\Exception $e) {
            DB::rollback(); // BATALKAN SEMUA
            
            Log::error('Gagal Simpan Pembayaran: ' . $e->getMessage());
            
            // Mengirim pesan error asli agar Anda tahu masalah DB-nya
            return Redirect::back()->with('error', 'Gagal: ' . $e->getMessage());
        }
    }
}