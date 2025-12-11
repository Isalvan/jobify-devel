<?php

namespace App\Policies;

use App\Models\Empresa;
use App\Models\Usuario;
use Illuminate\Auth\Access\HandlesAuthorization;

class EmpresaPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return true;
    }

    public function view(Usuario $user, Empresa $empresa)
    {
        return true;
    }

    public function create(Usuario $user)
    {
        return $user->rol === 'EMPRESA' && !$user->empresa;
    }

    public function update(Usuario $user, Empresa $empresa)
    {
        return $user->rol === 'ADMIN' || ($user->rol === 'EMPRESA' && $user->id === $empresa->usuario_id);
    }

    public function delete(Usuario $user, Empresa $empresa)
    {
        return $user->rol === 'ADMIN';
    }
}
