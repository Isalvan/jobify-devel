<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use App\Models\Aplicacion;
use App\Http\Resources\DocumentoResource;
use App\Http\Requests\StoreDocumentoRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenApi\Annotations as OA;

class DocumentoController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/documentos",
     *     summary="Subir documento",
     *     tags={"Documentos"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="aplicacion_id",
     *                     type="integer",
     *                     description="ID de la aplicación"
     *                 ),
     *                 @OA\Property(
     *                     property="archivo",
     *                     type="string",
     *                     format="binary",
     *                     description="Archivo a subir"
     *                 ),
     *                 @OA\Property(
     *                     property="tipo",
     *                     type="string",
     *                     description="Tipo de documento (ej. CV, Carta)"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Documento subido"
     *     )
     * )
     */
    public function store(StoreDocumentoRequest $request)
    {
        $aplicacion = Aplicacion::findOrFail($request->aplicacion_id);

        if ($aplicacion->candidato->usuario_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $file = $request->file('archivo');
        $path = $file->store('documentos', 'public');

        $documento = Documento::create([
            'aplicacion_id' => $request->aplicacion_id,
            'tipo' => $request->tipo ?? $file->getClientOriginalExtension(),
            'ruta_archivo' => $path,
        ]);

        return new DocumentoResource($documento);
    }

    /**
     * @OA\Get(
     *     path="/api/documentos/{documento}",
     *     summary="Descargar documento",
     *     tags={"Documentos"},
     *     @OA\Parameter(
     *         name="documento",
     *         in="path",
     *         required=true,
     *         description="ID del documento",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Archivo descargado"
     *     )
     * )
     */
    public function show(Documento $documento)
    {
        $this->authorize('view', $documento);

        return Storage::disk('public')->download($documento->ruta_archivo);
    }
}
