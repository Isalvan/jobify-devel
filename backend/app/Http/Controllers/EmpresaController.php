<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Http\Requests\StoreEmpresaRequest;
use App\Http\Requests\UpdateEmpresaRequest;
use App\Http\Resources\EmpresaResource;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class EmpresaController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/empresas",
     *     summary="Listar empresas",
     *     tags={"Empresas"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de empresas"
     *     )
     * )
     */
    public function index()
    {
        return EmpresaResource::collection(Empresa::paginate(15));
    }

    /**
     * @OA\Get(
     *     path="/api/empresas/destacadas",
     *     summary="Listar empresas destacadas",
     *     tags={"Empresas"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de empresas destacadas (con decremento de impresiones)"
     *     )
     * )
     */
    public function destacadas()
    {
        $empresas = Empresa::with('usuario')->destacada()->inRandomOrder()->limit(6)->get();

        foreach ($empresas as $empresa) {
            $empresa->decrement('impresiones_restantes');
        }

        return EmpresaResource::collection($empresas);
    }

    /**
     * @OA\Post(
     *     path="/api/empresas",
     *     summary="Crear empresa",
     *     tags={"Empresas"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/StoreEmpresaRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Empresa creada"
     *     )
     * )
     */
    public function store(StoreEmpresaRequest $request)
    {
        $this->authorize('create', Empresa::class);

        $data = $request->validated();
        $data['usuario_id'] = $request->user()->id;

        $empresa = Empresa::create($data);

        return new EmpresaResource($empresa);
    }

    /**
     * @OA\Get(
     *     path="/api/empresas/{empresa}",
     *     summary="Ver empresa",
     *     tags={"Empresas"},
     *     @OA\Parameter(
     *         name="empresa",
     *         in="path",
     *         required=true,
     *         description="ID de la empresa",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalles de la empresa"
     *     )
     * )
     */
    public function show(Empresa $empresa)
    {
        return new EmpresaResource($empresa);
    }

    /**
     * @OA\Put(
     *     path="/api/empresas/{empresa}",
     *     summary="Actualizar empresa",
     *     tags={"Empresas"},
     *     @OA\Parameter(
     *         name="empresa",
     *         in="path",
     *         required=true,
     *         description="ID de la empresa",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateEmpresaRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Empresa actualizada"
     *     )
     * )
     */
    public function update(UpdateEmpresaRequest $request, Empresa $empresa)
    {
        $this->authorize('update', $empresa);

        $empresa->update($request->validated());

        return new EmpresaResource($empresa);
    }

    /**
     * @OA\Delete(
     *     path="/api/empresas/{empresa}",
     *     summary="Eliminar empresa",
     *     tags={"Empresas"},
     *     @OA\Parameter(
     *         name="empresa",
     *         in="path",
     *         required=true,
     *         description="ID de la empresa",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Empresa eliminada"
     *     )
     * )
     */
    public function destroy(Request $request, Empresa $empresa)
    {
        $this->authorize('delete', $empresa);

        $empresa->delete();
        return response()->noContent();
    }
}
