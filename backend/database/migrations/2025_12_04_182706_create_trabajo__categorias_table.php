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
        Schema::create('trabajo__categorias', function (Blueprint $table) {
            $table->unsignedBigInteger('trabajo_id');
            $table->unsignedBigInteger('categoria_id');

            $table->foreign('trabajo_id')->references('id')->on('trabajos')->onDelete('cascade');
            $table->foreign('categoria_id')->references('id')->on('categorias')->onDelete('cascade');

            $table->primary(['trabajo_id', 'categoria_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trabajo__categorias');
    }
};
