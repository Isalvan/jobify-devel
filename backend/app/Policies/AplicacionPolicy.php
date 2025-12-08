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
        return true; // Filtered in controller is safer pattern for extensive rules
    }

    public function view(Usuario $user, Aplicacion $aplicacion)
    {
        if ($user->rol === 'ADMIN') return true;

        // Owner candidate
        if ($user->candidato && $user->candidato->id === $aplicacion->candidato_id) {
            return true;
        }

        // Owner company of the job
        if ($user->empresa && $user->empresa->id === $aplicacion->trabajo->empresa_id) {
            return true;
        }

        return false;
    }

    public function create(Usuario $user)
    {
        return $user->rol === 'CANDIDATO' && $user->candidato; // Must satisfy having a candidate profile
    }

    public function update(Usuario $user, Aplicacion $aplicacion)
    {
        // Only company can update status (accept/reject)? Or candidate cancel?
        // Assuming update status is for company
        if ($user->rol === 'ADMIN') return true;

        if ($user->empresa && $user->empresa->id === $aplicacion->trabajo->empresa_id) {
            return true;
        }

        return false;
    }

    public function delete(Usuario $user, Aplicacion $aplicacion)
    {
        return $user->rol === 'ADMIN';
    }
}
