<?php

namespace App\Policies;

use App\Models\Valoracion;
use App\Models\Usuario;
use Illuminate\Auth\Access\HandlesAuthorization;

class ValoracionPolicy
{
    use HandlesAuthorization;

    public function viewAny(Usuario $user)
    {
        return true;
    }

    public function view(Usuario $user, Valoracion $valoracion)
    {
        return true;
    }

    public function create(Usuario $user)
    {
        return true;
    }

    public function update(Usuario $user, Valoracion $valoracion)
    {
        $candidatoId = \App\Models\Candidato::where('usuario_id', $user->id)->value('id');
        return ($candidatoId && (int)$candidatoId === (int)$valoracion->candidato_id) || $user->esAdministrador();
    }

    public function delete(Usuario $user, Valoracion $valoracion)
    {
        $candidatoId = \App\Models\Candidato::where('usuario_id', $user->id)->value('id');
        return ($candidatoId && (int)$candidatoId === (int)$valoracion->candidato_id) || $user->esAdministrador();
    }
}
