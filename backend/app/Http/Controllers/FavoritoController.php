<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorito;
use App\Models\Trabajo;
use App\Http\Resources\TrabajoResource;
use OpenApi\Annotations as OA;

class FavoritoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/favoritos",
     *     summary="Listar trabajos favoritos del candidato",
     *     tags={"Favoritos"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de trabajos favoritos"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user->candidato) {
            return response()->json(['message' => 'Solo los candidatos tienen favoritos.'], 403);
        }

        $favoritos = $user->candidato->trabajosFavoritos()->with('empresa.usuario')->paginate(20);

        return TrabajoResource::collection($favoritos);
    }

    /**
     * @OA\Post(
     *     path="/api/favoritos/toggle",
     *     summary="Alternar favorito (Añadir/Quitar)",
     *     tags={"Favoritos"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"trabajo_id"},
     *             @OA\Property(property="trabajo_id", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Estado actualizado"
     *     )
     * )
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'trabajo_id' => 'required|exists:trabajos,id',
        ]);

        $user = $request->user();
        if (!$user->candidato) {
            return response()->json(['message' => 'Solo los candidatos pueden guardar favoritos.'], 403);
        }

        $candidatoId = $user->candidato->id;
        $trabajoId = $request->input('trabajo_id');

        $favorito = Favorito::where('candidato_id', $candidatoId)
            ->where('trabajo_id', $trabajoId)
            ->first();

        if ($favorito) {
            $favorito->delete();
            return response()->json(['message' => 'Eliminado de favoritos', 'is_favorito' => false]);
        } else {
            Favorito::create([
                'candidato_id' => $candidatoId,
                'trabajo_id' => $trabajoId,
            ]);
            return response()->json(['message' => 'Añadido a favoritos', 'is_favorito' => true]);
        }
    }
}
