<?php

namespace App\Policies;

use App\Models\Aplicacion;
use App\Models\Usuario;
use Illuminate\Auth\Access\HandlesAuthorization;

class AplicacionPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return true;
    }

    public function view(Usuario $user, Aplicacion $aplicacion)
    {
        if ($user->rol === 'ADMIN') return true;

        if ($user->candidato && $user->candidato->id === $aplicacion->candidato_id) {
            return true;
        }

        if ($user->empresa && $user->empresa->id === $aplicacion->trabajo->empresa_id) {
            return true;
        }

        if ($user->empleado && $user->empleado->empresa_id === $aplicacion->trabajo->empresa_id) {
            return true;
        }

        return false;
    }

    public function create(Usuario $user)
    {
        return $user->rol === 'CANDIDATO';
    }

    public function update(Usuario $user, Aplicacion $aplicacion)
    {
        if ($user->rol === 'ADMIN') return true;

        if ($user->empresa && $user->empresa->id === $aplicacion->trabajo->empresa_id) {
            return true;
        }

        if ($user->empleado && $user->empleado->empresa_id === $aplicacion->trabajo->empresa_id) {
            return true;
        }

        return false;
    }

    public function delete(Usuario $user, Aplicacion $aplicacion)
    {
        if ($user->rol === 'ADMIN') {
            return true;
        }

        if ($user->candidato && $user->candidato->id === $aplicacion->candidato_id) {
            return true;
        }

        return false;
    }
}
