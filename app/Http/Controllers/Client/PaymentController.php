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
        $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'payment_proof' => 'required|file|image|max:2048',
        ]);

        $invoice = Invoice::findOrFail($request->invoice_id);

        if ($invoice->user_id !== Auth::id() || $invoice->status !== 'pending') {
            abort(403, 'Anda tidak diizinkan melakukan aksi ini.');
        }

        if ($invoice->payment()->whereIn('status', ['pending', 'verified'])->exists()) {
            return Redirect::route('client.invoices.index')
                ->with('error', 'Pembayaran untuk tagihan ini sudah diunggah.');
        }

        $path = $request->file('payment_proof')->store('payment-proofs', 'public');

        Payment::create([
            'invoice_id' => $invoice->id,
            'user_id' => Auth::id(),
            'amount' => $invoice->amount,
            'payment_proof_path' => $path,
            'status' => 'pending',
        ]);

        $admins = User::where('role', 'administrator')->get();
        Notification::send($admins, new SystemAlert(
            'Verifikasi Pembayaran Baru: Rp ' . number_format($invoice->amount, 0, ',', '.'),
            route('admin.payments.index'),
            'payment'
        ));

        return Redirect::route('client.invoices.index')->with('success', 'Bukti pembayaran berhasil diunggah.');
    }
}