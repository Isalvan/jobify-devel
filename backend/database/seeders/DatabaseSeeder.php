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
        if (!Usuario::where('email', 'admin@jobify.com')->exists()) {
            Usuario::factory()->admin()->create([
                'nombre' => 'Admin Jobify',
                'email' => 'admin@jobify.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
            ]);
        }

        // Demo Empresa
        if (!Usuario::where('email', 'empresa@jobify.com')->exists()) {
            $usuario = Usuario::factory()->empresa()->create([
                'nombre' => 'Empresa Demo',
                'email' => 'empresa@jobify.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
            ]);
            // Ensure Empresa model is created (Factory 'empresa' state handles User type, but we need the relation row)
            // Actually UsuarioFactory 'empresa' state likely sets 'rol'='EMPRESA'. 
            // We need to create the related 'Empresa' model.
            // Best way: Use Empresa::factory()->for(Usuario::factory()->...) or similar.
            // Let's use the Empresa factory directly with a specific User.
        }

        // Better approach: Create Models with specific users
        if (!\App\Models\Empresa::whereHas('usuario', fn($q) => $q->where('email', 'empresa@jobify.com'))->exists()) {
             \App\Models\Empresa::factory()->for(
                Usuario::factory()->state([
                    'nombre' => 'Tech Corp Demo',
                    'email' => 'empresa@jobify.com',
                    'password' => \Illuminate\Support\Facades\Hash::make('password'),
                    'rol' => 'EMPRESA',
                ])
             )->create();
        }

        // Demo Candidato
        if (!\App\Models\Candidato::whereHas('usuario', fn($q) => $q->where('email', 'candidato@jobify.com'))->exists()) {
            \App\Models\Candidato::factory()->for(
               Usuario::factory()->state([
                   'nombre' => 'Juan Candidato',
                   'email' => 'candidato@jobify.com',
                   'password' => \Illuminate\Support\Facades\Hash::make('password'),
                   'rol' => 'CANDIDATO',
               ])
            )->create();
       }

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
