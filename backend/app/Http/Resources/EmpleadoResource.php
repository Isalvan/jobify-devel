<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UsuarioResource;
use App\Http\Resources\EmpresaResource;

class EmpleadoResource extends JsonResource
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
            'empresa_id' => $this->empresa_id,
            'apellidos' => $this->apellidos,
            'puesto' => $this->puesto,
            'fecha_nacimiento' => $this->fecha_nacimiento,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'usuario' => new UsuarioResource($this->whenLoaded('usuario')),
            'empresa' => new EmpresaResource($this->whenLoaded('empresa')),
        ];
    }
}
