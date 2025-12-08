<?php

namespace Database\Factories;

use App\Models\Empresa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Trabajo>
 */
class TrabajoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'empresa_id' => Empresa::factory(),
            'titulo' => fake()->jobTitle(),
            'slug' => fake()->slug(),
            'descripcion' => fake()->paragraphs(3, true),
            'salario' => fake()->randomFloat(2, 20000, 100000),
            'ubicacion' => fake()->city(),
            'tipo_trabajo' => fake()->randomElement(['PRESENCIAL', 'REMOTO', 'HIBRIDO']),
            'estado' => fake()->randomElement(['publicado', 'borrador', 'cerrado']),
        ];
    }
}
