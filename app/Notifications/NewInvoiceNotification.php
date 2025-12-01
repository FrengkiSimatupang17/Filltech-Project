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
        return ['database', WhatsAppChannel::class];
    }

    /**
     * Data yang akan disimpan ke tabel 'notifications' di database.
     * Ini yang akan dibaca oleh Lonceng di Navbar.
     */
    public function toArray($notifiable): array
    {
        return [
            'message' => 'Tagihan Baru #' . $this->invoice->invoice_number . ' sebesar Rp ' . number_format($this->invoice->amount, 0, ',', '.'),
            'url' => route('client.invoices.index'),
            'type' => 'invoice',
        ];
    }

    /**
     * Format pesan untuk WhatsApp (Channel Custom)
     */
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