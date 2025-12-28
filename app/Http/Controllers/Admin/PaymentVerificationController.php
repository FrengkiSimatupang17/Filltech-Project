<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Task;
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

        // Fitur Anda: Pending selalu di atas (Sangat Bagus, Pertahankan)
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

        // [PENGAMAN] Bungkus semua logika Anda dalam Transaction
        DB::transaction(function () use ($request, $payment) {
            
            // 1. Update Status Pembayaran (Logika Asli Anda + Timestamp)
            $payment->update([
                'status' => $request->status,
                'rejection_reason' => $request->status === 'rejected' ? $request->rejection_reason : null,
                'verified_at' => now(),
                'verified_by_admin_id' => Auth::id(), // Audit Trail
            ]);

            // 2. Jika DITERIMA (Verified)
            if ($request->status === 'verified') {
                
                // Update Invoice jadi LUNAS (Wajib ada paid_at)
                $payment->invoice->update([
                    'status' => 'paid',
                    'paid_at' => now(), 
                ]);

                // LOGIKA BISNIS ANDA (TIDAK DIKURANGI)
                // Cek tipe invoice: Instalasi atau Bulanan?
                if ($payment->invoice->type === 'installation') {
                    
                    // a. Aktifkan Subscription
                    if ($payment->invoice->subscription) {
                        $payment->invoice->subscription->update([
                            'status' => 'active',
                            'activated_at' => now(),
                        ]);
                    }

                    // b. Buat Tugas Teknisi Otomatis (Fitur Penting Anda)
                    Task::create([
                        'client_user_id' => $payment->user_id,
                        'assigned_by_admin_id' => Auth::id(),
                        'title' => 'Instalasi Baru: ' . $payment->invoice->user->name,
                        'description' => 'Pemasangan paket internet baru (Auto-generated from Payment). Segera hubungi pelanggan.',
                        'type' => 'installation',
                        'status' => 'pending', 
                    ]);
                } 
                elseif ($payment->invoice->type === 'monthly') {
                    // Jika bulanan, pastikan sub tetap aktif
                    if ($payment->invoice->subscription) {
                        $payment->invoice->subscription->update(['status' => 'active']);
                    }
                }

            } elseif ($request->status === 'rejected') {
                // Logika Anda: Jika ditolak, invoice jadi overdue agar user sadar
                $payment->invoice->update([
                    'status' => 'overdue', 
                ]);
            }
        });

        return redirect()->back()->with('success', 'Status pembayaran berhasil diperbarui.');
    }
}