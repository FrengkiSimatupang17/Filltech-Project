<?php

namespace App\Notifications;

use App\Channels\WhatsAppChannel;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewInvoiceNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $invoice;

    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    public function via($notifiable): array
    {
        return [WhatsAppChannel::class];
    }

    public function toWhatsApp($notifiable): string
    {
        $amount = number_format($this->invoice->amount, 0, ',', '.');
        $dueDate = $this->invoice->due_date->format('d M Y');
        
        return "Halo {$notifiable->name},\nTagihan baru telah dibuat (#{$this->invoice->invoice_number}) "
             . "dengan tipe '{$this->invoice->type}' senilai Rp {$amount}. "
             . "Jatuh tempo pada {$dueDate}. "
             . "Silakan cek dashboard Anda untuk pembayaran.";
    }
}