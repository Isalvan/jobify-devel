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
        // Allowed if user has an enterprise or is admin.
        return $user->empresa()->exists() || $user->rol === 'ADMIN';
    }

    public function view(Usuario $user, Empleado $empleado)
    {
        // Company owner or the employee themself or admin
        return ($user->empresa && $user->empresa->id === $empleado->empresa_id)
            || $user->id === $empleado->usuario_id
            || $user->rol === 'ADMIN';
    }

    public function create(Usuario $user)
    {
        // Only enterprise can add employees
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
