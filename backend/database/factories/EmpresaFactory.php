<?php

namespace Database\Factories;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Empresa>
 */
class EmpresaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'usuario_id' => Usuario::factory()->state(function (array $attributes) {
                return [
                    'rol' => 'EMPRESA',
                    'nombre' => fake()->company(),
                    'foto_perfil' => 'https://picsum.photos/seed/' . \Illuminate\Support\Str::slug(fake()->unique()->email()) . '/200/200',
                ];
            }),
            'descripcion' => fake()->paragraph(),
            'sector' => fake()->jobTitle(),
            'tamano_empresa' => fake()->randomElement(['1-10', '11-50', '51-200', '201-500', '+500']),
            'ubicacion' => fake()->address(),
            'web' => fake()->url(),
        ];
    }
}
