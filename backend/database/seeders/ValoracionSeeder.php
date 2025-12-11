<?php

namespace Database\Seeders;

use App\Models\Candidato;
use App\Models\Trabajo;
use App\Models\Valoracion;
use Illuminate\Database\Seeder;

class ValoracionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $trabajos = Trabajo::all();
        $candidatos = Candidato::all();

        if ($trabajos->isEmpty() || $candidatos->isEmpty()) {
            return;
        }

        $trabajos->each(function ($trabajo) use ($candidatos) {

            $numValoraciones = rand(10, 100);

            $candidatosRandom = $candidatos->random(min($numValoraciones, $candidatos->count()));

            foreach ($candidatosRandom as $candidato) {
                Valoracion::factory()->create([
                    'trabajo_id' => $trabajo->id,
                    'candidato_id' => $candidato->id,
                ]);
            }
        });
    }
}
