<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Trabajo;
use Illuminate\Database\Seeder;

class TrabajoCategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorias = Categoria::all();

        // Attach random categories to each job
        Trabajo::all()->each(function (Trabajo $trabajo) use ($categorias) {
            $trabajo->categorias()->sync(
                $categorias->random(rand(1, 3))->pluck('id')->toArray()
            );
        });
    }
}
