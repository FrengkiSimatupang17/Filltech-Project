<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\Subscription;
use App\Notifications\NewInvoiceNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class GenerateMonthlyInvoices extends Command
{
    protected $signature = 'app:generate-monthly-invoices';

    protected $description = 'Generate monthly invoices for all active subscriptions';

    public function handle()
    {
        $this->info('Starting to generate monthly invoices...');

        $count = 0;
        $now = Carbon::now();

        // Gunakan chunk untuk performa lebih baik saat data banyak
        Subscription::with(['user', 'package'])
            ->where('status', 'active')
            ->chunk(100, function ($subscriptions) use ($now, &$count) {
                foreach ($subscriptions as $subscription) {
                    $user = $subscription->user;
                    $package = $subscription->package;

                    // Cek apakah tagihan bulan ini sudah ada
                    $invoiceExists = Invoice::where('subscription_id', $subscription->id)
                        ->where('type', 'monthly')
                        ->whereYear('created_at', $now->year)
                        ->whereMonth('created_at', $now->month)
                        ->exists();

                    if (!$invoiceExists) {
                        $invoice = Invoice::create([
                            'user_id' => $user->id,
                            'subscription_id' => $subscription->id,
                            'invoice_number' => 'INV-MTH-' . $now->format('Ym') . '-' . $user->id,
                            'amount' => $package->price,
                            'status' => 'pending',
                            'type' => 'monthly',
                            'due_date' => $now->copy()->addDays(7),
                        ]);

                        $user->notify(new NewInvoiceNotification($invoice));
                        $count++;
                    }
                }
            });

        $this->info("Successfully generated $count new monthly invoices.");
        return 0;
    }
}