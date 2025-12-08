<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Http\Requests\UpdateUsuarioRequest;
use App\Http\Resources\UsuarioResource;
use Illuminate\Http\Request;
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
    public function index()
    {
        $this->authorize('viewAny', Usuario::class);
        return UsuarioResource::collection(Usuario::paginate(15));
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
        // $this->authorize('view', $usuario); // Public access allowed for everyone
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
