<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="StoreValoracionRequest",
 *     title="Store Valoracion Request",
 *     description="Datos para crear una nueva valoración",
 *     required={"trabajo_id", "candidato_id", "puntuacion"},
 *     @OA\Property(
 *         property="trabajo_id",
 *         type="integer",
 *         description="ID del trabajo a valorar",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="candidato_id",
 *         type="integer",
 *         description="ID del candidato evaluado",
 *         example=1
 *     ),
 *     @OA\Property(
 *         property="puntuacion",
 *         type="integer",
 *         description="Puntuación (1-5)",
 *         minimum=1,
 *         maximum=5,
 *         example=5
 *     ),
 *     @OA\Property(
 *         property="comentario",
 *         type="string",
 *         description="Comentario sobre la valoración",
 *         example="Excelente desempeño."
 *     )
 * )
 */
class StoreValoracionRequest extends FormRequest
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
            'trabajo_id' => ['required', 'exists:trabajos,id'],
            'puntuacion' => ['required', 'integer', 'min:1', 'max:5'],
            'comentario' => ['nullable', 'string'],
        ];
    }
}
