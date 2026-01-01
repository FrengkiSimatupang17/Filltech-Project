<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up() {
        // Solusi terbaik untuk PostgreSQL: Ubah ke String agar tidak ada batasan ENUM
        Schema::table('invoices', function (Blueprint $table) {
            $table->string('status')->default('unpaid')->change();
        });
    }

    public function down() {
        // Jika ingin kembali ke ENUM lama (sesuai repomix Anda)
        Schema::table('invoices', function (Blueprint $table) {
            $table->enum('status', ['unpaid', 'paid', 'pending', 'overdue'])->default('unpaid')->change();
        });
    }
};