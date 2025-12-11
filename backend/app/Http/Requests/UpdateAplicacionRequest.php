<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="UpdateAplicacionRequest",
 *     title="Update Aplicacion Request",
 *     description="Datos para actualizar el estado de una aplicación",
 *     required={"estado"},
 *     @OA\Property(
 *         property="estado",
 *         type="string",
 *         description="Nuevo estado de la aplicación",
 *         enum={"PENDIENTE", "VISTO", "EN_PROCESO", "FINALISTA", "ACEPTADO", "RECHAZADO"},
 *         example="aceptado"
 *     )
 * )
 */
class UpdateAplicacionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'estado' => ['required', 'in:PENDIENTE,VISTO,EN_PROCESO,FINALISTA,ACEPTADO,RECHAZADO,ACEPTADA,RECHAZADA,pendiente,aceptado,rechazado'],
        ];
    }
}
