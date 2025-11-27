<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class WhatsAppChannel
{
    public function send($notifiable, Notification $notification)
    {
        if (!method_exists($notification, 'toWhatsApp')) {
            return;
        }

        $message = $notification->toWhatsApp($notifiable);
        $to = $notifiable->phone_number;

        if (!$to) {
            Log::warning("No phone number for user {$notifiable->id} to send WhatsApp notification.");
            return;
        }

        // Di sini tempat integrasi API WhatsApp Real (cth: Curl ke Fonnte/Twilio)
        // Saat ini kita simulasikan ke Log agar aplikasi tidak error
        Log::info("WhatsApp SENT to {$to}: \n{$message}");
    }
}