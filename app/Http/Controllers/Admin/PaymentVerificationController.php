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
                'user_name' => $payment->user->name,
                'user_email' => $payment->user->email,
                'invoice_number' => $payment->invoice->invoice_number,
                'invoice_type' => $payment->invoice->type,
                'amount' => $payment->amount,
                'status' => $payment->status,
                'payment_proof_path' => $payment->payment_proof_path, 
                'payment_proof_url' => Storage::url($payment->payment_proof_path),
                'created_at' => $payment->created_at->format('d M Y H:i'),
            ]);

        return Inertia::render('Admin/Payments/Index', [
            'pending_payments' => $payments,
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
        ]);

        if ($payment->status !== 'pending') {
            return Redirect::route('admin.payments.index')->with('error', 'Pembayaran ini sudah diproses.');
        }

        if ($request->action === 'approve') {
            $this->approvePayment($payment);
            return Redirect::route('admin.payments.index')->with('success', 'Pembayaran berhasil diverifikasi.');
        } else {
            $this->rejectPayment($payment);
            return Redirect::route('admin.payments.index')->with('success', 'Pembayaran ditolak.');
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
            $invoice->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            activity()
                ->causedBy(Auth::user())
                ->performedOn($payment)
                ->log("Menyetujui pembayaran untuk tagihan {$invoice->invoice_number}");

            $payment->user->notify(new PaymentVerifiedNotification($payment));

            if ($invoice->type === 'installation' && $invoice->subscription_id) {
                $subscription = Subscription::find($invoice->subscription_id);
                if ($subscription && $subscription->status === 'pending') {
                    $subscription->update([
                        'status' => 'active',
                        'activated_at' => now(),
                    ]);

                    Task::create([
                        'client_user_id' => $subscription->user_id,
                        'assigned_by_admin_id' => Auth::id(),
                        'title' => 'Pemasangan Baru - ' . $subscription->user->name,
                        'description' => 'Lakukan pemasangan baru untuk ' . $subscription->user->name . ' (' . $subscription->package->name . ')',
                        'type' => 'installation',
                        'status' => 'pending',
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

        activity()
            ->causedBy(Auth::user())
            ->performedOn($payment)
            ->log("Menolak pembayaran untuk tagihan {$payment->invoice->invoice_number}");
    }
}