<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('address_detail');
            $table->string('rt', 3)->nullable()->after('phone_number');
            $table->string('rw', 3)->nullable()->after('rt');
            $table->string('blok', 10)->nullable()->after('rw');
            $table->string('nomor_rumah', 10)->nullable()->after('blok');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('address_detail')->nullable()->after('phone_number');
            $table->dropColumn(['rt', 'rw', 'blok', 'nomor_rumah']);
        });
    }
};