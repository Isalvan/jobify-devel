<?php

namespace Tests\Feature;

use App\Events\MessageSent;
use App\Models\Conversacion;
use App\Models\Mensaje;
use App\Models\Usuario;
use App\Notifications\JobApplied;
use App\Models\Aplicacion;
use App\Models\Trabajo;
use App\Models\Candidato;
use App\Models\Empresa;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class BroadcastingTest extends TestCase
{
    use RefreshDatabase;

    public function test_message_sent_event_is_broadcasted()
    {
        Event::fake();

        $user1 = Usuario::factory()->create();
        $user2 = Usuario::factory()->create();
        $conversacion = Conversacion::create([
            'user_one_id' => min($user1->id, $user2->id),
            'user_two_id' => max($user1->id, $user2->id),
        ]);

        $response = $this->actingAs($user1)
            ->postJson('/api/chat', [
                'conversacion_id' => $conversacion->id,
                'content' => 'Hola mundo',
            ]);

        $response->assertStatus(201);

        Event::assertDispatched(MessageSent::class, function ($event) use ($user2) {
            $channels = $event->broadcastOn();
            $otherUserFound = false;
            foreach ($channels as $channel) {
                if ($channel->name === 'private-App.Models.Usuario.' . $user2->id) {
                    $otherUserFound = true;
                }
            }
            return $otherUserFound;
        });
    }

    public function test_notifications_are_broadcasted()
    {
        Notification::fake();

        $user_empresa = Usuario::factory()->create();
        $empresa = Empresa::factory()->create(['usuario_id' => $user_empresa->id]);
        $trabajo = Trabajo::factory()->create(['empresa_id' => $empresa->id]);
        $user_candidato = Usuario::factory()->create();
        $candidato = Candidato::factory()->create(['usuario_id' => $user_candidato->id]);

        $aplicacion = Aplicacion::create([
            'trabajo_id' => $trabajo->id,
            'candidato_id' => $candidato->id,
            'estado' => 'pendiente',
        ]);

        $user_empresa->notify(new JobApplied($aplicacion));

        Notification::assertSentTo(
            $user_empresa,
            JobApplied::class
        );
    }
}
