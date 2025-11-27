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
        // 1. FAIL FAST: Validasi Environment Variables Vital
        $requiredConfigs = [
            'app.name',
            'app.key',
            'app.url',
            'database.default',
        ];

        foreach ($requiredConfigs as $key) {
            if (empty(config($key))) {
                throw new \RuntimeException("FATAL ERROR: Konfigurasi '{$key}' kosong. Pastikan file .env Anda sudah diisi dengan benar.");
            }
        }

        // 2. Registrasi Custom Notification Channel (WhatsApp)
        Notification::extend('whatsapp', function ($app) {
            return new WhatsAppChannel();
        });
    }
}