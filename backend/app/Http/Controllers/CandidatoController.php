<?php

namespace App\Http\Controllers;

use App\Models\Candidato;
use App\Http\Requests\UpdateCandidatoRequest;
use App\Http\Resources\CandidatoResource;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class CandidatoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/candidatos",
     *     summary="Listar candidatos",
     *     tags={"Candidatos"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de candidatos"
     *     )
     * )
     */
    public function index()
    {
        $this->authorize('viewAny', Candidato::class);
        return CandidatoResource::collection(Candidato::paginate(15));
    }

    /**
     * @OA\Post(
     *     path="/api/candidatos",
     *     summary="Crear perfil de candidato",
     *     tags={"Candidatos"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateCandidatoRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Candidato creado"
     *     )
     * )
     */
    public function store(UpdateCandidatoRequest $request)
    {
        $this->authorize('create', Candidato::class);

        $data = $request->validated();
        $data['usuario_id'] = $request->user()->id;

        $candidato = Candidato::create($data);

        return new CandidatoResource($candidato);
    }

    /**
     * @OA\Get(
     *     path="/api/candidatos/{candidato}",
     *     summary="Ver candidato",
     *     tags={"Candidatos"},
     *     @OA\Parameter(
     *         name="candidato",
     *         in="path",
     *         required=true,
     *         description="ID del candidato",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalles del candidato"
     *     )
     * )
     */
    public function show(Candidato $candidato)
    {
        $this->authorize('view', $candidato);
        return new CandidatoResource($candidato);
    }

    /**
     * @OA\Put(
     *     path="/api/candidatos/{candidato}",
     *     summary="Actualizar candidato",
     *     tags={"Candidatos"},
     *     @OA\Parameter(
     *         name="candidato",
     *         in="path",
     *         required=true,
     *         description="ID del candidato",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateCandidatoRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Candidato actualizado"
     *     )
     * )
     */
    public function update(UpdateCandidatoRequest $request, Candidato $candidato)
    {
        $this->authorize('update', $candidato);

        $data = $request->validated();

        if ($request->hasFile('cv_file')) {
            $path = $request->file('cv_file')->store('cvs_perfil', 'public');
            $data['url_cv'] = asset('storage/' . $path);
        }

        $candidato->update($data);

        return new CandidatoResource($candidato);
    }
}
