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
        Schema::create('valoracions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('trabajo_id');
            $table->unsignedBigInteger('candidato_id');
            $table->tinyInteger('puntuacion')->comment('Valoración numérica (1-5)');
            $table->text('comentario')->nullable();
            $table->timestamps();

            $table->foreign('trabajo_id')->references('id')->on('trabajos')->onDelete('cascade');
            $table->foreign('candidato_id')->references('id')->on('users')->onDelete('cascade'); // Assuming 'candidatos' are users
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('valoracions');
    }
};
