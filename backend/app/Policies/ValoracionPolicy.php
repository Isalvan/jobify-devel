<?php

namespace App\Policies;

use App\Models\Valoracion;
use App\Models\Usuario;
use Illuminate\Auth\Access\HandlesAuthorization;

class ValoracionPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return true;
    }

    public function view(Usuario $user, Valoracion $valoracion)
    {
        return true;
    }

    public function create(Usuario $user)
    {
        // For now, allow authenticated users.
        return true;
    }

    public function update(Usuario $user, Valoracion $valoracion)
    {
        return $user->id === $valoracion->candidato_id || $user->rol === 'ADMIN';
    }

    public function delete(Usuario $user, Valoracion $valoracion)
    {
        return $user->id === $valoracion->candidato_id || $user->rol === 'ADMIN';
    }
}
