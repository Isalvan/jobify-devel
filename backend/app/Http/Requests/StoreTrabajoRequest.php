<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="StoreTrabajoRequest",
 *     title="Store Trabajo Request",
 *     description="Datos para crear un nuevo trabajo",
 *     required={"titulo", "descripcion", "ubicacion", "tipo_trabajo"},
 *     @OA\Property(
 *         property="titulo",
 *         type="string",
 *         description="Título del trabajo",
 *         example="Desarrollador Full Stack"
 *     ),
 *     @OA\Property(
 *         property="descripcion",
 *         type="string",
 *         description="Descripción del trabajo",
 *         example="Buscamos experto en Laravel."
 *     ),
 *     @OA\Property(
 *         property="salario",
 *         type="number",
 *         description="Salario ofrecido",
 *         example=3000.00
 *     ),
 *     @OA\Property(
 *         property="ubicacion",
 *         type="string",
 *         description="Ubicación del trabajo",
 *         example="Remoto"
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
class StoreTrabajoRequest extends FormRequest
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
            'titulo' => ['required', 'string', 'max:255'],
            'descripcion' => ['required', 'string'],
            'salario' => ['nullable', 'numeric', 'min:0'],
            'ubicacion' => ['required', 'string', 'max:255'],
            'tipo_trabajo' => ['required', 'in:Tiempo Completo,Medio Tiempo,Freelance,Temporal'],
            'estado' => ['nullable', 'in:publicado,borrador,archivado'],
        ];
    }
}
