<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Notification;
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

        // 1. Registrasi Custom Notification Channel (WhatsApp)
        Notification::extend('whatsapp', function ($app) {
            return new WhatsAppChannel();
        });
    }
}