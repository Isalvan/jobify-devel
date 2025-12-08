<?php

namespace Database\Factories;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Candidato>
 */
class CandidatoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'usuario_id' => Usuario::factory()->candidato(),
            'apellidos' => fake()->lastName(),
            'fecha_nacimiento' => fake()->date(),
            'descripcion' => fake()->text(),
            'ubicacion' => fake()->city(),
            'url_cv' => fake()->url(),
        ];
    }
}
