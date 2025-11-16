<?php

namespace App\Notifications;

use App\Channels\WhatsAppChannel;
use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class PaymentVerifiedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $payment;

    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
    }

    public function via($notifiable): array
    {
        return [WhatsAppChannel::class];
    }

    public function toWhatsApp($notifiable): string
    {
        $amount = number_format($this->payment->amount, 0, ',', '.');

        return "Halo {$notifiable->name},\nPembayaran Anda senilai Rp {$amount} "
             . "untuk tagihan #{$this->payment->invoice->invoice_number} telah BERHASIL diverifikasi. "
             . "Terima kasih.";
    }
}