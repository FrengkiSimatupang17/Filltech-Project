<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Exports\FinancialReportExport; // Pastikan class Export diimport
use Maatwebsite\Excel\Facades\Excel;   // Pastikan library Excel diimport

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['invoice.user']);

        // 1. Filter Tanggal Start
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        // 2. Filter Tanggal End
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // 3. Filter RT
        if ($request->filled('rt')) {
            $query->whereHas('invoice.user', function ($q) use ($request) {
                $q->where('rt', $request->rt);
            });
        }

        // 4. Filter RW
        if ($request->filled('rw')) {
            $query->whereHas('invoice.user', function ($q) use ($request) {
                $q->where('rw', $request->rw);
            });
        }

        // Status verified
        $query->where('status', 'verified');

        // Data untuk Tabel (Pagination)
        $payments = $query->latest()->paginate(10)->withQueryString();

        // Hitung Total Uang & Total Jumlah Data untuk Preview
        $summaryQuery = $query->clone();
        $totalRevenue = $summaryQuery->sum('amount');
        $totalTransactions = $summaryQuery->count();

        // Data Dropdown
        $availableRt = User::select('rt')->whereNotNull('rt')->where('rt', '!=', '-')->distinct()->orderBy('rt')->pluck('rt');
        $availableRw = User::select('rw')->whereNotNull('rw')->where('rw', '!=', '-')->distinct()->orderBy('rw')->pluck('rw');

        return Inertia::render('Admin/Reports/Index', [
            'payments' => $payments,
            'filters' => $request->only(['start_date', 'end_date', 'rt', 'rw']),
            'totalRevenue' => $totalRevenue,
            'totalTransactions' => $totalTransactions,
            'availableRt' => $availableRt,
            'availableRw' => $availableRw,
        ]);
    }

    /**
     * Export ke Excel (XLSX) dengan tampilan cantik
     */
    public function export(Request $request)
    {
        // Ambil filter dari request
        $filters = $request->only(['start_date', 'end_date', 'rt', 'rw']);
        
        // Buat nama file yang dinamis berdasarkan tanggal
        $dateStr = now()->format('Y-m-d_His');
        $fileName = "Laporan_Keuangan_{$dateStr}.xlsx";

        // Panggil class Export yang sudah kita buat sebelumnya
        // Class ini akan menangani filter RT, RW, dan Tanggal secara otomatis
        return Excel::download(new FinancialReportExport($filters), $fileName);
    }
}