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
                    'nombre' => fake()->randomElement([
                        'TechFlow Solutions',
                        'Nexus Innovators',
                        'DataSphere Systems',
                        'CloudScale Corp',
                        'CodeCraft Agency',
                        'PixelPerfect Studios',
                        'Quantum Dynamics',
                        'CyberSecure Ltd',
                        'WebWizards Inc',
                        'NextGen Analytics',
                        'DevOps Pioneers',
                        'SoftServe Global',
                        'FutureTech Labs',
                        'AgileMinds',
                        'Streamline Digital'
                    ]),
                    'foto_perfil' => 'https://picsum.photos/seed/' . \Illuminate\Support\Str::slug(fake()->unique()->email()) . '/200/200',
                ];
            }),
            'descripcion' => fake()->realText(500),
            'sector' => fake()->randomElement(['Tecnología', 'Salud', 'Educación', 'Finanzas', 'Construcción', 'Comercio', 'Turismo', 'Hostelería', 'Transporte', 'Energía']),
            'tamano_empresa' => fake()->randomElement(['1-10', '11-50', '51-200', '201-500', '+500']),
            'ubicacion' => fake()->address(),
            'web' => fake()->url(),
            'impresiones_restantes' => fake()->numberBetween(0, 1000),
            'created_at' => fake()->dateTimeBetween('-2 years', 'now'),
            'updated_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
