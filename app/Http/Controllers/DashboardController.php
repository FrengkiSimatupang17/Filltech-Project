<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Subscription; // Import Model Subscription
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // --- LOGIC 1: CLIENT ---
        if ($user->role === 'client') {
            // FIX: Ambil data langganan aktif agar Dashboard tidak minta pilih paket lagi
            $activeSubscription = Subscription::with('package')
                ->where('user_id', $user->id)
                ->where('status', 'active')
                ->first();

            // Ambil tagihan belum bayar (opsional, untuk notifikasi di dashboard)
            $unpaidInvoice = Invoice::where('user_id', $user->id)
                ->where('status', 'unpaid')
                ->latest()
                ->first();

            return Inertia::render('Dashboard/ClientDashboard', [
                'auth' => [
                    'user' => $user,
                ],
                'subscription' => $activeSubscription, // Data ini yang dicari Frontend
                'unpaid_invoice' => $unpaidInvoice,
            ]);
        }

        // --- LOGIC 2: TEKNISI ---
        if ($user->role === 'teknisi') {
            return Inertia::render('Dashboard/TeknisiDashboard');
        }

        // --- LOGIC 3: ADMINISTRATOR (Default) ---
        $stats = [
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'pending_tasks' => 0, 
            'new_clients_monthly' => User::where('role', 'client')
                ->whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->count(),
            'monthly_revenue' => Invoice::where('status', 'paid')
                ->whereMonth('paid_at', Carbon::now()->month)
                ->whereYear('paid_at', Carbon::now()->year)
                ->sum('amount'),
        ];

        $invoices = Invoice::select('amount', 'paid_at')
            ->where('status', 'paid')
            ->whereYear('paid_at', Carbon::now()->year)
            ->get();

        $grouped = $invoices->groupBy(function ($date) {
            return (int) Carbon::parse($date->paid_at)->format('n');
        });

        $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        $chartData = [];

        for ($i = 1; $i <= 12; $i++) {
            $total = isset($grouped[$i]) ? $grouped[$i]->sum('amount') : 0;
            $chartData[] = [
                'month' => $monthNames[$i - 1],
                'total' => $total
            ];
        }

        return Inertia::render('Dashboard/AdminDashboard', [
            'stats' => $stats,
            'chart' => $chartData,
        ]);
    }
}