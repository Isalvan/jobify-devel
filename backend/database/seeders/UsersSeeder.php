<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use App\Models\Candidato;
use App\Models\Empresa;
use App\Models\Empleado;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!Usuario::where('email', 'admin@jobify.com')->exists()) {
            Usuario::factory()->admin()->create([
                'nombre' => 'Admin Jobify',
                'email' => 'admin@jobify.com',
                'password' => Hash::make('password'),
            ]);
        }

        if (!Usuario::where('email', 'usuario@jobify.com')->exists()) {
            $user = Usuario::factory()->create([
                'nombre' => 'Alvaro',
                'email' => 'usuario@jobify.com',
                'password' => Hash::make('password'),
                'telefono' => '123456789',
                'rol' => 'CANDIDATO',
            ]);

            Candidato::create([
                'usuario_id' => $user->id,
                'apellidos' => 'Berodia',
                'fecha_nacimiento' => '2000-01-01',
                'ubicacion' => 'Madrid, España',
                'descripcion' => 'Prueba Usuario',
            ]);
        }

        if (!Usuario::where('email', 'empresa@jobify.com')->exists()) {
            $userEmpresa = Usuario::factory()->create([
                'nombre' => 'Empresa Demo',
                'email' => 'empresa@jobify.com',
                'password' => Hash::make('password'),
                'rol' => 'EMPRESA',
            ]);

            $empresa = Empresa::factory()->create([
                'usuario_id' => $userEmpresa->id,
                'descripcion' => 'Empresa de prueba para desarrollo.',
            ]);
        } else {
            $userEmpresa = Usuario::where('email', 'empresa@jobify.com')->first();
            $empresa = $userEmpresa->empresa;
        }

        if (!Usuario::where('email', 'empleado@jobify.com')->exists() && isset($empresa)) {
            $userEmpleado = Usuario::factory()->create([
                'nombre' => 'Empleado Demo',
                'email' => 'empleado@jobify.com',
                'password' => Hash::make('password'),
                'rol' => 'EMPLEADO',
            ]);

            Empleado::create([
                'usuario_id' => $userEmpleado->id,
                'empresa_id' => $empresa->id,
                'apellidos' => 'García',
                'puesto' => 'Reclutador Senior',
                'fecha_nacimiento' => '1995-05-20',
            ]);
        }
    }
}
