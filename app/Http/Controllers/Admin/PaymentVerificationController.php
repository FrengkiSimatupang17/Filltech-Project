<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Task;
use App\Models\ActivityLog; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentVerificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['invoice.user', 'invoice.subscription']);

        // 1. Filter Pencarian (ID, Nomor Invoice, Nama Client)
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

        // 2. [TAMBAHAN] Filter Berdasarkan Tipe (installation / monthly)
        if ($request->filled('type')) {
            $query->whereHas('invoice', function ($q) use ($request) {
                $q->where('type', $request->type);
            });
        }

        // Urutkan: Pending di atas, lalu yang terbaru
        $payments = $query->orderByRaw("CASE WHEN status = 'pending' THEN 1 ELSE 2 END")
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'type']), // Kirim filter type ke frontend
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

            // 2. Logic Berdasarkan Status & Tipe Invoice
            if ($request->status === 'verified') {
                $payment->invoice->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);

                // JIKA INVOICE INSTALASI
                if ($payment->invoice->type === 'installation') {
                    // Aktifkan Langganan
                    if ($payment->invoice->subscription) {
                        $payment->invoice->subscription->update([
                            'status' => 'active',
                            'activated_at' => now(),
                        ]);
                    }

                    // Buat Tugas Instalasi untuk Teknisi
                    $client = $payment->invoice->user;
                    $parts = [];
                    if (!empty($client->alamat))      $parts[] = $client->alamat;
                    if (!empty($client->rt))          $parts[] = "RT." . $client->rt;
                    if (!empty($client->rw))          $parts[] = "RW." . $client->rw;
                    if (!empty($client->blok))        $parts[] = "Blok " . $client->blok;
                    if (!empty($client->nomor_rumah)) $parts[] = "No. " . $client->nomor_rumah;

                    $alamatLengkap = empty($parts) ? 'Alamat belum dilengkapi di profil' : implode(', ', $parts);
                    $kontak = $client->phone ?? $client->phone_number ?? '-';

                    Task::create([
                        'client_user_id' => $payment->user_id,
                        'assigned_by_admin_id' => Auth::id(),
                        'title' => 'Instalasi Baru: ' . $client->name,
                        'description' => "Instalasi paket internet baru.\n\nLOKASI:\n$alamatLengkap\n\nKONTAK:\n$kontak",
                        'type' => 'installation',
                        'status' => 'pending', 
                    ]);
                } 
                // JIKA INVOICE BULANAN
                elseif ($payment->invoice->type === 'monthly') {
                    if ($payment->invoice->subscription) {
                        $payment->invoice->subscription->update(['status' => 'active']);
                    }
                }
            } 
            elseif ($request->status === 'rejected') {
                $payment->invoice->update(['status' => 'overdue']);
            }

            // 3. Catat Log Aktivitas Admin
            $statusText = $request->status === 'verified' ? 'DITERIMA' : 'DITOLAK';
            $invoiceNum = $payment->invoice ? $payment->invoice->invoice_number : 'Unknown';

            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'verify_payment',
                'event' => 'update',
                'description' => "Memverifikasi pembayaran Invoice #{$invoiceNum} sebagai {$statusText}",
                'ip_address' => $request->ip(),
            ]);
        });

        return redirect()->back()->with('success', 'Status pembayaran diperbarui.');
    }
}