<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Annotations as OA;


/**
 * @OA\Schema(
 *     schema="UpdateTrabajoRequest",
 *     title="Update Trabajo Request",
 *     description="Datos para actualizar un trabajo existente",
 *     @OA\Property(
 *         property="titulo",
 *         type="string",
 *         description="Título del trabajo",
 *         example="Desarrollador Senior"
 *     ),
 *     @OA\Property(
 *         property="descripcion",
 *         type="string",
 *         description="Descripción del trabajo",
 *         example="Liderazgo de equipo técnico."
 *     ),
 *     @OA\Property(
 *         property="salario",
 *         type="number",
 *         description="Salario ofrecido",
 *         example=5000.00
 *     ),
 *     @OA\Property(
 *         property="ubicacion",
 *         type="string",
 *         description="Ubicación del trabajo",
 *         example="Madrid, España"
 *     ),
 *     @OA\Property(
 *         property="tipo_trabajo",
 *         type="string",
 *         enum={"Tiempo Completo", "Medio Tiempo", "Freelance", "Temporal"},
 *         example="Tiempo Completo"
 *     ),
 *     @OA\Property(
 *         property="estado",
 *         type="string",
 *         enum={"publicado", "borrador", "archivado"},
 *         example="publicado"
 *     )
 * )
 */
class UpdateTrabajoRequest extends FormRequest
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
            'titulo' => ['sometimes', 'string', 'max:255'],
            'descripcion' => ['sometimes', 'string'],
            'salario' => ['nullable', 'numeric', 'min:0'],
            'ubicacion' => ['sometimes', 'string', 'max:255'],
            'tipo_trabajo' => ['sometimes', 'in:Tiempo Completo,Medio Tiempo,Freelance,Temporal'],
            'estado' => ['sometimes', 'in:publicado,borrador,cerrado'],
        ];
    }
}
