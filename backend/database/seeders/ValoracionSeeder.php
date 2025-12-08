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

        foreach (range(1, 20) as $i) {
            Valoracion::factory()->create([
                'trabajo_id' => $trabajos->random()->id,
                'candidato_id' => $candidatos->random()->id,
            ]);
        }
    }
}
