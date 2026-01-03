<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Subscription;
use App\Services\BillingCalculator; // [WAJIB] Import Service Calculator
use App\Notifications\NewInvoiceNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SubscriptionManagementController extends Controller
{
    protected $billingCalculator;

    // Inject Service Calculator agar sistem perhitungan robust & terpisah
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

        // Urutkan 'pending' paling atas, lalu berdasarkan tanggal terbaru
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
                // Cek apakah sudah ada tagihan instalasi (biar tombol tidak muncul 2x)
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

        // 1. Cek Double Invoice (Mencegah Admin klik 2x)
        $existingInvoice = $user->invoices()
            ->where('type', 'installation')
            ->whereIn('status', ['pending', 'paid'])
            ->exists();

        if ($existingInvoice) {
            return Redirect::route('admin.subscriptions.index')
                ->with('error', 'Klien ini sudah memiliki tagihan instalasi.');
        }

        // 2. [ROBUST SYSTEM] Hitung Prorata menggunakan Service
        $now = Carbon::now();
        
        // Panggil service untuk menghitung harga (Logika pembulatan ada di Service)
        $calculation = $this->billingCalculator->calculateProrata($package->price, $now);
        
        $proratedAmount = $calculation['amount']; // Hasil sudah dibulatkan
        $remainingDays = $calculation['remaining_days'];

        // Ambil biaya pasang tambahan dari request (jika ada input manual)
        // Default 0 jika tidak ada input
        $installationFee = $request->input('installation_fee', 0); 
        
        $totalAmount = $proratedAmount + $installationFee;

        // 3. Buat Deskripsi Invoice yang Detail & Transparan
        // Contoh: "Paket Internet 10 Mbps (Prorata 12 Hari) + Biaya Pasang"
        $description = sprintf(
            "Tagihan Awal: %s (Prorata %d Hari).\n*Hitungan: (Rp %s / 30) x %d hari. Sudah termasuk pembulatan.",
            $package->name,
            $remainingDays,
            number_format($package->price, 0, ',', '.'),
            $remainingDays
        );

        if ($installationFee > 0) {
            $description .= "\n+ Biaya Instalasi Perangkat";
        }

        // 4. Simpan ke Database
        $invoice = Invoice::create([
            'user_id' => $user->id, 
            'subscription_id' => $subscription->id,
            'invoice_number' => 'INV-INST-' . time() . '-' . $user->id, // Format nomor invoice
            'amount' => $totalAmount,
            'status' => 'pending', // Menunggu verifikasi admin
            'type' => 'installation',
            'due_date' => $now->copy()->addDays(3), // Jatuh tempo 3 hari
            'description' => $description,
            'period_start' => $now,
            'period_end' => $now->copy()->endOfMonth(),
        ]);

        // 5. Kirim Notifikasi (Safe Block)
        try {
            // Pastikan class NewInvoiceNotification menerima object Invoice
            $user->notify(new NewInvoiceNotification($invoice));
        } catch (\Exception $e) {
            // Log error tapi jangan gagalkan proses pembuatan invoice
            // \Log::error("Gagal kirim notifikasi invoice: " . $e->getMessage());
        }

        return Redirect::route('admin.subscriptions.index')
            ->with('success', 'Tagihan instalasi (Prorata) berhasil dibuat: Rp ' . number_format($totalAmount, 0, ',', '.'));
    }
}