<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Http\Requests\StoreEmpleadoRequest;
use App\Http\Requests\UpdateEmpleadoRequest;
use App\Http\Resources\EmpleadoResource;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class EmpleadoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/empleados",
     *     summary="Listar empleados",
     *     tags={"Empleados"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de empleados"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Empleado::class);

        $user = $request->user();
        if ($user->esAdministrador()) {
            return EmpleadoResource::collection(Empleado::with(['usuario', 'empresa'])->get());
        }

        if ($user->empresa) {
            return EmpleadoResource::collection($user->empresa->empleados()->with('usuario')->get());
        }

        return response()->json([], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/empleados",
     *     summary="Registrar empleado",
     *     tags={"Empleados"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/StoreEmpleadoRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Empleado creado"
     *     )
     * )
     */
    public function store(StoreEmpleadoRequest $request)
    {
        $this->authorize('create', Empleado::class);

        $empresa = $request->user()->empresa;

        return response()->json(['message' => 'Funcionalidad de crear empleado requiere lógica de usuario.'], 501);
    }

    /**
     * @OA\Get(
     *     path="/api/empleados/{empleado}",
     *     summary="Ver empleado",
     *     tags={"Empleados"},
     *     @OA\Parameter(
     *         name="empleado",
     *         in="path",
     *         required=true,
     *         description="ID del empleado",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalles del empleado"
     *     )
     * )
     */
    public function show(Empleado $empleado)
    {
        $this->authorize('view', $empleado);
        $empleado->load('usuario');
        return new EmpleadoResource($empleado);
    }

    /**
     * @OA\Put(
     *     path="/api/empleados/{empleado}",
     *     summary="Actualizar empleado",
     *     tags={"Empleados"},
     *     @OA\Parameter(
     *         name="empleado",
     *         in="path",
     *         required=true,
     *         description="ID del empleado",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateEmpleadoRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Empleado actualizado"
     *     )
     * )
     */
    public function update(UpdateEmpleadoRequest $request, Empleado $empleado)
    {
        $this->authorize('update', $empleado);

        $empleado->update($request->validated());

        return new EmpleadoResource($empleado);
    }

    /**
     * @OA\Delete(
     *     path="/api/empleados/{empleado}",
     *     summary="Eliminar empleado",
     *     tags={"Empleados"},
     *     @OA\Response(
     *         response=204,
     *         description="Empleado eliminado"
     *     )
     * )
     */
    public function destroy(Empleado $empleado)
    {
        $this->authorize('delete', $empleado);
        $empleado->delete();
        return response()->noContent();
    }
}
