<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Menampilkan daftar tagihan milik user yang sedang login.
     */
    public function index()
    {
        // [KEAMANAN 1] Ambil invoice HANYA yang 'user_id'-nya sama dengan Auth::id()
        $invoices = Invoice::where('user_id', Auth::id())
            ->with(['subscription.package']) // Load data relasi paket agar bisa tampil nama paketnya
            ->orderBy('created_at', 'desc')
            ->paginate(10); // Gunakan pagination agar halaman tidak berat

        return Inertia::render('Client/Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    /**
     * Menampilkan detail satu tagihan spesifik.
     * (Jika Anda nanti menambahkan fitur "Lihat Detail Invoice")
     */
    public function show($id)
    {
        // [KEAMANAN 2 - KRUSIAL] Proteksi IDOR
        // Jangan gunakan Invoice::find($id)! Itu membuat data bocor.
        // Gunakan where('user_id', Auth::id()) untuk memastikan kepemilikan.
        
        $invoice = Invoice::with(['subscription.package', 'payment'])
            ->where('id', $id)
            ->where('user_id', Auth::id()) // <--- INI KUNCI KEAMANANNYA
            ->firstOrFail(); // Jika bukan miliknya, akan otomatis error 404 Not Found

        return Inertia::render('Client/Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * (Opsional) Fitur Cetak PDF
     */
    public function print($id)
    {
        $invoice = Invoice::with(['user', 'subscription.package'])
            ->where('id', $id)
            ->where('user_id', Auth::id()) // <--- Proteksi IDOR juga disini
            ->firstOrFail();

        // Logika cetak PDF (jika Anda menggunakan dompdf/browsershot)
        // return view('invoices.pdf', compact('invoice'));
        
        // Sementara return data saja jika belum ada view PDF
        return response()->json($invoice);
    }
}