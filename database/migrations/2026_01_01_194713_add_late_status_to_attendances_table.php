<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('attendances', function (Blueprint $table) {
            // Menyimpan status: 'on_time', 'late'
            $table->string('status_arrival')->default('on_time')->after('clock_out'); 
            // Menyimpan berapa menit terlambatnya (opsional, tapi berguna untuk HRD)
            $table->integer('late_minutes')->default(0)->after('status_arrival');
        });
    }

    public function down()
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn(['status_arrival', 'late_minutes']);
        });
    }
};