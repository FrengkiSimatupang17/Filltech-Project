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
        // 1. LOGIKA DASHBOARD CLIENT
        // =========================================================================
        if ($user->role === 'client') {
            $subscription = Subscription::with('package')
                ->where('user_id', $user->id)
                ->latest()
                ->first();

            $unpaidInvoice = Invoice::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'overdue']) // Cek status pending/overdue
                ->latest()
                ->first();

            return Inertia::render('Dashboard/ClientDashboard', [
                'subscription' => $subscription,
                'unpaid_invoice' => $unpaidInvoice,
            ]);
        }

        // =========================================================================
        // 2. LOGIKA DASHBOARD TEKNISI
        // =========================================================================
        if ($user->role === 'teknisi') {
            $teknisiId = $user->id;

            $taskStats = [
                'assigned' => Task::where('technician_user_id', $teknisiId)->where('status', 'assigned')->count(),
                'in_progress' => Task::where('technician_user_id', $teknisiId)->where('status', 'in_progress')->count(),
                'completed_today' => Task::where('technician_user_id', $teknisiId)
                    ->where('status', 'completed')
                    ->whereDate('updated_at', Carbon::today())
                    ->count(),
            ];

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
        
        // A. Statistik Kartu (Card Stats)
        $stats = [
            'total_clients' => User::where('role', 'client')->count(),
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'pending_tasks' => Task::where('status', 'pending')->count(), // Tugas belum di-assign
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            
            // Pendapatan Bulan Ini (Berdasarkan tanggal BAYAR, bukan tanggal buat)
            'monthly_revenue' => Invoice::where('status', 'paid')
                ->whereYear('paid_at', Carbon::now()->year)
                ->whereMonth('paid_at', Carbon::now()->month)
                ->sum('amount'),
                
            'new_clients_monthly' => User::where('role', 'client')
                ->whereMonth('created_at', Carbon::now()->month)
                ->count(),
        ];

        // B. Data Grafik (Chart Data) - Berdasarkan Tanggal Bayar (paid_at)
        // Kita ambil semua invoice lunas tahun ini
        $paidInvoices = Invoice::where('status', 'paid')
            ->whereYear('paid_at', Carbon::now()->year)
            ->get();

        // Kelompokkan berdasarkan Bulan (1-12)
        $groupedRevenue = $paidInvoices->groupBy(function ($inv) {
            // Pastikan paid_at tidak null (safety check)
            return $inv->paid_at ? (int)$inv->paid_at->format('n') : 0;
        });

        $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        $chartData = [];

        // Loop 12 bulan untuk mengisi data (termasuk bulan kosong dengan nilai 0)
        for ($i = 1; $i <= 12; $i++) {
            $chartData[] = [
                'name' => $monthNames[$i - 1],
                'total' => isset($groupedRevenue[$i]) ? $groupedRevenue[$i]->sum('amount') : 0,
            ];
        }

        return Inertia::render('Dashboard/AdminDashboard', [
            'stats' => $stats,
            'chartData' => $chartData,
        ]);
    }
}