<?php

namespace Database\Factories;

use App\Models\Aplicacion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Documento>
 */
class DocumentoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'aplicacion_id' => Aplicacion::factory(),
            'tipo' => fake()->fileExtension(),
            'ruta_archivo' => fake()->filePath(),
        ];
    }
}
