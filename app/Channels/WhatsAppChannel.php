<?php

namespace App\Channels; // <-- Pastikan ini 'App\Channels' BUKAN 'App'

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class WhatsAppChannel
{
    public function send($notifiable, Notification $notification)
    {
        $message = $notification->toWhatsApp($notifiable);
        $to = $notifiable->phone_number;

        if (!$to) {
            Log::warning("No phone number for user {$notifiable->id} to send WhatsApp notification.");
            return;
        }

        Log::info("Simulating WhatsApp send to {$to}: {$message}");
    }
}