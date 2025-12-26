<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentVerificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['invoice.user']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                // Cari berdasarkan ID Transaksi (Payment ID) atau Invoice Number
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

        // Urutkan status 'pending' paling atas, lalu tanggal terbaru
        $payments = $query->orderByRaw("CASE WHEN status = 'pending' THEN 1 ELSE 2 END")
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            // [FIX] Tambahkan baris ini agar error "filters undefined" hilang
            'filters' => $request->only(['search']), 
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        // Validasi input
        $request->validate([
            'status' => 'required|in:verified,rejected',
            'rejection_reason' => 'nullable|string|required_if:status,rejected',
        ]);

        $data = $request->only(['status', 'rejection_reason']);

        // Update status pembayaran
        $payment->update($data);

        // Update status invoice terkait
        if ($request->status === 'verified') {
            $payment->invoice->update([
                'status' => 'paid',
                'payment_status' => 'verified', // Pastikan kolom ini ada di migration invoice
                'paid_at' => now(),
            ]);

            // Di sini bisa ditambahkan logika untuk mengaktifkan Subscription user
            // $payment->invoice->subscription->update(['status' => 'active']);
        } elseif ($request->status === 'rejected') {
            $payment->invoice->update([
                'payment_status' => 'failed',
            ]);
        }

        return redirect()->back()->with('success', 'Status pembayaran berhasil diperbarui.');
    }
}