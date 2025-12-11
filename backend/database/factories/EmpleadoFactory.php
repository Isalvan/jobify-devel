<?php

namespace Database\Factories;

use App\Models\Empresa;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Empleado>
 */
class EmpleadoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'usuario_id' => Usuario::factory()->empleado(),
            'empresa_id' => Empresa::factory(),
            'apellidos' => fake()->lastName(),
            'puesto' => fake()->jobTitle(),
            'fecha_nacimiento' => fake()->date(),
        ];
    }
}
