<?php

namespace App\Policies;

use App\Models\Usuario;
use Illuminate\Auth\Access\HandlesAuthorization;

class UsuarioPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return $user->rol === 'ADMIN'; // Only admin can list all users
    }

    public function view(Usuario $user, Usuario $model)
    {
        return true; // Any authenticated user can view profiles
    }

    public function create(Usuario $user)
    {
        // Typically registration is public (via AuthController), but maybe admin creates users?
        return $user->rol === 'ADMIN';
    }

    public function update(Usuario $user, Usuario $model)
    {
        return $user->id === $model->id || $user->rol === 'ADMIN';
    }

    public function delete(Usuario $user, Usuario $model)
    {
        return $user->rol === 'ADMIN' || $user->id === $model->id; // Allow self-delete?
    }
}
