<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Jalankan migrasi untuk menghapus batasan status di PostgreSQL.
     */
    public function up(): void
    {
        // 1. Hapus Check Constraint yang membatasi nilai status (Spesifik PostgreSQL)
        // PostgreSQL secara otomatis membuat constraint dengan format [table]_[column]_check
        DB::statement('ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_status_check');

        // 2. Ubah tipe data kolom status menjadi string (VARCHAR) agar bisa menerima teks apapun
        Schema::table('invoices', function (Blueprint $table) {
            $table->string('status')->default('unpaid')->change();
        });
    }

    /**
     * Batalkan migrasi (Opsional).
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            // Kita biarkan tetap string agar tidak merusak data 'waiting_verification' yang sudah masuk
            $table->string('status')->default('unpaid')->change();
        });
    }
};