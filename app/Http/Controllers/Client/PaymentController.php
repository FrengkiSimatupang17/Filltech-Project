<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'payment_proof' => 'required|file|image|max:2048', // 2MB Max
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

        return Redirect::route('client.invoices.index');
    }
}