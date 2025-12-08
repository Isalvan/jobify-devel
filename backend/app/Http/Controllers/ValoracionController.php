<?php

namespace App\Http\Controllers;

use App\Models\Valoracion;
use App\Http\Requests\StoreValoracionRequest;
use App\Http\Resources\ValoracionResource;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class ValoracionController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/valoraciones",
     *     summary="Listar valoraciones",
     *     tags={"Valoraciones"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de valoraciones"
     *     )
     * )
     */
    public function index()
    {
        return ValoracionResource::collection(Valoracion::all());
    }

    /**
     * @OA\Post(
     *     path="/api/valoraciones",
     *     summary="Crear valoración",
     *     tags={"Valoraciones"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/StoreValoracionRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Valoración creada"
     *     )
     * )
     */
    public function store(StoreValoracionRequest $request)
    {
        $this->authorize('create', Valoracion::class);

        $valoracion = Valoracion::create($request->validated());

        return new ValoracionResource($valoracion);
    }
}
