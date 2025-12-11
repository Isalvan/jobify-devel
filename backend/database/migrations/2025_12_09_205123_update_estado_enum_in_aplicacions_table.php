<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('aplicacions', function (Blueprint $table) {
            $table->string('estado')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('aplicacions', function (Blueprint $table) {
            // Reverting to previous enum would require data cleanup or it might fail if incompatible values exist.
            // keeping it as string is safer for down or define the original enum.
            // Let's try to preserve it as string or comment out.
            // $table->enum('estado', ['PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'EN_PROCESO'])->change();
        });
    }
};
