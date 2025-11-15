<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipment_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('technician_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('equipment_id')->constrained()->restrictOnDelete();
            $table->timestamp('borrowed_at')->useCurrent();
            $table->timestamp('returned_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipment_logs');
    }
};