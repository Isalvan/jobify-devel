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
        Schema::create('usuario_gestions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->unique()->constrained('usuarios')->onDelete('cascade');
            $table->enum('rol_gestion', ['ADMINISTRADOR', 'MODERADOR']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuario_gestions');
    }
};
