<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UsuarioResource extends JsonResource
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
            'nombre' => $this->nombre,
            'email' => $this->email,
            'foto_perfil' => $this->foto_perfil,
            'telefono' => $this->telefono,
            'estado' => $this->estado,
            'rol' => $this->rol,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'candidato' => new CandidatoResource($this->whenLoaded('candidato')),
            'empresa' => new EmpresaResource($this->whenLoaded('empresa')),
            'empleado' => new EmpleadoResource($this->whenLoaded('empleado')),
        ];
    }
}
