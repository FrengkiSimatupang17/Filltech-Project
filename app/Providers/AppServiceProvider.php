<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Notification;
use App\Channels\WhatsAppChannel;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Notification::extend('whatsapp', function ($app) {
            return new WhatsAppChannel();
        });
    }
}