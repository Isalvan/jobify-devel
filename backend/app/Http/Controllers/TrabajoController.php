<?php

namespace App\Http\Controllers;

use App\Models\Trabajo;
use App\Models\Empresa;
use App\Http\Requests\StoreTrabajoRequest;
use App\Http\Requests\UpdateTrabajoRequest;
use App\Http\Resources\TrabajoResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use OpenApi\Annotations as OA;

class TrabajoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/trabajos",
     *     summary="Listar trabajos",
     *     tags={"Trabajos"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de trabajos"
     *     )
     * )
     */
    public function index(Request $request)
    {
        // Public access allowed, but we can filter if needed
        // $this->authorize('viewAny', Trabajo::class);

        $query = Trabajo::activa()->with('empresa');

        // Optional: Filter by company if requested or context implied (though usually public list is for everyone)
        if ($request->has('empresa_id')) {
            $query->porEmpresa($request->empresa_id);
        }

        return TrabajoResource::collection($query->paginate(15));
    }

    /**
     * @OA\Post(
     *     path="/api/trabajos",
     *     summary="Crear oferta de trabajo",
     *     tags={"Trabajos"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/StoreTrabajoRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Trabajo creado"
     *     )
     * )
     */
    public function store(StoreTrabajoRequest $request)
    {
        $this->authorize('create', Trabajo::class);

        $empresa = $request->user()->empresa;
        // Policy ensures $empresa exists if role is EMPRESA

        $data = $request->validated();
        $data['empresa_id'] = $empresa->id;

        $trabajo = Trabajo::create($data);

        return new TrabajoResource($trabajo);
    }

    /**
     * @OA\Get(
     *     path="/api/trabajos/{trabajo}",
     *     summary="Ver trabajo",
     *     tags={"Trabajos"},
     *     @OA\Parameter(
     *         name="trabajo",
     *         in="path",
     *         required=true,
     *         description="ID del trabajo",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalles del trabajo"
     *     )
     * )
     */
    public function show(Trabajo $trabajo)
    {
        return new TrabajoResource($trabajo->load('empresa'));
    }

    /**
     * @OA\Put(
     *     path="/api/trabajos/{trabajo}",
     *     summary="Actualizar trabajo",
     *     tags={"Trabajos"},
     *     @OA\Parameter(
     *         name="trabajo",
     *         in="path",
     *         required=true,
     *         description="ID del trabajo",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateTrabajoRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Trabajo actualizado"
     *     )
     * )
     */
    public function update(UpdateTrabajoRequest $request, Trabajo $trabajo)
    {
        $this->authorize('update', $trabajo);

        $data = $request->validated();


        $trabajo->update($data);

        return new TrabajoResource($trabajo);
    }

    /**
     * @OA\Delete(
     *     path="/api/trabajos/{trabajo}",
     *     summary="Eliminar trabajo",
     *     tags={"Trabajos"},
     *     @OA\Parameter(
     *         name="trabajo",
     *         in="path",
     *         required=true,
     *         description="ID del trabajo",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Trabajo eliminado"
     *     )
     * )
     */
    public function destroy(Trabajo $trabajo)
    {
        $this->authorize('delete', $trabajo);

        $trabajo->delete();
        return response()->noContent();
    }
}
