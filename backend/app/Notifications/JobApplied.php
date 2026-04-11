<?php

namespace App\Notifications;

use App\Models\Aplicacion;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;

class JobApplied extends Notification implements ShouldBroadcast
{
    use Queueable;

    protected $aplicacion;

    public function __construct(Aplicacion $aplicacion)
    {
        $this->aplicacion = $aplicacion;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'aplicacion_id' => $this->aplicacion->id,
            'trabajo_id' => $this->aplicacion->trabajo_id,
            'trabajo_titulo' => $this->aplicacion->trabajo->titulo,
            'candidato_nombre' => $this->aplicacion->candidato->nombre,
            'mensaje' => "Nueva aplicación para el puesto: " . $this->aplicacion->trabajo->titulo,
            'url' => "/ofertas/" . $this->aplicacion->trabajo_id . "/aplicaciones",
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
