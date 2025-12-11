<?php

namespace App\Policies;

use App\Models\Candidato;
use App\Models\Usuario;
use Illuminate\Auth\Access\HandlesAuthorization;

class CandidatoPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return $user->rol === 'EMPRESA' || $user->rol === 'ADMIN';
    }

    public function view(Usuario $user, Candidato $candidato)
    {
        if ($user->rol === 'EMPRESA' || $user->rol === 'ADMIN') {
            return true;
        }
        return $user->id === $candidato->usuario_id;
    }

    public function create(Usuario $user)
    {
        return $user->rol === 'CANDIDATO' && !$user->candidato;
    }

    public function update(Usuario $user, Candidato $candidato)
    {
        return $user->rol === 'ADMIN' || ($user->rol === 'CANDIDATO' && $user->id === $candidato->usuario_id);
    }

    public function delete(Usuario $user, Candidato $candidato)
    {
        return $user->rol === 'ADMIN';
    }
}
