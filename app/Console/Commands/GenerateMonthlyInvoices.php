<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GenerateMonthlyInvoices extends Command
{
    protected $signature = 'billing:generate-monthly';
    protected $description = 'Generate invoice bulanan untuk langganan aktif yang jatuh tempo';

    public function handle()
    {
        $this->info('Memulai proses generate invoice bulanan...');
        
        // 1. Cari langganan yang AKTIF
        $activeSubs = Subscription::where('status', 'active')->get();
        $count = 0;

        foreach ($activeSubs as $sub) {
            // Logika: Tagihan dibuat setiap tanggal yang sama dengan tanggal aktif
            // Contoh: Aktif tgl 15 Jan -> Tagihan muncul tiap tgl 15
            
            // Pastikan active_at tidak null agar tidak error parsing
            if (!$sub->active_at) continue;

            $activationDate = Carbon::parse($sub->active_at);
            $today = Carbon::now();
            
            // Cek apakah hari ini adalah tanggal siklus tagihan
            // Note: Jika tanggal aktif > jumlah hari bulan ini (misal tgl 31 di bulan Feb), 
            // logika sederhana ini mungkin skip. Tapi untuk MVP ini cukup.
            if ($today->day == $activationDate->day) {
                
                // Cek apakah invoice bulan ini SUDAH ADA? (Agar tidak dobel)
                $exists = Invoice::where('subscription_id', $sub->id)
                    ->where('type', 'monthly')
                    ->whereMonth('created_at', $today->month)
                    ->whereYear('created_at', $today->year)
                    ->exists();

                if (!$exists) {
                    try {
                        DB::transaction(function () use ($sub, $today) {
                            Invoice::create([
                                'user_id' => $sub->user_id,
                                'subscription_id' => $sub->id,
                                'invoice_number' => 'INV-' . $today->format('Ymd') . '-' . rand(1000, 9999),
                                'type' => 'monthly',
                                'amount' => $sub->price,
                                'status' => 'pending',
                                'due_date' => $today->copy()->addDays(7), // Jatuh tempo 7 hari
                            ]);
                        });
                        
                        $count++;
                        $this->info("Invoice dibuat untuk User ID: {$sub->user_id}");
                    } catch (\Exception $e) {
                        Log::error("Gagal buat invoice User {$sub->user_id}: " . $e->getMessage());
                        $this->error("Gagal: " . $e->getMessage());
                    }
                }
            }
        }

        $this->info("Selesai. $count invoice berhasil dibuat.");
    }
}