<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\EmpresaResource;

class TrabajoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'empresa_id' => $this->empresa_id,
            'titulo' => $this->titulo,
            'slug' => $this->slug,
            'descripcion' => $this->descripcion,
            'salario' => $this->salario,
            'ubicacion' => $this->ubicacion,
            'tipo_trabajo' => $this->tipo_trabajo,
            'modalidad' => $this->modalidad,
            'estado' => $this->estado,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'empresa' => new EmpresaResource($this->whenLoaded('empresa')),
            'categorias' => $this->whenLoaded('categorias'),
            'aplicaciones_count' => $this->whenCounted('aplicaciones'),
            'valoraciones_count' => $this->whenCounted('valoraciones'),
            'valoraciones_avg' => $this->whenAggregated('valoraciones', 'puntuacion', 'avg'),
            'mi_valoracion' => $this->when(
                $request->user('sanctum') && $request->user('sanctum')->candidato,
                function () use ($request) {
                    return $this->resource->valoraciones()
                        ->where('candidato_id', $request->user('sanctum')->candidato->id)
                        ->first();
                }
            ),
            'mi_aplicacion' => $this->when(
                $request->user('sanctum') && $request->user('sanctum')->candidato,
                function () use ($request) {
                    return $this->resource->aplicaciones()
                        ->where('candidato_id', $request->user('sanctum')->candidato->id)
                        ->first();
                }
            ),
            'is_favorito' => $this->when(
                $request->user('sanctum') && $request->user('sanctum')->candidato,
                function () use ($request) {
                    return \App\Models\Favorito::where('candidato_id', $request->user('sanctum')->candidato->id)
                        ->where('trabajo_id', $this->resource->id)
                        ->exists();
                }
            ),
        ];
    }
}
