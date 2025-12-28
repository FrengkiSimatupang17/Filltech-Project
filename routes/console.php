<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule; // Tambahkan ini agar Scheduler aktif

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// --- JANTUNG OTOMATISASI TAGIHAN ---
// Menjalankan pengecekan tagihan bulanan setiap hari jam 01:00 pagi.
// Tanpa baris ini, fitur tagihan otomatis TIDAK AKAN JALAN.
Schedule::command('billing:generate-monthly')->dailyAt('01:00');