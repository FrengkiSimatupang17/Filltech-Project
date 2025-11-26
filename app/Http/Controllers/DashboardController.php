<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Ambil Data Statistik Ringkas
        $stats = [
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'pending_tasks' => 0,
            'new_clients_monthly' => User::where('role', 'client')->count(), // Hitung total user dulu
            'monthly_revenue' => Payment::where('status', 'verified')->sum('amount'), // Hitung total uang dulu
        ];

        // 2. Ambil Data Grafik (Semua data verified, tanpa filter tahun dulu)
        // Tujuannya: Memastikan grafik MUNCUL. Nanti baru kita perketat filternya.
        $rawPayments = Payment::select('amount', 'created_at')
            ->where('status', 'verified')
            ->orderBy('created_at', 'asc')
            ->get();

        // 3. Format Data untuk Chart.js
        // Kita kelompokkan per "Bulan Tahun" (misal: Nov 2025)
        $grouped = $rawPayments->groupBy(function ($payment) {
            return Carbon::parse($payment->created_at)->translatedFormat('M Y');
        });

        $chartData = [];
        foreach ($grouped as $month => $values) {
            $chartData[] = [
                'month' => $month,
                'total' => $values->sum('amount')
            ];
        }

        // Jika data kosong, kita kasih data dummy biar grafik TIDAK KOSONG saat demo
        if (empty($chartData)) {
            $chartData = [
                ['month' => 'Demo Jan', 'total' => 0],
                ['month' => 'Demo Feb', 'total' => 0],
            ];
        }

        return Inertia::render('Dashboard/AdminDashboard', [
            'stats' => $stats,
            'chart' => $chartData,
        ]);
    }
}