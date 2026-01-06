<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Subscription;
use App\Services\BillingCalculator;
use App\Notifications\NewInvoiceNotification;
use Barryvdh\DomPDF\Facade\Pdf; // [WAJIB] Agar fitur download PDF jalan
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SubscriptionManagementController extends Controller
{
    protected $billingCalculator;

    public function __construct(BillingCalculator $billingCalculator)
    {
        $this->billingCalculator = $billingCalculator;
    }

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
        $package = $subscription->package;

        // 1. Cek Double Invoice
        $existingInvoice = $user->invoices()
            ->where('type', 'installation')
            ->whereIn('status', ['pending', 'paid'])
            ->exists();

        if ($existingInvoice) {
            return Redirect::route('admin.subscriptions.index')
                ->with('error', 'Klien ini sudah memiliki tagihan instalasi.');
        }

        // 2. Logic Tagih Full 1 Bulan
        $totalAmount = $package->price; 

        // 3. Tentukan Periode Aktif
        $now = Carbon::now();
        $periodStart = $now;
        $periodEnd = $now->copy()->addMonth();

        // 4. Deskripsi
        $description = sprintf(
            "Paket Internet 1 Bulan Pertama (%s).\n(Sudah Termasuk Biaya Instalasi)\n*Periode Aktif: %s s/d %s",
            $package->name,
            $periodStart->translatedFormat('d M Y'),
            $periodEnd->translatedFormat('d M Y')
        );

        // 5. Simpan Invoice
        $invoice = Invoice::create([
            'user_id' => $user->id, 
            'subscription_id' => $subscription->id,
            'invoice_number' => 'INV-INST-' . time() . '-' . $user->id,
            'amount' => $totalAmount,
            'status' => 'pending',
            'type' => 'installation',
            'due_date' => $now->copy()->addDays(3),
            'description' => $description,
            'period_start' => $periodStart,
            'period_end' => $periodEnd,
        ]);

        // 6. Kirim Notifikasi Email
        try {
            $user->notify(new NewInvoiceNotification($invoice));
        } catch (\Exception $e) {
            // Abaikan
        }

        // 7. [MODIFIKASI] Redirect dengan WA Link agar bisa otomatis buka tab baru di React
        return Redirect::route('admin.subscriptions.index')
            ->with([
                'success' => 'Tagihan Awal berhasil dibuat untuk ' . $user->name,
                'wa_link' => $invoice->wa_link // Properti ini diambil dari model Invoice yang kita edit tadi
            ]);
    }

    public function downloadInvoice($invoiceId)
    {
        $invoice = Invoice::with('user')->findOrFail($invoiceId);
        $pdf = Pdf::loadView('pdf.invoice', ['invoice' => $invoice]);
        return $pdf->download('invoice-'.$invoice->invoice_number.'.pdf');
    }
}