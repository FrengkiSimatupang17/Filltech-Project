<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Auth::user()->invoices()
            ->with('payment') // Eager load relasi payment
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(fn ($invoice) => [
                'id' => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'amount' => $invoice->amount,
                'status' => $invoice->status,
                'type' => $invoice->type,
                // Menggunakan translatedFormat agar tanggal Bahasa Indonesia (jika locale ID diatur)
                'due_date' => $invoice->due_date ? $invoice->due_date->translatedFormat('d M Y') : '-',
                'paid_at' => $invoice->paid_at ? $invoice->paid_at->translatedFormat('d M Y H:i') : null,
                'payment_status' => $invoice->payment ? $invoice->payment->status : null,
            ]);

        return Inertia::render('Client/Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }
}