<?php

namespace App\Policies;

use App\Models\Gasto;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class GastoPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(Usuario $user): bool
    {
        return $user->rol === 'ADMIN' || $user->rol === 'EMPRESA';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(Usuario $user, Gasto $gasto): bool
    {
        return $user->rol === 'ADMIN' || ($user->rol === 'EMPRESA' && $gasto->empresa->usuario_id === $user->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(Usuario $user): bool
    {
        return $user->rol === 'ADMIN';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(Usuario $user, Gasto $gasto): bool
    {
        return $user->rol === 'ADMIN';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(Usuario $user, Gasto $gasto): bool
    {
        return $user->rol === 'ADMIN';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Usuario $user, Gasto $gasto): bool
    {
        return $user->rol === 'ADMIN';
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Usuario $user, Gasto $gasto): bool
    {
        return $user->rol === 'ADMIN';
    }
}
