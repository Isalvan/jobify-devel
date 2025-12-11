<?php

namespace Database\Seeders;

use App\Models\Empresa;
use Illuminate\Database\Seeder;

class EmpresaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!\App\Models\Usuario::where('email', 'empresa@jobify.com')->exists()) {
            $usuario = \App\Models\Usuario::factory()->create([
                'email' => 'empresa@jobify.com',
                'rol' => 'EMPRESA',
                'nombre' => 'Empresa Test',
                'password' => bcrypt('password'),
            ]);

            Empresa::factory()->create([
                'usuario_id' => $usuario->id,
                'descripcion' => 'Una empresa de prueba para validar la creación de ofertas.',
                'sector' => 'Tecnología',
            ]);
        }

        Empresa::factory(150)->create();
    }
}
