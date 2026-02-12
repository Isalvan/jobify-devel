<?php

namespace Database\Seeders;

use App\Models\Aplicacion;
use App\Models\Candidato;
use App\Models\Trabajo;
use Illuminate\Database\Seeder;

class AplicacionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $candidatos = Candidato::all();
        $trabajos = Trabajo::all();

        if ($candidatos->count() === 0 || $trabajos->count() === 0) {
            return;
        }

        foreach ($candidatos as $candidato) {
            $randomJobs = $trabajos->random(rand(1, 3));
            foreach ($randomJobs as $trabajo) {
                $aplicacion = Aplicacion::factory()->create([
                    'candidato_id' => $candidato->id,
                    'trabajo_id' => $trabajo->id,
                ]);

                // Notify the company
                $empresaUsuario = $trabajo->empresa->usuario;
                if ($empresaUsuario) {
                    $empresaUsuario->notify(new \App\Notifications\JobApplied($aplicacion));
                }

                // If not pending, notify the candidate about the status
                if ($aplicacion->estado !== 'PENDIENTE') {
                    $candidatoUsuario = $candidato->usuario;
                    if ($candidatoUsuario) {
                        $candidatoUsuario->notify(new \App\Notifications\ApplicationStatusChanged($aplicacion));
                    }
                }
            }
        }
    }
}
