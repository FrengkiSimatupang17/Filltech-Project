<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\Task;
use App\Notifications\PaymentVerifiedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentVerificationController extends Controller
{
    public function index()
    {
        $payments = Payment::with(['user', 'invoice'])
            ->orderByRaw("CASE WHEN status = 'pending' THEN 1 ELSE 2 END")
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(fn ($payment) => [
                'id' => $payment->id,
                'user_name' => $payment->user->name ?? 'User Terhapus',
                'user_email' => $payment->user->email ?? '-',
                'invoice_number' => $payment->invoice->invoice_number ?? '-',
                'invoice_type' => $payment->invoice->type ?? 'general',
                'amount' => $payment->amount,
                'status' => $payment->status,
                'payment_proof_url' => $payment->payment_proof_path ? Storage::url($payment->payment_proof_path) : null,
                'created_at' => $payment->created_at->translatedFormat('d M Y, H:i'),
            ]);

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
        ]);

        if ($payment->status !== 'pending') {
            return Redirect::back()->with('error', 'Pembayaran ini sudah diproses sebelumnya.');
        }

        if ($request->action === 'approve') {
            $this->approvePayment($payment);
            return Redirect::back()->with('success', 'Pembayaran berhasil disetujui.');
        } else {
            $this->rejectPayment($payment);
            return Redirect::back()->with('success', 'Pembayaran telah ditolak.');
        }
    }

    private function approvePayment(Payment $payment)
    {
        DB::transaction(function () use ($payment) {
            $payment->update([
                'status' => 'verified',
                'verified_at' => now(),
                'verified_by_admin_id' => Auth::id(),
            ]);

            $invoice = $payment->invoice;
            if ($invoice) {
                $invoice->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);
            }

            if (function_exists('activity')) {
                activity()
                    ->causedBy(Auth::user())
                    ->performedOn($payment)
                    ->log("Menyetujui pembayaran " . ($invoice->invoice_number ?? ''));
            }

            if ($payment->user) {
                $payment->user->notify(new PaymentVerifiedNotification($payment));
            }

            if ($invoice && $invoice->type === 'installation' && $invoice->subscription_id) {
                $subscription = Subscription::find($invoice->subscription_id);
                
                if ($subscription && $subscription->status === 'pending') {
                    $subscription->update([
                        'status' => 'active',
                        'activated_at' => now(),
                    ]);

                    Task::create([
                        'client_user_id' => $subscription->user_id,
                        'assigned_by_admin_id' => Auth::id(),
                        'title' => 'Pemasangan Baru - ' . ($subscription->user->name ?? 'Client'),
                        'description' => 'Lakukan pemasangan WiFi paket ' . ($subscription->package->name ?? 'Unknown'),
                        'type' => 'installation',
                        'status' => 'pending',
                        'priority' => 'high',
                    ]);
                }
            }
        });
    }

    private function rejectPayment(Payment $payment)
    {
        $payment->update([
            'status' => 'rejected',
            'verified_at' => now(),
            'verified_by_admin_id' => Auth::id(),
        ]);
        
        if (function_exists('activity')) {
            activity()
                ->causedBy(Auth::user())
                ->performedOn($payment)
                ->log("Menolak pembayaran ID: {$payment->id}");
        }
    }
}