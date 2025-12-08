<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Empresa;

class FeaturedCompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = Empresa::all();
        $halfCount = $companies->count() / 2;

        $companies->random((int) $halfCount)->each(function ($empresa) {
            $empresa->update(['impresiones_restantes' => 100]);
        });

        $this->command->info("Updated {$halfCount} companies with 100 featured impressions.");
    }
}
