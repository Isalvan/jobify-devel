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
        Schema::create('documento_archivos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('aplicacion_id');
            $table->string('tipo')->nullable();
            $table->string('ruta_archivo');
            $table->timestamps();

            $table->foreign('aplicacion_id')->references('id')->on('aplicacions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documento_archivos');
    }
};
