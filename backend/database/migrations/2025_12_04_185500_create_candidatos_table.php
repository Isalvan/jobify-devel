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
        Schema::create('empresas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->unique()->constrained('usuarios')->onDelete('cascade');
            $table->text('descripcion');
            $table->string('sector', 100);
            $table->enum('tamano_empresa', ['1-10', '11-50', '51-200', '201-500', '+500']);
            $table->string('ubicacion', 255);
            $table->string('web', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};
