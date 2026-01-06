<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use App\Models\Invoice;
use App\Services\BillingCalculator;
use App\Notifications\NewInvoiceNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GenerateMonthlyInvoices extends Command
{
    // Signature ini yang dipanggil oleh Cron Job
    protected $signature = 'billing:generate-monthly';
    protected $description = 'Generate invoice bulanan: Bulan 1 (Deposit), Bulan 2 (Pro-rata), Bulan 3+ (Full)';

    public function handle()
    {
        $today = Carbon::now();
        
        // Sesuai diskusi: Generate tagihan dilakukan setiap TANGGAL 1
        if ($today->day !== 1) {
            $this->info("Bukan tanggal 1, sistem standby.");
            return;
        }

        // Ambil semua langganan yang aktif
        $subscriptions = Subscription::with(['package', 'user'])
            ->where('status', 'active')
            ->get();

        $calculator = new BillingCalculator();

        foreach ($subscriptions as $sub) {
            try {
                if (!$sub->activated_at) continue;

                $activationDate = Carbon::parse($sub->activated_at);
                
                // Cek selisih bulan antara aktivasi dan sekarang (tanggal 1 bulan baru)
                // Kita pakai diffInMonths dengan setting 'false' agar akurat secara kalender
                $diffInMonths = $activationDate->diffInMonths($today);

                $amount = 0;
                $description = "";

                if ($diffInMonths == 1) {
                    /**
                     * BULAN KE-2: LOGIKA PRO-RATA
                     * Menghitung sisa hari dari tanggal pasang sampai akhir bulan pertama.
                     * Ini menggunakan BillingCalculator yang sudah Bapak buat & test.
                     */
                    $result = $calculator->calculateProrata($sub->package->price, $activationDate);
                    $amount = $result['amount'];
                    $description = "Penyesuaian Pro-rata (Sisa hari bulan pertama)";
                } 
                elseif ($diffInMonths > 1) {
                    /**
                     * BULAN KE-3 DST: KEMBALI FULL
                     * Tagihan normal sesuai harga paket.
                     */
                    $amount = $sub->package->price;
                    $description = "Layanan Internet Bulanan - " . $today->format('F Y');
                } else {
                    // Bulan ke-1: Tidak buat invoice karena sudah bayar saat pendaftaran (Deposit)
                    continue;
                }

                // Proteksi: Jangan buat invoice ganda di bulan yang sama
                $alreadyInvoiced = Invoice::where('subscription_id', $sub->id)
                    ->where('type', 'monthly')
                    ->whereMonth('created_at', $today->month)
                    ->whereYear('created_at', $today->year)
                    ->exists();

                if (!$alreadyInvoiced && $amount > 0) {
                    DB::transaction(function () use ($sub, $amount, $today, $description) {
                        $invoice = Invoice::create([
                            'user_id'         => $sub->user_id,
                            'subscription_id' => $sub->id,
                            'invoice_number'  => 'INV-' . $today->format('Ym') . '-' . str_pad($sub->id, 4, '0', STR_PAD_LEFT),
                            'type'            => 'monthly',
                            'amount'          => $amount,
                            'status'          => 'pending',
                            'due_date'        => $today->copy()->addDays(10), // Jatuh tempo tanggal 10
                            'notes'           => $description,
                        ]);

                        // Kirim notifikasi ke user (jika sistem notifikasi sudah siap)
                        if ($sub->user) {
                            $sub->user->notify(new NewInvoiceNotification($invoice));
                        }
                    });

                    $this->info("Invoice Berhasil dibuat untuk: " . $sub->user->name);
                }

            } catch (\Exception $e) {
                Log::error("Gagal generate invoice untuk Sub ID {$sub->id}: " . $e->getMessage());
            }
        }

        $this->info("Proses Billing Selesai.");
    }
}