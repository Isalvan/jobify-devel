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
        if ($request->user()->rol === 'administrador') {
            return $next($request);
        }

        if (!in_array($request->user()->rol, $roles)) {
            // Log para debugging (opcional)
            // Log::info('User role: ' . $request->user()->rol . ' Required: ' . implode(',', $roles));

            return response()->json(['message' => 'No tienes permisos para realizar esta acción.'], 403);
        }

        return $next($request);
    }
}
