<?php

namespace App\Policies;

use App\Models\Trabajo;
use App\Models\Usuario;
use Illuminate\Auth\Access\HandlesAuthorization;

class TrabajoPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return true;
    }

    public function view(Usuario $user, Trabajo $trabajo)
    {
        return true;
    }

    public function create(Usuario $user)
    {
        return $user->esAdministrador() || ($user->rol === 'EMPRESA' && $user->empresa);
    }

    public function update(Usuario $user, Trabajo $trabajo)
    {
        return $user->rol === 'ADMIN' || ($user->rol === 'EMPRESA' && $trabajo->empresa_id === $user->empresa->id);
    }

    public function delete(Usuario $user, Trabajo $trabajo)
    {
        return $user->rol === 'ADMIN' || ($user->rol === 'EMPRESA' && $trabajo->empresa_id === $user->empresa->id);
    }
}
