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
        $query = Trabajo::query()->with(['empresa.usuario']);

        $isOwnerView = false;

        if ($request->has('empresa_id')) {
            $empresaId = $request->empresa_id;

            // Resolve 'me' to the actual company ID if user is authenticated
            $user = $request->user('sanctum');

            if ($empresaId === 'me' && $user) {
                if ($user->empresa) {
                    $empresaId = $user->empresa->id;
                } elseif ($user->empleado) {
                    $empresaId = $user->empleado->empresa_id;
                }
            }
            if ($empresaId) {
                $query->porEmpresa($empresaId);

                // If the user belongs to the requested company, allow viewing non-public jobs
                if ($user && (($user->empresa && $user->empresa->id == $empresaId) || ($user->empleado && $user->empleado->empresa_id == $empresaId))) {
                    $isOwnerView = true;
                }
            }
        }

        // Admins can view everything
        if ($request->user('sanctum')?->esAdministrador()) {
            $isOwnerView = true;
        }

        // Only filter by active/published if NOT the owner viewing their own jobs
        if (!$isOwnerView) {
            $query->activa();
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('titulo', 'like', "%{$search}%")
                    ->orWhereHas('empresa.usuario', function ($q) use ($search) {
                        $q->where('nombre', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('location')) {
            $query->where('ubicacion', 'like', '%' . $request->location . '%');
        }

        if ($request->filled('salary_min')) {
            $query->where('salario', '>=', $request->salary_min);
        }

        if ($request->filled('salary_max')) {
            $query->where('salario', '<=', $request->salary_max);
        }

        if ($request->filled('job_type')) {
            $query->where('tipo_trabajo', $request->job_type);
        }

        if ($request->filled('modalidad')) {
            $query->where('modalidad', $request->modalidad);
        }

        if ($request->filled('category_id')) {
            $query->whereHas('categorias', function ($q) use ($request) {
                $q->where('categorias.id', $request->category_id);
            });
        }

        return TrabajoResource::collection($query->paginate(15));
    }

    /**
     * @OA\Get(
     *     path="/api/trabajos/mejores-valorados",
     *     summary="Listar trabajos mejor valorados",
     *     tags={"Trabajos"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de trabajos ordenados por valoración"
     *     )
     * )
     */
    public function topRated()
    {
        $trabajos = Trabajo::activa()
            ->with(['empresa.usuario'])
            ->withAvg('valoraciones', 'puntuacion')
            ->orderByDesc('valoraciones_avg_puntuacion')
            ->limit(6)
            ->get();

        return TrabajoResource::collection($trabajos);
    }

    /**
     * @OA\Get(
     *     path="/api/ubicaciones",
     *     summary="Listar ubicaciones disponibles",
     *     tags={"Trabajos"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de ubicaciones únicas"
     *     )
     * )
     */
    public function locations()
    {
        $locations = Trabajo::activa()
            ->select('ubicacion')
            ->distinct()
            ->orderBy('ubicacion')
            ->pluck('ubicacion');

        return response()->json($locations);
    }

    /**
     * @OA\Get(
     *     path="/api/trabajos/{trabajo}/valoraciones",
     *     summary="Listar valoraciones de un trabajo",
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
     *         description="Lista paginada de valoraciones"
     *     )
     * )
     */
    public function getReviews(Trabajo $trabajo)
    {
        $valoraciones = $trabajo->valoraciones()
            ->with('candidato.usuario')
            ->latest()
            ->paginate(5);

        return \App\Http\Resources\ValoracionResource::collection($valoraciones);
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

        $empresaId = null;
        if ($request->user()->empresa) {
            $empresaId = $request->user()->empresa->id;
        } elseif ($request->user()->empleado) {
            $empresaId = $request->user()->empleado->empresa_id;
        }

        if (!$empresaId) {
            abort(403, 'No tienes una empresa asociada.');
        }

        $data = $request->validated();
        $data['empresa_id'] = $empresaId;

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
        $trabajo->load(['empresa.usuario'])
            ->loadCount('valoraciones')
            ->loadAggregate('valoraciones', 'puntuacion', 'avg');

        return new TrabajoResource($trabajo);
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
