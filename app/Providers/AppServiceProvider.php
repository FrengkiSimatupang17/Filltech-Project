<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use App\Channels\WhatsAppChannel;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // CATATAN:
        // Logika pemaksa HTTPS untuk Ngrok sudah DIHAPUS.
        // Sekarang aplikasi berjalan normal di mode HTTP (Localhost).

        if($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // 2. Registrasi Custom Notification Channel (WhatsApp)
        // (Kode asli Anda tetap aman di sini)
        Notification::extend('whatsapp', function ($app) {
            return new WhatsAppChannel();
        });
    }
}