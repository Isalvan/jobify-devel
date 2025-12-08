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
        $user = $request->user();
        if (!$user->candidato) {
            abort(403, 'Solo los candidatos pueden realizar valoraciones.');
        }


        $data = $request->validated();

        $valoracion = Valoracion::updateOrCreate(
            [
                'trabajo_id' => $request->trabajo_id,
                'candidato_id' => $user->candidato->id,
            ],
            [
                'puntuacion' => $request->puntuacion,
                'comentario' => $request->comentario,
            ]
        );

        return new ValoracionResource($valoracion);
    }
}
