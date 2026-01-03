<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function index()
    {
        // Ambil data Invoice milik user
        $invoices = Invoice::where('user_id', Auth::id())
            ->with(['subscription.package', 'payment']) // Load relasi payment & paket
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($invoice) {
                // --- TRANSFORMASI DATA UNTUK FRONTEND ---
                return [
                    'id' => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                    'type' => $invoice->type,
                    'amount' => $invoice->amount,
                    'status' => $invoice->status, // status invoice (unpaid/paid)
                    // Pastikan field due_date sudah di-cast ke date di Model Invoice
                    'due_date' => $invoice->due_date ? $invoice->due_date->translatedFormat('d M Y') : '-',
                    // Ambil status dari relasi payment jika ada
                    'payment_status' => $invoice->payment ? $invoice->payment->status : null,
                ];
                // ----------------------------------------
            });

        return Inertia::render('Client/Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function show($id)
    {
        // Kode standar untuk detail
        $invoice = Invoice::with(['subscription.package', 'payment'])
            ->where('id', $id)
            ->where('user_id', Auth::id()) // Pastikan milik user yang login
            ->firstOrFail();

        return Inertia::render('Client/Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * Method untuk download PDF Invoice
     * (Dipertahankan agar Test ExportInvoicePdfTest tetap hijau)
     */
    public function download(Invoice $invoice)
    {
        // 1. Validasi Keamanan: Pastikan invoice milik user yang sedang login
        if ($invoice->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // 2. Load Relasi: Pastikan data user dan paket tersedia untuk view PDF
        $invoice->load(['user', 'subscription.package']);

        // 3. Generate PDF
        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
            'title' => 'Invoice #' . $invoice->invoice_number
        ]);

        // 4. Download file
        return $pdf->download('Invoice-' . $invoice->invoice_number . '.pdf');
    }
}