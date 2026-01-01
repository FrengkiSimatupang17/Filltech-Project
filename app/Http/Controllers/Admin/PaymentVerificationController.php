<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Task;
use App\Models\ActivityLog; // [WAJIB IMPORT]
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
                              $u->where('name', 'like', '%' . $request->search . '%');
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

        DB::transaction(function () use ($request, $payment) {
            
            // 1. Update Pembayaran
            $payment->update([
                'status' => $request->status,
                'rejection_reason' => $request->status === 'rejected' ? $request->rejection_reason : null,
                'verified_at' => now(),
                'verified_by_admin_id' => Auth::id(),
            ]);

            // 2. Logic Tambahan Berdasarkan Status
            if ($request->status === 'verified') {
                $payment->invoice->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);

                // Jika Instalasi -> Buat Task & Aktifkan Langganan
                if ($payment->invoice->type === 'installation') {
                    
                    if ($payment->invoice->subscription) {
                        $payment->invoice->subscription->update([
                            'status' => 'active',
                            'activated_at' => now(),
                        ]);
                    }

                    $client = $payment->invoice->user;
                    
                    // --- [FIX URUTAN ALAMAT] ---
                    // Urutan: Alamat -> RT -> RW -> Blok -> No
                    $parts = [];
                    if (!empty($client->alamat))      $parts[] = $client->alamat;
                    if (!empty($client->rt))          $parts[] = "RT." . $client->rt;
                    if (!empty($client->rw))          $parts[] = "RW." . $client->rw;
                    if (!empty($client->blok))        $parts[] = "Blok " . $client->blok;
                    if (!empty($client->nomor_rumah)) $parts[] = "No. " . $client->nomor_rumah;

                    $alamatLengkap = empty($parts) ? 'Alamat belum dilengkapi di profil' : implode(', ', $parts);
                    $kontak = $client->phone_number ?? '-';

                    Task::create([
                        'client_user_id' => $payment->user_id,
                        'assigned_by_admin_id' => Auth::id(),
                        'title' => 'Instalasi Baru: ' . $client->name,
                        'description' => "Instalasi paket internet baru.\n\nLOKASI:\n$alamatLengkap\n\nKONTAK:\n$kontak",
                        'type' => 'installation',
                        'status' => 'pending', 
                    ]);
                } 
                elseif ($payment->invoice->type === 'monthly') {
                    if ($payment->invoice->subscription) {
                        $payment->invoice->subscription->update(['status' => 'active']);
                    }
                }
            } 
            elseif ($request->status === 'rejected') {
                $payment->invoice->update(['status' => 'overdue']);
            }

            // 3. [FIX] Catat Log Aktivitas Admin (Audit Trail)
            $statusText = $request->status === 'verified' ? 'DITERIMA' : 'DITOLAK';
            $invoiceNum = $payment->invoice ? $payment->invoice->invoice_number : 'Unknown';

            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'verify_payment',
                'event' => 'update', // Sesuai kolom di DB
                'description' => "Memverifikasi pembayaran Invoice #{$invoiceNum} sebagai {$statusText}",
                'ip_address' => $request->ip(),
            ]);
        });

        return redirect()->back()->with('success', 'Status pembayaran diperbarui.');
    }
}