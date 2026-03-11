<?php

namespace Tests\Feature\Security;

use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LikeQueryTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_can_handle_wildcard_characters_literally()
    {
        // Crear usuarios de prueba
        Usuario::factory()->create(['nombre' => 'User Percent %', 'email' => 'percent@example.com']);
        Usuario::factory()->create(['nombre' => 'User Underscore _', 'email' => 'underscore@example.com']);
        Usuario::factory()->create(['nombre' => 'Normal User', 'email' => 'normal@example.com']);

        // Como el endpoint tiene control de acceso, necesitamos un admin
        $admin = Usuario::factory()->create(['rol' => 'ADMIN']);

        // 1. Probar búsqueda con %
        $response = $this->actingAs($admin)
            ->getJson('/api/usuarios?search=%');

        $response->assertStatus(200);
        $names = collect($response->json('data'))->pluck('nombre');

        // El fix debe prevenir que % actúe como comodín que coincide con todo
        $this->assertNotContains('Normal User', $names, 'Search for % should not return "Normal User".');

        // 2. Probar búsqueda con _
        $response = $this->actingAs($admin)
            ->getJson('/api/usuarios?search=_');

        $response->assertStatus(200);
        $names = collect($response->json('data'))->pluck('nombre');

        // El fix debe prevenir que _ actúe como comodín de un solo carácter
        // "Normal User" tiene caracteres que coincidirían con _ si fuera un comodín
        $this->assertNotContains('Normal User', $names, 'Search for _ should not return "Normal User".');
    }
}
