<?php

namespace App\Http\Controllers;

use App\Models\Gasto;
use App\Models\Empresa;
use Illuminate\Http\Request;
use App\Support\QueryHelper;
use OpenApi\Annotations as OA;

class GastoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/gastos",
     *     summary="Listar gastos",
     *     tags={"Gastos"},
     *     @OA\Parameter(
     *         name="empresa_id",
     *         in="query",
     *         description="Filtrar por ID de empresa",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lista de gastos"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Gasto::class);

        $query = Gasto::with('empresa.usuario');

        if ($request->has('empresa_id') && $request->empresa_id) {
            $query->where('empresa_id', $request->empresa_id);
        }

        if ($request->has('estado') && $request->estado) {
            $query->where('estado', $request->estado);
        }

        if ($request->has('search')) {
            $search = QueryHelper::escapeLike($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('concepto', 'like', "%{$search}%")
                  ->orWhereHas('empresa.usuario', function ($sq) use ($search) {
                      $sq->where('nombre', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->has('all')) {
            return $query->orderBy('fecha', 'desc')->get();
        }

        return $query->orderBy('fecha', 'desc')->paginate($request->input('per_page', 15));
    }

    /**
     * @OA\Get(
     *     path="/api/gastos/stats",
     *     summary="Obtener estadísticas de gastos",
     *     tags={"Gastos"},
     *     @OA\Parameter(
     *         name="empresa_id",
     *         in="query",
     *         description="Filtrar por ID de empresa",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Estadísticas de gastos"
     *     )
     * )
     */
    public function stats(Request $request)
    {
        $this->authorize('viewAny', Gasto::class);

        $query = Gasto::query();

        if ($request->has('empresa_id') && $request->empresa_id) {
            $query->where('empresa_id', $request->empresa_id);
        }

        $stats = [
            'total' => $query->sum('cantidad'),
            'pagado' => (clone $query)->where('estado', 'PAGADO')->sum('cantidad'),
            'pendiente' => (clone $query)->where('estado', 'PENDIENTE')->sum('cantidad'),
            'cancelado' => (clone $query)->where('estado', 'CANCELADO')->sum('cantidad'),
            'count' => $query->count(),
        ];

        return response()->json($stats);
    }

    /**
     * @OA\Post(
     *     path="/api/gastos",
     *     summary="Crear gasto",
     *     tags={"Gastos"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"empresa_id", "concepto", "cantidad", "fecha"},
     *             @OA\Property(property="empresa_id", type="integer"),
     *             @OA\Property(property="concepto", type="string"),
     *             @OA\Property(property="cantidad", type="number"),
     *             @OA\Property(property="fecha", type="string", format="date"),
     *             @OA\Property(property="estado", type="string", enum={"PENDIENTE", "PAGADO", "CANCELADO"}),
     *             @OA\Property(property="notas", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Gasto creado"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $this->authorize('create', Gasto::class);

        $validated = $request->validate([
            'empresa_id' => 'required|exists:empresas,id',
            'concepto' => 'required|string|max:255',
            'cantidad' => 'required|numeric',
            'fecha' => 'required|date',
            'estado' => 'in:PENDIENTE,PAGADO,CANCELADO',
            'notas' => 'nullable|string',
        ]);

        $gasto = Gasto::create($validated);

        return response()->json($gasto, 201);
    }

    /**
     * @OA\Put(
     *     path="/api/gastos/{gasto}",
     *     summary="Actualizar gasto",
     *     tags={"Gastos"},
     *     @OA\Parameter(
     *         name="gasto",
     *         in="path",
     *         required=true,
     *         description="ID del gasto",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="concepto", type="string"),
     *             @OA\Property(property="cantidad", type="number"),
     *             @OA\Property(property="fecha", type="string", format="date"),
     *             @OA\Property(property="estado", type="string", enum={"PENDIENTE", "PAGADO", "CANCELADO"}),
     *             @OA\Property(property="notas", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Gasto actualizado"
     *     )
     * )
     */
    public function update(Request $request, Gasto $gasto)
    {
        $this->authorize('update', $gasto);

        $validated = $request->validate([
            'concepto' => 'string|max:255',
            'cantidad' => 'numeric',
            'fecha' => 'date',
            'estado' => 'in:PENDIENTE,PAGADO,CANCELADO',
            'notas' => 'nullable|string',
        ]);

        $gasto->update($validated);

        return response()->json($gasto);
    }

    /**
     * @OA\Delete(
     *     path="/api/gastos/{gasto}",
     *     summary="Eliminar gasto",
     *     tags={"Gastos"},
     *     @OA\Parameter(
     *         name="gasto",
     *         in="path",
     *         required=true,
     *         description="ID del gasto",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Gasto eliminado"
     *     )
     * )
     */
    public function destroy(Gasto $gasto)
    {
        $this->authorize('delete', $gasto);
        $gasto->delete();
        return response()->noContent();
    }
}
