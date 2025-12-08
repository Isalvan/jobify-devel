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
        Schema::create('trabajos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')->constrained('empresas')->onDelete('cascade');
            $table->string('titulo', 255);
            $table->string('slug', 255)->unique();
            $table->longText('descripcion');
            $table->decimal('salario', 10, 2)->nullable();
            $table->string('ubicacion', 255);
            $table->enum('tipo_trabajo', ['PRESENCIAL', 'REMOTO', 'HIBRIDO']);
            $table->enum('estado', ['publicado', 'borrador', 'cerrado'])->default('borrador');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trabajos');
    }
};
