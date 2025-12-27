<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentVerificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['invoice.user']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('id', 'like', '%' . $request->search . '%')
                  ->orWhereHas('invoice', function ($inv) use ($request) {
                      $inv->where('invoice_number', 'like', '%' . $request->search . '%')
                          ->orWhereHas('user', function ($u) use ($request) {
                              $u->where('name', 'like', '%' . $request->search . '%')
                                ->orWhere('email', 'like', '%' . $request->search . '%');
                          });
                  });
            });
        }

        $payments = $query->orderByRaw("CASE WHEN status = 'pending' THEN 1 ELSE 2 END")
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['search']),
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $request->validate([
            'status' => 'required|in:verified,rejected',
            'rejection_reason' => 'nullable|string|required_if:status,rejected',
        ]);

        // Gunakan Transaksi Database agar Data Konsisten
        DB::transaction(function () use ($request, $payment) {
            
            // 1. Update Status Pembayaran
            $payment->update([
                'status' => $request->status,
                'rejection_reason' => $request->status === 'rejected' ? $request->rejection_reason : null,
                'verified_at' => now(),
                'verified_by_admin_id' => Auth::id(),
            ]);

            // 2. Jika DITERIMA (Verified)
            if ($request->status === 'verified') {
                
                // A. Tandai Invoice LUNAS
                $payment->invoice->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);

                // B. [PENTING] Logika Pembuatan Tugas & Aktivasi Langganan
                if ($payment->invoice->type === 'installation') {
                    
                    // Aktifkan Langganan
                    if ($payment->invoice->subscription) {
                        $payment->invoice->subscription->update([
                            'status' => 'active',
                            'activated_at' => now(),
                        ]);
                    }

                    // --- BUAT TUGAS INSTALASI OTOMATIS ---
Task::create([
    'client_user_id' => $payment->user_id,
    'assigned_by_admin_id' => Auth::id(),
    'title' => 'Instalasi Baru: ' . $payment->user->name,
    'description' => 'Pemasangan paket internet baru. Segera hubungi pelanggan untuk jadwal.',
    'type' => 'installation',
    'status' => 'pending',
                    ]);
                } 
                elseif ($payment->invoice->type === 'monthly') {
                    // Jika pembayaran bulanan, cukup perpanjang aktifasi (opsional)
                    if ($payment->invoice->subscription) {
                        $payment->invoice->subscription->update(['status' => 'active']);
                    }
                }

                // C. Kirim Notifikasi (Opsional - Bungkus try-catch agar tidak error SMTP)
                try {
                    // Logika kirim email/WA bisa ditaruh sini
                } catch (\Exception $e) {
                    // Biarkan lanjut meski notifikasi gagal
                }

            } elseif ($request->status === 'rejected') {
                // Jika Ditolak, kembalikan status invoice jadi pending/overdue
                $payment->invoice->update([
                    'status' => 'overdue', 
                ]);
            }
        });

        return redirect()->back()->with('success', 'Status pembayaran diperbarui & Sistem telah diproses.');
    }
}