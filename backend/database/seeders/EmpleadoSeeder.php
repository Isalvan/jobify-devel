<?php

namespace Database\Seeders;

use App\Models\Empleado;
use Illuminate\Database\Seeder;

class EmpleadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Empleados rely on existing Empresas, but factory creates new one by default so we might want to override.
        // For simplicity, let's just create 5 random employees which will create their own companies and users.
        // Or better, attach to existing companies? Factory definition has 'empresa_id' => Empresa::factory().
        // Let's allow creating new companies for them for diversity.
        Empleado::factory(5)->create();
    }
}
