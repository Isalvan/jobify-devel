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
        ];
    }

    public function empresa(): static
    {
        return $this->state(fn(array $attributes) => [
            'rol' => 'EMPRESA',
            'nombre' => fake()->company(),
            'foto_perfil' => 'https://picsum.photos/seed/' . Str::slug($attributes['email']) . '/200/200',
        ]);
    }

    public function candidato(): static
    {
        return $this->state(fn(array $attributes) => [
            'rol' => 'CANDIDATO',
            'foto_perfil' => 'https://i.pravatar.cc/150?u=' . Str::random(5),
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
            'foto_perfil' => 'https://i.pravatar.cc/150?u=' . Str::random(5),
        ]);
    }
}
