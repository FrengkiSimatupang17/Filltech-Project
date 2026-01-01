<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('attendances', function (Blueprint $table) {
            // 1. Ubah nama kolom lama (jika ada) atau buat baru
            // Kita asumsikan kolom lama namanya 'latitude' & 'longitude'
            // Kita rename jadi 'latitude_in' agar data lama tidak hilang

            if (Schema::hasColumn('attendances', 'latitude')) {
                $table->renameColumn('latitude', 'latitude_in');
            } else {
                $table->double('latitude_in')->nullable();
            }

            if (Schema::hasColumn('attendances', 'longitude')) {
                $table->renameColumn('longitude', 'longitude_in');
            } else {
                $table->double('longitude_in')->nullable();
            }

            // 2. Tambah kolom untuk lokasi pulang
            if (!Schema::hasColumn('attendances', 'latitude_out')) {
                $table->double('latitude_out')->nullable()->after('longitude_in');
                $table->double('longitude_out')->nullable()->after('latitude_out');
            }

            // 3. Tambah kolom status keterlambatan
            if (!Schema::hasColumn('attendances', 'status_arrival')) {
                $table->string('status_arrival')->default('on_time')->after('status');
                $table->integer('late_minutes')->default(0)->after('status_arrival');
            }
        });
    }

    public function down()
    {
        // Kembalikan seperti semula jika rollback
        Schema::table('attendances', function (Blueprint $table) {
            $table->renameColumn('latitude_in', 'latitude');
            $table->renameColumn('longitude_in', 'longitude');
            $table->dropColumn(['latitude_out', 'longitude_out', 'status_arrival', 'late_minutes']);
        });
    }
};