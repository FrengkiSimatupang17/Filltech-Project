<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('technician_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('assigned_by_admin_id')->nullable()->constrained('users')->onDelete('set null');
            
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['installation', 'repair', 'maintenance']);
            $table->enum('status', ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'])->default('pending');
            
            // [BARU] Kolom Bukti Foto
            $table->string('evidence_photo_path')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tasks');
    }
};