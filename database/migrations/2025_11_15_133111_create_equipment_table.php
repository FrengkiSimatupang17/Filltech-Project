<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            
            $table->string('category')->default('tool'); // tool (Alat) / material (Bahan)
            $table->string('unit')->default('pcs');      // pcs, roll, box
            
            $table->integer('total_quantity');
            $table->integer('available_quantity');
            
            $table->string('status')->default('available'); // available, maintenance, out_of_stock
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};