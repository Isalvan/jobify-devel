<?php

namespace Database\Seeders;

use App\Models\Empresa;
use App\Models\Trabajo;
use Illuminate\Database\Seeder;

class TrabajoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // For each existing company, create some jobs
        Empresa::all()->each(function (Empresa $empresa) {
            Trabajo::factory(rand(1, 5))->create([
                'empresa_id' => $empresa->id,
            ]);
        });
    }
}
