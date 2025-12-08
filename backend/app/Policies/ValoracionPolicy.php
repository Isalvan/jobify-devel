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
        // Only enterprise can review candidate? Or candidate review job?
        // Usually job boards: Company reviews Candidate OR Candidate reviews Company/Job.
        // Assuming Candidate reviews Job based on schema (puntuacion, comentario for trabajo_id?)
        // Migration says: table->foreign('candidato_id')->references('id')->on('users');
        // This is ambiguous. Let's assume User can create if they have applied or something.
        // For now, allow authenticated users.
        return true;
    }

    public function update(Usuario $user, Valoracion $valoracion)
    {
        return $user->id === $valoracion->candidato_id || $user->rol === 'ADMIN';
    }

    public function delete(Usuario $user, Valoracion $valoracion)
    {
        return $user->id === $valoracion->candidato_id || $user->rol === 'ADMIN';
    }
}
