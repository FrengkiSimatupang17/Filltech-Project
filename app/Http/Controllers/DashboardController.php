<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\Task;
use App\Models\User;
use App\Models\Attendance;
use App\Models\EquipmentLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // ---------------------------------------------------------------------
        // 1. DASHBOARD CLIENT
        // ---------------------------------------------------------------------
        if ($user->role === 'client') {
            $subscription = Subscription::with('package')
                ->where('user_id', $user->id)
                ->latest()
                ->first();

            $unpaidInvoice = Invoice::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'overdue'])
                ->latest()
                ->first();

            return Inertia::render('Dashboard/ClientDashboard', [
                'subscription' => $subscription,
                'unpaid_invoice' => $unpaidInvoice,
            ]);
        }

        // ---------------------------------------------------------------------
        // 2. DASHBOARD TEKNISI
        // ---------------------------------------------------------------------
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

        // ---------------------------------------------------------------------
        // 3. DASHBOARD ADMIN
        // ---------------------------------------------------------------------
        
        // A. Statistik Kartu (Stats)
        $stats = [
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'pending_tasks' => Task::where('status', 'pending')->count(),
            'new_clients_monthly' => User::where('role', 'client')
                ->whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->count(),
            // Pendapatan Bulan Ini (Total amount dari invoice lunas bulan ini)
            'monthly_revenue' => Invoice::where('status', 'paid')
                ->whereMonth('paid_at', Carbon::now()->month)
                ->whereYear('paid_at', Carbon::now()->year)
                ->sum('amount'),
        ];

        // B. Data Grafik Pendapatan (Chart)
        // Logika: Ambil invoice lunas tahun ini, grouping per bulan
        
        // 1. Siapkan array kosong untuk 12 bulan (Jan-Des) dengan nilai 0
        $monthlyRevenue = array_fill(1, 12, 0);

        // 2. Ambil data dari database
        $invoices = Invoice::where('status', 'paid')
            ->whereYear('paid_at', Carbon::now()->year)
            ->get();

        // 3. Masukkan data database ke array bulan
        foreach ($invoices as $invoice) {

            if ($invoice->paid_at) {
                $monthNumber = $invoice->paid_at->month; // Mengembalikan int 1-12
                $monthlyRevenue[$monthNumber] += $invoice->amount;
            }
        }

        // 4. Format ulang agar sesuai dengan Recharts/ChartJS di Frontend
        // Format Output: [ {name: 'Jan', total: 50000}, {name: 'Feb', total: 0}, ... ]
        $chart = [];
        $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        foreach ($monthlyRevenue as $num => $total) {
            $chart[] = [
                'name' => $monthNames[$num - 1], // Ambil nama bulan berdasarkan index
                'total' => $total
            ];
        }

        // Return ke Inertia dengan nama prop 'chart' sesuai request AdminDashboard.jsx
        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'chart' => $chart, 
        ]);
    }
}