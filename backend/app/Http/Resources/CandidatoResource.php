<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UsuarioResource;

class CandidatoResource extends JsonResource
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
            'usuario_id' => $this->usuario_id,
            'apellidos' => $this->apellidos,
            'fecha_nacimiento' => $this->fecha_nacimiento,
            'descripcion' => $this->descripcion,
            'ubicacion' => $this->ubicacion,
            'url_cv' => $this->url_cv,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'usuario' => new UsuarioResource($this->whenLoaded('usuario')),
        ];
    }
}
