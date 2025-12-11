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
        return $user->esAdministrador() || ($user->rol === 'EMPRESA' && $user->empresa) || ($user->rol === 'EMPLEADO' && $user->empleado && $user->empleado->empresa);
    }

    public function update(Usuario $user, Trabajo $trabajo)
    {
        if ($user->rol === 'ADMIN') return true;
        if ($user->rol === 'EMPRESA' && $user->empresa && $trabajo->empresa_id === $user->empresa->id) return true;
        if ($user->rol === 'EMPLEADO' && $user->empleado && $trabajo->empresa_id === $user->empleado->empresa_id) return true;
        return false;
    }

    public function delete(Usuario $user, Trabajo $trabajo)
    {
        if ($user->rol === 'ADMIN') return true;
        if ($user->rol === 'EMPRESA' && $user->empresa && $trabajo->empresa_id === $user->empresa->id) return true;
        if ($user->rol === 'EMPLEADO' && $user->empleado && $trabajo->empresa_id === $user->empleado->empresa_id) return true;
        return false;
    }
}
