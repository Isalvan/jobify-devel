<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversaciones', function (Blueprint $col) {
            $col->id();
            $col->foreignId('user_one_id')->constrained('usuarios')->onDelete('cascade');
            $col->foreignId('user_two_id')->constrained('usuarios')->onDelete('cascade');
            $col->timestamp('last_message_at')->nullable();
            $col->timestamps();

            $col->unique(['user_one_id', 'user_two_id']);
        });

        Schema::create('mensajes', function (Blueprint $col) {
            $col->id();
            $col->foreignId('conversacion_id')->constrained('conversaciones')->onDelete('cascade');
            $col->foreignId('sender_id')->constrained('usuarios')->onDelete('cascade');
            $col->text('content');
            $col->timestamp('read_at')->nullable();
            $col->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mensajes');
        Schema::dropIfExists('conversaciones');
    }
};
