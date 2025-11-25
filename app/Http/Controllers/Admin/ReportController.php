<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());

        $query = Invoice::where('status', 'paid')
            ->whereBetween('paid_at', [$startDate, Carbon::parse($endDate)->endOfDay()]);

        $totalRevenue = $query->sum('amount');
        $totalInvoices = $query->count();

        $dailyBreakdown = (clone $query)->get(['paid_at', 'amount'])
            ->groupBy(function ($invoice) {
                return Carbon::parse($invoice->paid_at)->format('Y-m-d');
            })->map(function ($day) {
                return $day->sum('amount');
            });

        $transactions = $query->orderBy('paid_at', 'desc')
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($inv) => [
                'id' => $inv->id,
                'invoice_number' => $inv->invoice_number,
                'paid_at' => Carbon::parse($inv->paid_at)->translatedFormat('d M Y, H:i'),
                'amount' => $inv->amount,
            ]);

        return Inertia::render('Admin/Reports/Index', [
            'reports' => [
                'total_revenue' => $totalRevenue,
                'total_invoices' => $totalInvoices,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'daily_breakdown' => $dailyBreakdown,
                'transactions' => $transactions,
            ],
        ]);
    }
}