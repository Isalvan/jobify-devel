<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Usuario>
 */
class UsuarioFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'telefono' => fake()->phoneNumber(),
            'estado' => 'ACTIVO',
            'rol' => 'CANDIDATO', // Default role
            'foto_perfil' => null, // Will be set based on role/name later or overridden
            'created_at' => fake()->dateTimeBetween('-2 years', 'now'),
            'updated_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function empresa(): static
    {
        return $this->state(fn(array $attributes) => [
            'rol' => 'EMPRESA',
            'nombre' => fake()->company(),
        ]);
    }

    public function candidato(): static
    {
        return $this->state(fn(array $attributes) => [
            'rol' => 'CANDIDATO',
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn(array $attributes) => [
            'rol' => 'ADMIN',
            'foto_perfil' => 'https://ui-avatars.com/api/?name=Admin+Jobify&background=random',
        ]);
    }

    public function empleado(): static
    {
        return $this->state(fn(array $attributes) => [
            'rol' => 'EMPLEADO',
        ]);
    }
}
