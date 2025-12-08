<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorias = [
            'Tecnología',
            'Salud',
            'Educación',
            'Finanzas',
            'Construcción',
            'Ventas',
            'Marketing',
            'Diseño',
            'Administración',
            'Recursos Humanos',
        ];

        foreach ($categorias as $nombre) {
            Categoria::firstOrCreate(
                ['nombre' => $nombre],
                ['slug' => \Illuminate\Support\Str::slug($nombre)]
            );
        }
    }
}
