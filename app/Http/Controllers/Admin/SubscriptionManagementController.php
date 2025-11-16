<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Subscription;
use App\Notifications\NewInvoiceNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SubscriptionManagementController extends Controller
{
    public function index()
    {
        $subscriptions = Subscription::with(['user', 'package'])
            ->orderByRaw("CASE WHEN status = 'pending' THEN 1 ELSE 2 END")
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Subscriptions/Index', [
            'subscriptions' => $subscriptions->map(fn ($sub) => [
                'id' => $sub->id,
                'user_name' => $sub->user->name,
                'user_email' => $sub->user->email,
                'package_name' => $sub->package->name,
                'status' => $sub->status,
                'created_at' => $sub->created_at->format('d M Y H:i'),
                'has_installation_invoice' => $sub->user->invoices()
                    ->where('type', 'installation')
                    ->whereIn('status', ['pending', 'paid'])
                    ->exists(),
            ]),
        ]);
    }

    public function storeInstallationInvoice(Request $request, Subscription $subscription)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $user = $subscription->user;

        $existingInvoice = $user->invoices()
            ->where('type', 'installation')
            ->whereIn('status', ['pending', 'paid'])
            ->exists();

        if ($existingInvoice) {
            return Redirect::route('admin.subscriptions.index')
                ->with('error', 'Klien ini sudah memiliki tagihan instalasi.');
        }

        $invoice = Invoice::create([
            'user_id' => $user->id,
            'subscription_id' => $subscription->id,
            'invoice_number' => 'INV-' . time() . '-' . $user->id,
            'amount' => $request->amount,
            'status' => 'pending',
            'type' => 'installation',
            'due_date' => now()->addDays(7),
        ]);

        $user->notify(new NewInvoiceNotification($invoice));

        return Redirect::route('admin.subscriptions.index');
    }
}