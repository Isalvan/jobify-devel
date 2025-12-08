<?php

namespace App\Policies;

use App\Models\Usuario;
use Illuminate\Auth\Access\HandlesAuthorization;

class UsuarioPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return $user->rol === 'ADMIN';
    }

    public function view(Usuario $user, Usuario $model)
    {
        return true;
    }

    public function create(Usuario $user)
    {
        return $user->rol === 'ADMIN';
    }

    public function update(Usuario $user, Usuario $model)
    {
        return $user->id === $model->id || $user->rol === 'ADMIN';
    }

    public function delete(Usuario $user, Usuario $model)
    {
        return $user->rol === 'ADMIN' || $user->id === $model->id;
    }
}
