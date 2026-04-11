<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{conversacionId}', function ($user, $conversacionId) {
    $conversacion = \App\Models\Conversacion::find($conversacionId);
    if (!$conversacion) {
        return false;
    }
    return $user->id === $conversacion->user_one_id || $user->id === $conversacion->user_two_id;
});

Broadcast::channel('App.Models.Usuario.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
