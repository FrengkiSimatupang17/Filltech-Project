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
    public function boot(): void // <-- PERBAIKAN ADA DI SINI
    {
        // Kode ini sekarang akan berfungsi karena 'use' di atas
        Notification::extend('whatsapp', function ($app) {
            return new WhatsAppChannel();
        });
    }
}