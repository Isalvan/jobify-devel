<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Http\Requests\StoreEmpleadoRequest;
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

        // Validated data
        $data = $request->validated();

        // 1. Create User
        $usuario = \App\Models\Usuario::create([
            'nombre' => $data['nombre'],
            'email' => $data['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($data['password']),
            'rol' => 'EMPLEADO',
            'telefono' => '', // Optional
        ]);

        // 2. Create Empleado linked to User and Empresa
        $empleado = Empleado::create([
            'usuario_id' => $usuario->id,
            'empresa_id' => $empresa->id,
            'apellidos' => $data['apellidos'],
            'puesto' => $data['puesto'],
            'fecha_nacimiento' => $data['fecha_nacimiento'] ?? null,
        ]);

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
