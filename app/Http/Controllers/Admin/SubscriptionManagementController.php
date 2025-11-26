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
    public function index(Request $request)
    {
        $query = Subscription::with(['user', 'package']);

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('user', function ($u) use ($request) {
                    $u->where('name', 'like', '%' . $request->search . '%')
                      ->orWhere('email', 'like', '%' . $request->search . '%');
                })->orWhereHas('package', function ($p) use ($request) {
                    $p->where('name', 'like', '%' . $request->search . '%');
                });
            });
        }

        $subscriptions = $query->orderByRaw("CASE WHEN status = 'pending' THEN 1 ELSE 2 END")
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($sub) => [
                'id' => $sub->id,
                'user_name' => $sub->user->name,
                'user_email' => $sub->user->email,
                'package_name' => $sub->package->name,
                'package_price' => $sub->package->price,
                'status' => $sub->status,
                'created_at' => $sub->created_at->translatedFormat('d M Y'),
                'has_installation_invoice' => $sub->user->invoices()
                    ->where('type', 'installation')
                    ->whereIn('status', ['pending', 'paid'])
                    ->exists(),
            ]);

        return Inertia::render('Admin/Subscriptions/Index', [
            'subscriptions' => $subscriptions,
            'filters' => $request->only(['search']),
        ]);
    }

    public function storeInstallationInvoice(Request $request, Subscription $subscription)
    {
        $user = $subscription->user;

        $existingInvoice = $user->invoices()
            ->where('type', 'installation')
            ->whereIn('status', ['pending', 'paid'])
            ->exists();

        if ($existingInvoice) {
            return Redirect::route('admin.subscriptions.index')
                ->with('error', 'Klien ini sudah memiliki tagihan instalasi.');
        }

        $amount = $subscription->package->price;

        $invoice = Invoice::create([
            'user_id' => $user->id,
            'subscription_id' => $subscription->id,
            'invoice_number' => 'INV-' . time() . '-' . $user->id,
            'amount' => $amount,
            'status' => 'pending',
            'type' => 'installation',
            'due_date' => now()->addDays(7),
        ]);

        $user->notify(new NewInvoiceNotification($invoice));

        return Redirect::route('admin.subscriptions.index')
            ->with('success', 'Tagihan instalasi berhasil dibuat senilai Rp ' . number_format($amount, 0, ',', '.'));
    }
}