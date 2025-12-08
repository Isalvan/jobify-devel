<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\TrabajoResource;
use App\Http\Resources\CandidatoResource;

class AplicacionResource extends JsonResource
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
            'trabajo_id' => $this->trabajo_id,
            'candidato_id' => $this->candidato_id,
            'mensaje' => $this->mensaje,
            'estado' => $this->estado,
            'fecha_aplicacion' => $this->fecha_aplicacion,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'trabajo' => new TrabajoResource($this->whenLoaded('trabajo')),
            'candidato' => new CandidatoResource($this->whenLoaded('candidato')),
        ];
    }
}
