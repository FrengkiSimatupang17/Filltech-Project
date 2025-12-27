<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use App\Models\Invoice;
use Carbon\Carbon;

class GenerateMonthlyInvoices extends Command
{
    protected $signature = 'billing:generate-monthly';
    protected $description = 'Generate invoice bulanan untuk langganan aktif';

    public function handle()
    {
        // Cari langganan AKTIF yang tanggal tagihannya hari ini
        // Asumsi: Kita tagih setiap tanggal 1 atau sesuai tanggal aktivasi
        // Logika sederhana: Tagih semua yang aktif
        
        $activeSubs = Subscription::where('status', 'active')->get();
        $count = 0;

        foreach ($activeSubs as $sub) {
            // Cek apakah sudah ada invoice untuk bulan ini agar tidak duplikat
            $existingInvoice = Invoice::where('subscription_id', $sub->id)
                ->where('type', 'monthly')
                ->whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->exists();

            if (!$existingInvoice) {
                // Buat Invoice Baru
                Invoice::create([
                    'user_id' => $sub->user_id,
                    'subscription_id' => $sub->id,
                    'invoice_number' => 'INV-' . date('Ymd') . '-' . rand(1000, 9999),
                    'amount' => $sub->price, // Harga paket
                    'status' => 'pending',
                    'type' => 'monthly',
                    'due_date' => Carbon::now()->addDays(10), // Jatuh tempo 10 hari lagi
                ]);
                $count++;
            }
        }

        $this->info("Berhasil membuat $count invoice bulanan.");
    }
}