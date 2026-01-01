<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
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

        // --- 1. DASHBOARD CLIENT ---
        if ($user->role === 'client') {
            $subscription = Subscription::with('package')->where('user_id', $user->id)->latest()->first();
            $unpaidInvoice = Invoice::where('user_id', $user->id)->whereIn('status', ['pending', 'overdue'])->latest()->first();

            return Inertia::render('Dashboard/ClientDashboard', [
                'subscription' => $subscription,
                'unpaid_invoice' => $unpaidInvoice,
            ]);
        }

        // --- 2. DASHBOARD TEKNISI ---
        if ($user->role === 'teknisi') {
            $teknisiId = $user->id;

            // Note: Tabel tasks masih menggunakan 'technician_user_id' (sesuai migrasi tasks)
            $taskStats = [
                'assigned' => Task::where('technician_user_id', $teknisiId)->where('status', 'assigned')->count(),
                'in_progress' => Task::where('technician_user_id', $teknisiId)->where('status', 'in_progress')->count(),
                'completed_today' => Task::where('technician_user_id', $teknisiId)
                    ->where('status', 'completed')
                    ->whereDate('updated_at', Carbon::today())
                    ->count(),
            ];

            // [FIX] Menggunakan 'user_id' dan 'date' sesuai migrasi attendances
            $todayAttendanceRecord = Attendance::where('user_id', $teknisiId)
                ->where('date', Carbon::today()->toDateString())
                ->first();

            $todayAttendance = null;
            if ($todayAttendanceRecord) {
                // Karena tipe kolom TIME, tidak perlu parsing timezone lagi (sudah string H:i:s)
                $todayAttendance = [
                    'id' => $todayAttendanceRecord->id,
                    'clock_in' => $todayAttendanceRecord->clock_in, 
                    'clock_out' => $todayAttendanceRecord->clock_out,
                ];
            }

            return Inertia::render('Dashboard/TeknisiDashboard', [
                'taskStats' => $taskStats,
                'todayAttendance' => $todayAttendance, 
                'auth' => ['user' => $user]
            ]);
        }

        // --- 3. DASHBOARD ADMIN ---
        if ($user->role === 'administrator' || $user->role === 'admin') {
            // ... (Logic Admin sama seperti sebelumnya) ...
            $stats = [
                'pending_payments' => Payment::where('status', 'pending')->count(),
                'pending_tasks' => Task::where('status', 'pending')->count(),
                'new_clients_monthly' => User::where('role', 'client')->whereMonth('created_at', Carbon::now()->month)->count(),
                'monthly_revenue' => Invoice::where('status', 'paid')->whereMonth('paid_at', Carbon::now()->month)->sum('amount'),
            ];
            
            // Chart Logic Simplified
            $monthlyRevenue = array_fill(1, 12, 0); 
            $invoices = Invoice::where('status', 'paid')->whereYear('paid_at', Carbon::now()->year)->get();
            foreach ($invoices as $invoice) {
                $monthlyRevenue[$invoice->paid_at->month] += $invoice->amount;
            }
            $chart = [];
            $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            foreach ($monthlyRevenue as $num => $total) {
                $chart[] = ['name' => $monthNames[$num - 1], 'total' => $total];
            }

            return Inertia::render('Dashboard/AdminDashboard', [
                'stats' => $stats, 'chart' => $chart
            ]);
        }
        
        return Inertia::render('Dashboard');
    }
}