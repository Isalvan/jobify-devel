<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="StoreEmpleadoRequest",
 *     title="Store Empleado Request",
 *     description="Datos para crear un nuevo empleado",
 *     required={"apellidos", "puesto"},
 *     @OA\Property(
 *         property="apellidos",
 *         type="string",
 *         description="Apellidos del empleado",
 *         example="Pérez"
 *     ),
 *     @OA\Property(
 *         property="puesto",
 *         type="string",
 *         description="Puesto del empleado",
 *         example="Gerente de Ventas"
 *     ),
 *     @OA\Property(
 *         property="fecha_nacimiento",
 *         type="string",
 *         format="date",
 *         description="Fecha de nacimiento",
 *         example="1985-06-15"
 *     )
 * )
 */
class StoreEmpleadoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:usuarios'],
            'password' => ['required', 'string', 'min:8'],
            'apellidos' => ['required', 'string', 'max:255'],
            'puesto' => ['required', 'string', 'max:255'],
            'fecha_nacimiento' => ['nullable', 'date'],
        ];
    }
}
