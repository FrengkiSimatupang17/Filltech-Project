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
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'payment_proof' => 'required|file|mimes:jpeg,png,jpg,pdf|max:4096',
        ]);

        $invoice = Invoice::findOrFail($request->invoice_id);

        if ($invoice->user_id !== Auth::id() || $invoice->status !== 'pending') {
            abort(403, 'Anda tidak diizinkan melakukan aksi ini.');
        }

        if ($invoice->payment()->whereIn('status', ['pending', 'verified'])->exists()) {
            return Redirect::route('client.invoices.index')
                ->with('error', 'Pembayaran untuk tagihan ini sudah diunggah.');
        }

        try {
           
            $file = $request->file('payment_proof');
            $filename = Str::random(40) . '.' . $file->extension();
 
            $path = $file->storeAs('payment-proofs', $filename, 'public');

            DB::transaction(function () use ($invoice, $path) {
                Payment::create([
                    'invoice_id' => $invoice->id,
                    'user_id' => Auth::id(),
                    'amount' => $invoice->amount,
                    'payment_proof_path' => $path,
                    'status' => 'pending',
                ]);

                $admins = User::admins()->get();
                Notification::send($admins, new SystemAlert(
                    'Verifikasi Pembayaran Baru: Rp ' . number_format($invoice->amount, 0, ',', '.'),
                    route('admin.payments.index'),
                    'payment'
                ));
            });

            return Redirect::route('client.invoices.index')->with('success', 'Bukti pembayaran berhasil diunggah.');
        } catch (\Exception $e) {
            Log::error('Payment upload failed: '.$e->getMessage(), ['invoice_id' => $request->invoice_id, 'user_id' => Auth::id()]);
            return Redirect::route('client.invoices.index')->with('error', 'Terjadi kesalahan saat mengunggah bukti pembayaran. Silakan coba lagi.');
        }
    }
}