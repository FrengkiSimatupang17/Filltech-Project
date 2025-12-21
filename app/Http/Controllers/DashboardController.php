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

        // =========================================================================
        // 1. LOGIKA DASHBOARD CLIENT (PELANGGAN)
        // =========================================================================
        if ($user->role === 'client') {
            
            // Ambil langganan terakhir
            $subscription = Subscription::with('package')
                ->where('user_id', $user->id)
                ->latest()
                ->first();

            // Ambil tagihan yang belum dibayar
            $unpaidInvoice = Invoice::where('user_id', $user->id)
                ->whereIn('status', ['unpaid', 'overdue','pending'])
                ->latest()
                ->first();

            return Inertia::render('Dashboard/ClientDashboard', [
                'subscription' => $subscription,
                'unpaid_invoice' => $unpaidInvoice,
                'auth' => ['user' => $user], 
            ]);
        }

        // =========================================================================
        // 2. LOGIKA DASHBOARD TEKNISI (PERBAIKAN DISINI)
        // =========================================================================
        if ($user->role === 'teknisi') {
            $teknisiId = $user->id;

            // Statistik Tugas
            // KITAU UBAH 'technician_id' MENJADI 'technician_user_id'
            $taskStats = [
                'assigned' => Task::where('technician_user_id', $teknisiId)->where('status', 'assigned')->count(),
                'in_progress' => Task::where('technician_user_id', $teknisiId)->where('status', 'in_progress')->count(),
                'completed_today' => Task::where('technician_user_id', $teknisiId)
                    ->where('status', 'completed')
                    ->whereDate('updated_at', Carbon::today())
                    ->count(),
            ];

            // Cek Absensi Hari Ini
            $todayAttendance = Attendance::where('technician_user_id', $teknisiId)
                ->whereDate('clock_in', Carbon::today())
                ->first();

            $isClockedIn = $todayAttendance && !$todayAttendance->clock_out;

            return Inertia::render('Dashboard/TeknisiDashboard', [
                'taskStats' => $taskStats,
                'todayAttendance' => $todayAttendance ? [
                    'clock_in' => $todayAttendance->clock_in->timezone('Asia/Jakarta')->format('H:i'),
                    'clock_out' => $todayAttendance->clock_out ? $todayAttendance->clock_out->timezone('Asia/Jakarta')->format('H:i') : null,
                ] : null,
                'isClockedIn' => $isClockedIn,
            ]);
        }

        // =========================================================================
        // 3. LOGIKA DASHBOARD ADMINISTRATOR
        // =========================================================================
        
        $stats = [
            'total_clients' => User::where('role', 'client')->count(),
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'monthly_revenue' => Invoice::where('status', 'paid')
                ->whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->sum('amount'),
            'new_clients_monthly' => User::where('role', 'client')
                ->whereMonth('created_at', Carbon::now()->month)
                ->count(),
        ];

        $invoices = Invoice::select('amount', 'created_at')
            ->where('status', 'paid')
            ->whereYear('created_at', Carbon::now()->year)
            ->get();

        $grouped = $invoices->groupBy(function ($date) {
            return (int) Carbon::parse($date->created_at)->format('n'); 
        });

        $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        $chartData = [];

        for ($i = 1; $i <= 12; $i++) {
            $total = isset($grouped[$i]) ? $grouped[$i]->sum('amount') : 0;
            $chartData[] = [
                'name' => $monthNames[$i - 1], 
                'total' => $total,             
            ];
        }

        return Inertia::render('Dashboard/AdminDashboard', [
            'stats' => $stats,
            'chartData' => $chartData, 
        ]);
    }
}