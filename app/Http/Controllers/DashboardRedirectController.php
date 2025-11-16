<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class DashboardRedirectController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();

        if ($user->role === 'administrator') {
            
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

            return Inertia::render('Dashboard/AdminDashboard', [
                'stats' => $stats
            ]);
        }

        if ($user->role === 'teknisi') {
            return Inertia::render('Dashboard/TeknisiDashboard');
        }

        if ($user->role === 'client') {
            return Inertia::render('Dashboard/ClientDashboard');
        }

        return Inertia::render('Dashboard');
    }
}