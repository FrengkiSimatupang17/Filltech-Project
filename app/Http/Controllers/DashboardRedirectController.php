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

        // Enforcement Check
        if ($user->role === 'client' && !$user->id_unik) {
            return redirect()->route('profile.complete');
        }

        // ADMIN Dashboard Logic
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

        // TEKNISI Dashboard Logic
        if ($user->role === 'teknisi') {
            return Inertia::render('Dashboard/TeknisiDashboard');
        }

        // CLIENT Dashboard Logic (Enhanced)
        if ($user->role === 'client') {
            $subscription = Subscription::with('package')
                ->where('user_id', $user->id)
                ->where('status', '!=', 'inactive')
                ->first();

            $data = [
                'hasSubscription' => $subscription !== null,
                'subscriptionDetails' => null,
            ];

            if ($subscription) {
                $nextInvoice = Invoice::where('user_id', $user->id)
                    ->where('status', '!=', 'paid')
                    ->orderBy('due_date', 'asc')
                    ->first();

                $data['subscriptionDetails'] = [
                    'package_name' => $subscription->package->name,
                    'package_speed' => $subscription->package->speed,
                    'status' => $subscription->status,
                    'monthly_price' => $subscription->package->price,
                    'next_invoice_due' => $nextInvoice ? $nextInvoice->due_date->format('d M Y') : 'N/A',
                    'next_invoice_amount' => $nextInvoice ? $nextInvoice->amount : 0,
                ];
            }

            return Inertia::render('Dashboard/ClientDashboard', $data);
        }

        return Inertia::render('Dashboard');
    }
}