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
            'titulo' => $this->titulo,
            'slug' => $this->slug,
            'descripcion' => $this->descripcion,
            'salario' => $this->salario,
            'ubicacion' => $this->ubicacion,
            'tipo_trabajo' => $this->tipo_trabajo,
            'estado' => $this->estado,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'empresa' => new EmpresaResource($this->whenLoaded('empresa')),
            'categorias' => $this->whenLoaded('categorias'), // We might need a CategoriaResource too
            'aplicaciones_count' => $this->whenCounted('aplicaciones'),
        ];
    }
}
