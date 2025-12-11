<?php

namespace Database\Factories;

use App\Models\Candidato;
use App\Models\Trabajo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Aplicacion>
 */
class AplicacionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'trabajo_id' => Trabajo::factory(),
            'candidato_id' => Candidato::factory(),
            'mensaje' => fake()->realText(200),
            'estado' => fake()->randomElement(['PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'EN_PROCESO']),
            'fecha_aplicacion' => fake()->dateTimeBetween('-6 months', 'now'),
            'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
            'updated_at' => fake()->dateTimeBetween('-3 months', 'now'),
        ];
    }
}
