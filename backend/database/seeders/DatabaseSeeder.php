<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents; // Remove if unused
use App\Models\Usuario;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        Usuario::factory()->admin()->create([
            'nombre' => 'Admin Jobify',
            'email' => 'admin@jobify.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ]);

        $this->call([
            CategoriaSeeder::class,
            EmpresaSeeder::class,
            CandidatoSeeder::class,
            EmpleadoSeeder::class,
            TrabajoSeeder::class,
            TrabajoCategoriaSeeder::class,
            AplicacionSeeder::class,
            DocumentoSeeder::class,
            ValoracionSeeder::class,
        ]);
    }
}
