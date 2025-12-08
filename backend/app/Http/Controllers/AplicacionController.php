<?php

namespace App\Http\Controllers;

use App\Models\Aplicacion;
use App\Models\Candidato;
use App\Models\Trabajo;
use App\Models\Empresa;
use App\Http\Requests\StoreAplicacionRequest;
use App\Http\Requests\UpdateAplicacionRequest;
use App\Http\Resources\AplicacionResource;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class AplicacionController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/aplicaciones",
     *     summary="Listar aplicaciones",
     *     tags={"Aplicaciones"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de aplicaciones"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Aplicacion::class);

        $user = $request->user();

        if ($user->esAdministrador()) {
            return AplicacionResource::collection(
                Aplicacion::with(['candidato', 'trabajo.empresa'])->paginate(20)
            );
        }

        if ($user->candidato) {
            return AplicacionResource::collection(
                Aplicacion::porCandidato($user->candidato->id)
                    ->with('trabajo.empresa.usuario')
                    ->latest()
                    ->get()
            );
        }

        if ($user->empresa) {
            return AplicacionResource::collection(
                Aplicacion::porEmpresa($user->empresa->id)
                    ->with(['candidato', 'trabajo'])
                    ->get()
            );
        }

        return response()->json([], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/aplicaciones",
     *     summary="Aplicar a una oferta",
     *     tags={"Aplicaciones"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/StoreAplicacionRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Aplicación creada"
     *     )
     * )
     */
    public function store(StoreAplicacionRequest $request)
    {
        $this->authorize('create', Aplicacion::class);

        $user = $request->user();
        $candidato = $user->candidato;

        $validated = $request->validated();

        $exists = Aplicacion::where('trabajo_id', $validated['trabajo_id'])
            ->where('candidato_id', $candidato->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Ya has aplicado a esta oferta.'], 409);
        }

        $aplicacion = Aplicacion::create([
            'trabajo_id' => $validated['trabajo_id'],
            'candidato_id' => $candidato->id,
            'mensaje' => $validated['mensaje'] ?? null,
            'estado' => 'PENDIENTE',
        ]);

        $path = null;
        if ($request->hasFile('cv_file')) {
            $path = $request->file('cv_file')->store('cvs', 'public');
        } elseif ($request->boolean('use_profile_cv') && $candidato->url_cv) {
            $baseUrl = asset('storage/');
            if (str_starts_with($candidato->url_cv, $baseUrl)) {
                $relativePath = str_replace($baseUrl, '', $candidato->url_cv);
                if (\Illuminate\Support\Facades\Storage::disk('public')->exists($relativePath)) {
                    $newPath = 'cvs/copy_' . time() . '_' . basename($relativePath);
                    \Illuminate\Support\Facades\Storage::disk('public')->copy($relativePath, $newPath);
                    $path = $newPath;
                }
            }
        }

        if ($path) {
            \App\Models\DocumentoArchivo::create([
                'aplicacion_id' => $aplicacion->id,
                'tipo' => 'cv',
                'ruta_archivo' => $path,
            ]);
        }

        return new AplicacionResource($aplicacion);
    }

    /**
     * @OA\Put(
     *     path="/api/aplicaciones/{aplicacion}",
     *     summary="Actualizar estado de aplicación",
     *     tags={"Aplicaciones"},
     *     @OA\Parameter(
     *         name="aplicacion",
     *         in="path",
     *         required=true,
     *         description="ID de la aplicación",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/UpdateAplicacionRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Aplicación actualizada"
     *     )
     * )
     */
    public function update(UpdateAplicacionRequest $request, Aplicacion $aplicacion)
    {
        $this->authorize('update', $aplicacion);

        $aplicacion->update($request->validated());

        return new AplicacionResource($aplicacion);
    }
}
