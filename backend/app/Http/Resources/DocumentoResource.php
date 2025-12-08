<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\AplicacionResource;

class DocumentoResource extends JsonResource
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
            'aplicacion_id' => $this->aplicacion_id,
            'tipo' => $this->tipo,
            'ruta_archivo' => $this->ruta_archivo,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'aplicacion' => new AplicacionResource($this->whenLoaded('aplicacion')),
        ];
    }
}
