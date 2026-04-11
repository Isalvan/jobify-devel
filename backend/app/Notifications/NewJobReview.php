<?php

namespace App\Notifications;

use App\Models\Valoracion;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;

class NewJobReview extends Notification implements ShouldBroadcast
{
    use Queueable;

    protected $valoracion;

    public function __construct(Valoracion $valoracion)
    {
        $this->valoracion = $valoracion;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'valoracion_id' => $this->valoracion->id,
            'trabajo_id' => $this->valoracion->trabajo_id,
            'trabajo_titulo' => $this->valoracion->trabajo->titulo,
            'puntuacion' => $this->valoracion->puntuacion,
            'mensaje' => "Has recibido una nueva valoración (" . $this->valoracion->puntuacion . " estrellas) para: " . $this->valoracion->trabajo->titulo,
            'url' => "/ofertas/" . $this->valoracion->trabajo_id,
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
