<?php

namespace Database\Factories;

use App\Models\Candidato;
use App\Models\Trabajo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Valoracion>
 */
class ValoracionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'trabajo_id' => Trabajo::factory(),
            'candidato_id' => Candidato::factory(),
            'puntuacion' => fake()->numberBetween(1, 5),
            'comentario' => fake()->sentence(),
        ];
    }
}
