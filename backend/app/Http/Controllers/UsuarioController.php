<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Http\Requests\UpdateUsuarioRequest;
use App\Http\Resources\UsuarioResource;
use Illuminate\Http\Request;
use App\Support\QueryHelper;
use Illuminate\Support\Facades\Hash;
use OpenApi\Annotations as OA;

class UsuarioController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/usuarios",
     *     summary="Listar usuarios",
     *     tags={"Usuarios"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de usuarios"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Usuario::class);
        
        $query = Usuario::query();

        if ($request->has('search')) {
            $search = QueryHelper::escapeLike($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return UsuarioResource::collection($query->paginate($request->input('per_page', 15)));
    }

    /**
     * @OA\Get(
     *     path="/api/usuarios/{usuario}",
     *     summary="Ver usuario",
     *     tags={"Usuarios"},
     *     @OA\Parameter(
     *         name="usuario",
     *         in="path",
     *         required=true,
     *         description="ID del usuario",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalles del usuario"
     *     )
     * )
     */
    public function show(Usuario $usuario)
    {
        $usuario->load(['candidato', 'empresa', 'empleado']);
        return new UsuarioResource($usuario);
    }

    /**
     * @OA\Put(
     *     path="/api/usuarios/{usuario}",
     *     summary="Actualizar usuario",
     *     tags={"Usuarios"},
     *     @OA\Parameter(
     *         name="usuario",
     *         in="path",
     *         required=true,
     *         description="ID del usuario",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateUsuarioRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Usuario actualizado"
     *     )
     * )
     */
    public function update(UpdateUsuarioRequest $request, Usuario $usuario)
    {
        $this->authorize('update', $usuario);

        $validated = $request->validated();

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        if ($request->hasFile('foto_perfil')) {
            $path = $request->file('foto_perfil')->store('perfiles', 'public');
            $validated['foto_perfil'] = $path;
        }

        $usuario->update($validated);

        return new UsuarioResource($usuario);
    }

    /**
     * @OA\Delete(
     *     path="/api/usuarios/{usuario}",
     *     summary="Eliminar usuario",
     *     tags={"Usuarios"},
     *     @OA\Parameter(
     *         name="usuario",
     *         in="path",
     *         required=true,
     *         description="ID del usuario",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Usuario eliminado"
     *     )
     * )
     */
    public function destroy(Usuario $usuario)
    {
        $this->authorize('delete', $usuario);
        $usuario->delete();
        return response()->noContent();
    }
}
