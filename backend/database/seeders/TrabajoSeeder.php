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
        Empresa::all()->each(function (Empresa $empresa) {
            Trabajo::factory(rand(2, 8))->create([
                'empresa_id' => $empresa->id,
            ]);
        });
    }
}
