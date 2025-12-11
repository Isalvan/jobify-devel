<?php

namespace App\Policies;

use App\Models\Documento;
use App\Models\Usuario;
use Illuminate\Auth\Access\HandlesAuthorization;

class DocumentoPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return $user->rol === 'ADMIN';
    }

    public function view(Usuario $user, Documento $documento)
    {
        $aplicacion = $documento->aplicacion;
        if (!$aplicacion) return false;

        $isCandidato = $aplicacion->candidato->usuario_id === $user->id;
        $isEmpresa = $aplicacion->trabajo->empresa->usuario_id === $user->id;

        return $isCandidato || $isEmpresa || $user->rol === 'ADMIN';
    }

    public function create(Usuario $user)
    {
        return true;
    }

    public function update(Usuario $user, Documento $documento)
    {
        return false;
    }

    public function delete(Usuario $user, Documento $documento)
    {
        $aplicacion = $documento->aplicacion;
        return $aplicacion && $aplicacion->candidato->usuario_id === $user->id;
    }
}
