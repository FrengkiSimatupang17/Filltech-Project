<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\Task;
use App\Models\User;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // --- DASHBOARD CLIENT ---
        if ($user->role === 'client') {
            $subscription = Subscription::with('package')->where('user_id', $user->id)->latest()->first();
            $unpaidInvoice = Invoice::where('user_id', $user->id)->whereIn('status', ['pending', 'overdue'])->latest()->first();

            return Inertia::render('Dashboard/ClientDashboard', [
                'subscription' => $subscription,
                'unpaid_invoice' => $unpaidInvoice,
            ]);
        }

        // --- DASHBOARD TEKNISI ---
        if ($user->role === 'teknisi') {
            $teknisiId = $user->id;
            $taskStats = [
                'assigned' => Task::where('technician_user_id', $teknisiId)->where('status', 'assigned')->count(),
                'in_progress' => Task::where('technician_user_id', $teknisiId)->where('status', 'in_progress')->count(),
                'completed_today' => Task::where('technician_user_id', $teknisiId)->where('status', 'completed')->whereDate('updated_at', Carbon::today())->count(),
            ];
            $todayAttendance = Attendance::where('technician_user_id', $teknisiId)->whereDate('clock_in', Carbon::today())->first();

            return Inertia::render('Dashboard/TeknisiDashboard', [
                'taskStats' => $taskStats,
                'todayAttendance' => $todayAttendance ? [
                    'clock_in' => $todayAttendance->clock_in->timezone('Asia/Jakarta')->format('H:i'),
                    'clock_out' => $todayAttendance->clock_out ? $todayAttendance->clock_out->timezone('Asia/Jakarta')->format('H:i') : null,
                ] : null,
                'isClockedIn' => $todayAttendance && !$todayAttendance->clock_out,
            ]);
        }

        // --- DASHBOARD ADMIN ---
        
        // 1. Statistik Kartu
        $stats = [
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'pending_tasks' => Task::where('status', 'pending')->count(),
            'new_clients_monthly' => User::where('role', 'client')
                ->whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->count(),
            'monthly_revenue' => Invoice::where('status', 'paid')
                ->whereMonth('paid_at', Carbon::now()->month)
                ->whereYear('paid_at', Carbon::now()->year)
                ->sum('amount'),
        ];

        // 2. Logika Grafik (PASTIKAN MENGGUNAKAN PAID_AT)
        $monthlyRevenue = array_fill(1, 12, 0); // Array kosong Jan-Des

        // Ambil data invoice LUNAS tahun ini yang punya tanggal bayar
        $invoices = Invoice::where('status', 'paid')
            ->whereYear('paid_at', Carbon::now()->year)
            ->whereNotNull('paid_at')
            ->get();

        foreach ($invoices as $invoice) {
            // Karena di Model sudah dicasting datetime, kita bisa akses ->month
            $monthNumber = $invoice->paid_at->month; 
            $monthlyRevenue[$monthNumber] += $invoice->amount;
        }

        // Format untuk Recharts / Frontend
        $chart = [];
        $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        foreach ($monthlyRevenue as $num => $total) {
            $chart[] = [
                'name' => $monthNames[$num - 1],
                'total' => $total
            ];
        }

        // [FIX PATH] Pastikan ini mengarah ke file di resources/js/Pages/Dashboard/AdminDashboard.jsx
        return Inertia::render('Dashboard/AdminDashboard', [
            'stats' => $stats,
            'chart' => $chart, 
        ]);
    }
}