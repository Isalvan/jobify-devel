<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UsersSeeder::class);

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
            FeaturedCompanySeeder::class,
        ]);
    }
}
