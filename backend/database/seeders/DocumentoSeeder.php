<?php

namespace Database\Seeders;

use App\Models\Aplicacion;
use App\Models\Documento;
use Illuminate\Database\Seeder;

class DocumentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aplicaciones = Aplicacion::all();

        if ($aplicaciones->isEmpty()) {
            return;
        }

        foreach ($aplicaciones as $aplicacion) {
            if (rand(0, 1)) { // 50% chance of having a document
                Documento::factory()->create([
                    'aplicacion_id' => $aplicacion->id,
                ]);
            }
        }
    }
}
