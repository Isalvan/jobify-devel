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
        Schema::create('aplicacions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trabajo_id')->constrained()->onDelete('cascade');
            $table->foreignId('candidato_id')->constrained()->onDelete('cascade');
            $table->text('mensaje')->nullable();
            $table->enum('estado', ['PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'EN_PROCESO'])->default('PENDIENTE');
            $table->timestamp('fecha_aplicacion')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aplicacions');
    }
};
