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
            ->with('payment')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Client/Invoices/Index', [
            'invoices' => $invoices->map(fn ($invoice) => [
                'id' => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'amount' => $invoice->amount,
                'status' => $invoice->status,
                'type' => $invoice->type,
                'due_date' => $invoice->due_date->format('d M Y'),
                'paid_at' => $invoice->paid_at?->format('d M Y H:i'),
                'payment_status' => $invoice->payment?->status,
            ]),
        ]);
    }
}