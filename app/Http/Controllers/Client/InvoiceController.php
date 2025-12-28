<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        // Ambil data Invoice milik user
        $invoices = Invoice::where('user_id', Auth::id())
            ->with(['subscription.package', 'payment']) // Load relasi payment
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($invoice) {
                // --- BAGIAN INI YANG PENTING ---
                // Kita merapikan data agar Frontend mudah membacanya
                return [
                    'id' => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                    'type' => $invoice->type,
                    'amount' => $invoice->amount,
                    'status' => $invoice->status, // status invoice (pending/paid)
                    'due_date' => $invoice->due_date ? $invoice->due_date->translatedFormat('d M Y') : '-',
                    'payment_status' => $invoice->payment ? $invoice->payment->status : null,
                ];
                // -------------------------------
            });

        return Inertia::render('Client/Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function show($id)
    {
        // Kode standar untuk detail, tidak perlu diubah yang aneh-aneh
        $invoice = Invoice::with(['subscription.package', 'payment'])
            ->where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('Client/Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }
}