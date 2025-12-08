<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Si el usuario es administrador, siempre tiene acceso (opcional, pero recomendado)
        // Comparación Case-Insensitive
        $userRole = strtoupper($request->user()->rol);
        
        // Si el usuario es administrador (ADMIN o ADMINISTRADOR), siempre tiene acceso
        if ($userRole === 'ADMIN' || $userRole === 'ADMINISTRADOR') {
            return $next($request);
        }

        // Normalizar roles permitidos a mayúsculas
        $allowedRoles = array_map('strtoupper', $roles);

        if (!in_array($userRole, $allowedRoles)) {
            return response()->json(['message' => 'No tienes permisos para realizar esta acción.'], 403);
        }

        return $next($request);
    }
}
