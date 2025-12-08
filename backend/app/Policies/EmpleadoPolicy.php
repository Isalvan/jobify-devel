<?php

namespace App\Policies;

use App\Models\Empleado;
use App\Models\Usuario;
use Illuminate\Auth\Access\HandlesAuthorization;

class EmpleadoPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return $user->empresa()->exists() || $user->rol === 'ADMIN';
    }

    public function view(Usuario $user, Empleado $empleado)
    {
        return ($user->empresa && $user->empresa->id === $empleado->empresa_id)
            || $user->id === $empleado->usuario_id
            || $user->rol === 'ADMIN';
    }

    public function create(Usuario $user)
    {
        return $user->empresa()->exists();
    }

    public function update(Usuario $user, Empleado $empleado)
    {
        return ($user->empresa && $user->empresa->id === $empleado->empresa_id) || $user->rol === 'ADMIN';
    }

    public function delete(Usuario $user, Empleado $empleado)
    {
        return ($user->empresa && $user->empresa->id === $empleado->empresa_id) || $user->rol === 'ADMIN';
    }
}
