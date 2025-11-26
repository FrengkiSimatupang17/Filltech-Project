<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'client') {
            $activeSubscription = \App\Models\Subscription::with('package')
                ->where('user_id', $user->id)
                ->where('status', 'active')
                ->first();

            $unpaidInvoice = Invoice::where('user_id', $user->id)
                ->where('status', 'unpaid')
                ->latest()
                ->first();

            return Inertia::render('Dashboard/ClientDashboard', [
                'auth' => [
                    'user' => $user,
                ],
                'subscription' => $activeSubscription,
                'unpaid_invoice' => $unpaidInvoice,
            ]);
        }

        if ($user->role === 'teknisi') {
            $teknisiId = $user->id;
            
            $taskStats = [
                'assigned' => \App\Models\Task::where('technician_user_id', $teknisiId)->where('status', 'assigned')->count(),
                'in_progress' => \App\Models\Task::where('technician_user_id', $teknisiId)->where('status', 'in_progress')->count(),
                'completed_today' => \App\Models\Task::where('technician_user_id', $teknisiId)
                    ->where('status', 'completed')
                    ->whereDate('completed_at', today())
                    ->count(),
            ];

            $todayAttendance = \App\Models\Attendance::where('technician_user_id', $teknisiId)
                ->whereDate('clock_in', today())
                ->first();
            
            $isClockedIn = $todayAttendance && !$todayAttendance->clock_out;

            return Inertia::render('Dashboard/TeknisiDashboard', [
                'taskStats' => $taskStats,
                'isClockedIn' => $isClockedIn,
                'todayAttendance' => $todayAttendance ? [
                    'clock_in' => $todayAttendance->clock_in->translatedFormat('H:i'),
                    'clock_out' => $todayAttendance->clock_out ? $todayAttendance->clock_out->translatedFormat('H:i') : null,
                ] : null,
            ]);
        }

        // --- ADMINISTRATOR LOGIC ---
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